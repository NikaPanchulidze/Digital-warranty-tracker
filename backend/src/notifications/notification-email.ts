export type EmailReminderProduct = {
  name: string;
  daysLeft: number;
  threshold: number;
};

export type EmailMaintenanceReminder = {
  productName: string;
  description: string;
  daysLeft: number;
  threshold: number;
  reminderDate: string;
};

export function renderTestEmail() {
  return renderEmailLayout({
    title: 'Email reminders are ready',
    body: 'This test confirms that Warranty Tracker can send email reminders for your account.',
    ctaText: 'You can now receive warranty expiration emails when reminders are generated.',
  });
}

export function renderWarrantyReminderEmail(product: EmailReminderProduct) {
  return renderEmailLayout({
    title: 'Warranty expires soon',
    body: `${escapeHtml(product.name)} warranty expires in ${product.daysLeft} days.`,
    ctaText: `Reminder threshold: ${product.threshold} days`,
  });
}

export function renderWarrantyReminderText(product: EmailReminderProduct) {
  return [
    `Warranty reminder: ${product.name}`,
    '',
    `${product.name} warranty expires in ${product.daysLeft} days.`,
    `Reminder threshold: ${product.threshold} days.`,
    '',
    'Open Warranty Tracker to view the product details, receipts, and warranty information.',
  ].join('\n');
}

export function renderMaintenanceReminderEmail(reminder: EmailMaintenanceReminder) {
  return renderEmailLayout({
    title: 'Maintenance reminder',
    body: `${escapeHtml(reminder.productName)} maintenance reminder: ${escapeHtml(reminder.description)} is scheduled ${formatMaintenanceTiming(reminder.daysLeft)}.`,
    ctaText: reminder.threshold === 0 ? 'Due today' : `Reminder threshold: ${reminder.threshold} days`,
  });
}

export function renderMaintenanceReminderText(reminder: EmailMaintenanceReminder) {
  return [
    `Maintenance reminder: ${reminder.productName}`,
    '',
    `${reminder.description} is scheduled ${formatMaintenanceTiming(reminder.daysLeft)}.`,
    `Reminder date: ${reminder.reminderDate}.`,
    reminder.threshold === 0 ? 'This maintenance is due today.' : `Reminder threshold: ${reminder.threshold} days.`,
    '',
    'Open Warranty Tracker to view the product and maintenance history.',
  ].join('\n');
}

function formatMaintenanceTiming(daysLeft: number) {
  if (daysLeft === 0) return 'today';
  if (daysLeft === 1) return 'tomorrow';
  return `in ${daysLeft} days`;
}

function renderEmailLayout({ title, body, ctaText }: { title: string; body: string; ctaText: string }) {
  return `
    <div style="margin:0;background:#f8fafc;padding:32px;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
        <div style="padding:24px 28px;border-bottom:1px solid #e2e8f0;">
          <div style="font-size:13px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:.08em;">WarrantyTracker</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;color:#0f172a;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#334155;">${body}</p>
          <div style="display:inline-block;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:10px 14px;font-size:14px;font-weight:700;">${escapeHtml(ctaText)}</div>
          <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#64748b;">This email was sent because email reminders are enabled in your Warranty Tracker notification settings.</p>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
