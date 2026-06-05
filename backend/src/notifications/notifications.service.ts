import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SupabaseService } from '../supabase/supabase.service';
import { calculateDaysLeft } from '../common/warranty';
import { renderTestEmail, renderWarrantyReminderEmail, renderWarrantyReminderText, type EmailReminderProduct } from './notification-email';

type ProductRow = {
  id: string;
  user_id: string;
  name: string;
  warranty_end_date: string | null;
};

type NotificationSettingsRow = {
  user_id: string;
  email_reminders_enabled: boolean;
  thresholds: number[];
};

const READ_IN_APP_RETENTION_DAYS = 90;
const FAILED_EMAIL_RETENTION_DAYS = 30;
const SENT_EMAIL_RETENTION_DAYS = 365;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {
    const host = config.get<string>('SMTP_HOST');
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    this.transporter = this.hasUsableSmtpConfig(host, user, pass)
      ? nodemailer.createTransport({
        host,
        port: Number(config.get<string>('SMTP_PORT') ?? 587),
        secure: config.get<string>('SMTP_SECURE') === 'true',
        auth: { user, pass },
      })
      : null;
  }

  getEmailStatus() {
    return {
      configured: Boolean(this.transporter),
      from: this.config.get<string>('EMAIL_FROM') ?? 'Warranty Tracker <noreply@example.com>',
    };
  }

  async sendTestEmail(email: string) {
    if (!email) {
      throw new Error('Your account does not have an email address.');
    }

    if (!this.transporter) {
      throw new Error('Email is not configured. Add SMTP settings in backend/.env and restart the backend.');
    }

    await this.transporter.sendMail({
      from: this.config.get<string>('EMAIL_FROM') ?? 'Warranty Tracker <noreply@example.com>',
      to: email,
      subject: 'Warranty Tracker test email',
      text: 'Email reminders are configured correctly for your Digital Warranty Tracker account.',
      html: renderTestEmail(),
    });

    return { success: true };
  }

  async list(userId: string) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async markRead(userId: string, id: string) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  async markAllRead(userId: string) {
    const { error } = await this.supabase.client
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return { success: true };
  }

  async runForUser(userId: string, email: string) {
    const settings = await this.getSettings(userId);
    const thresholds = (settings?.thresholds?.length ? settings.thresholds : [30, 14, 7])
      .map((threshold) => Number(threshold))
      .filter((threshold) => Number.isFinite(threshold));
    const { data, error } = await this.supabase.client
      .from('products')
      .select('id,user_id,name,warranty_end_date')
      .eq('user_id', userId);
    if (error) throw error;

    let created = 0;
    for (const product of (data ?? []) as ProductRow[]) {
      const daysLeft = calculateDaysLeft(product.warranty_end_date);
      const matchedThreshold = this.getMatchedThreshold(daysLeft, thresholds);
      if (daysLeft == null || matchedThreshold == null) continue;
      if (await this.createInAppReminder(product, matchedThreshold, daysLeft)) {
        created += 1;
      }
      if (settings?.email_reminders_enabled ?? true) {
        if (await this.createEmailReminder(product, matchedThreshold, daysLeft, email)) {
          created += 1;
        }
      }
    }
    return { checked: (data ?? []).length, created };
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async scheduledRun() {
    const { data, error } = await this.supabase.client.auth.admin.listUsers();
    if (error) {
      console.error('Unable to list users for notification schedule', error);
      return;
    }
    for (const user of data.users) {
      await this.runForUser(user.id, user.email ?? '');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledCleanup() {
    try {
      const result = await this.cleanupOldNotifications();
      if (result.deleted > 0) {
        console.info('Notification cleanup completed', result);
      }
    } catch (error) {
      console.error('Notification cleanup failed', error);
    }
  }

  async cleanupOldNotifications() {
    const readInAppCutoff = this.daysAgoIso(READ_IN_APP_RETENTION_DAYS);
    const failedEmailCutoff = this.daysAgoIso(FAILED_EMAIL_RETENTION_DAYS);
    const sentEmailCutoff = this.daysAgoIso(SENT_EMAIL_RETENTION_DAYS);

    const readInApp = await this.deleteReadInAppNotifications(readInAppCutoff);
    const failedEmail = await this.deleteFailedEmailNotifications(failedEmailCutoff);
    const sentEmail = await this.deleteSentEmailNotifications(sentEmailCutoff);

    return {
      deleted: readInApp + failedEmail + sentEmail,
      readInApp,
      failedEmail,
      sentEmail,
    };
  }

  private async getSettings(userId: string) {
    const { data, error } = await this.supabase.client
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data as NotificationSettingsRow | null;
  }

  private getMatchedThreshold(daysLeft: number | null, thresholds: number[]) {
    if (daysLeft == null || daysLeft < 0) return null;
    const eligibleThresholds = thresholds
      .filter((threshold) => daysLeft <= threshold)
      .sort((a, b) => a - b);
    return eligibleThresholds[0] ?? null;
  }

  private async createInAppReminder(product: ProductRow, threshold: number, daysLeft: number) {
    const existing = await this.findExistingReminder(product, 'in_app', threshold);
    if (existing) return false;

    const { error } = await this.supabase.client.from('notifications').insert({
      user_id: product.user_id,
      product_id: product.id,
      type: 'in_app',
      threshold_days: threshold,
      title: 'Warranty expires soon',
      message: `${product.name} warranty expires in ${daysLeft} days.`,
      status: 'sent',
      sent_at: new Date().toISOString(),
    });
    if (error) throw error;
    return true;
  }

  private async createEmailReminder(product: ProductRow, threshold: number, daysLeft: number, email: string) {
    const existing = await this.findExistingReminder(product, 'email', threshold);
    if (existing) return false;
    if (!this.transporter || !email) return false;

    let status: 'sent' | 'failed' = 'failed';
    try {
      const reminder: EmailReminderProduct = { ...product, daysLeft, threshold };
      await this.transporter.sendMail({
        from: this.config.get<string>('EMAIL_FROM') ?? 'Warranty Tracker <noreply@example.com>',
        to: email,
        subject: 'Warranty Reminder: Product warranty expires soon',
        text: renderWarrantyReminderText(reminder),
        html: renderWarrantyReminderEmail(reminder),
      });
      status = 'sent';
    } catch (error) {
      console.error('Email notification failed', error);
    }

    const { error } = await this.supabase.client.from('notifications').insert({
      user_id: product.user_id,
      product_id: product.id,
      type: 'email',
      threshold_days: threshold,
      title: 'Email warranty reminder',
      message: `Email reminder for ${product.name} at ${daysLeft} days remaining.`,
      status,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    });
    if (error) throw error;
    return true;
  }

  private hasUsableSmtpConfig(host?: string, user?: string, pass?: string) {
    if (!host || !user || !pass) return false;

    const placeholders = ['smtp.example.com', 'your-smtp-user', 'your-smtp-password'];
    return !placeholders.includes(host) && !placeholders.includes(user) && !placeholders.includes(pass);
  }

  private async findExistingReminder(product: ProductRow, type: 'in_app' | 'email', daysLeft: number) {
    const { data, error } = await this.supabase.client
      .from('notifications')
      .select('id')
      .eq('user_id', product.user_id)
      .eq('product_id', product.id)
      .eq('type', type)
      .eq('threshold_days', daysLeft)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  private daysAgoIso(days: number) {
    return new Date(Date.now() - days * MS_PER_DAY).toISOString();
  }

  private async deleteReadInAppNotifications(cutoff: string) {
    const { count, error } = await this.supabase.client
      .from('notifications')
      .delete({ count: 'exact' })
      .eq('type', 'in_app')
      .eq('is_read', true)
      .lt('created_at', cutoff);
    if (error) throw error;
    return count ?? 0;
  }

  private async deleteFailedEmailNotifications(cutoff: string) {
    const { count, error } = await this.supabase.client
      .from('notifications')
      .delete({ count: 'exact' })
      .eq('type', 'email')
      .eq('status', 'failed')
      .lt('created_at', cutoff);
    if (error) throw error;
    return count ?? 0;
  }

  private async deleteSentEmailNotifications(cutoff: string) {
    const { count, error } = await this.supabase.client
      .from('notifications')
      .delete({ count: 'exact' })
      .eq('type', 'email')
      .eq('status', 'sent')
      .lt('created_at', cutoff);
    if (error) throw error;
    return count ?? 0;
  }
}
