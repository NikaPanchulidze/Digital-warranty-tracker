import { supabase } from '@/shared/api/supabase';
import { api } from '@/shared/api/backendApi';
import { validateDisplayName, validatePhone } from '@/shared/lib/profileValidation';
import type { NotificationSettings } from '@/shared/types/domain';

export async function getNotificationSettings() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('You must be signed in.');

  const { data, error } = await supabase.from('notification_settings').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data as NotificationSettings | null;
}

export async function saveNotificationSettings(input: Pick<NotificationSettings, 'email_reminders_enabled' | 'thresholds' | 'weekly_summary_enabled'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('You must be signed in.');

  const { data, error } = await supabase.from('notification_settings').upsert({
    user_id: userId,
    ...input,
    updated_at: new Date().toISOString(),
  }).select('*').single();
  if (error) throw error;
  return data as NotificationSettings;
}

export type EmailStatus = {
  configured: boolean;
  from: string;
};

export async function getEmailStatus() {
  const { data } = await api.get<EmailStatus>('/notifications/email-status');
  return data;
}

export async function sendTestEmail() {
  const { data } = await api.post<{ success: boolean }>('/notifications/test-email');
  return data;
}

export type ProfileInput = {
  fullName: string;
  phone: string;
};

export async function saveProfile(input: ProfileInput) {
  const fullName = input.fullName.trim();
  const phone = input.phone.trim();
  const nameError = validateDisplayName(fullName);
  if (nameError) throw new Error(nameError);
  const phoneError = validatePhone(phone);
  if (phoneError) throw new Error(phoneError);

  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone,
    },
  });

  if (error) throw error;
  return data.user;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const email = userData.user?.email;
  if (!email) throw new Error('Unable to verify your account email.');

  const verification = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (verification.error) {
    throw new Error('Current password is incorrect.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data.user;
}
