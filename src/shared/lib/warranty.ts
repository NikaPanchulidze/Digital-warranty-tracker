import type { Product, WarrantyStatus } from '@/shared/types/domain';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function addMonths(dateValue: string, months: number) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  return formatLocalDateInput(date);
}

export function calculateDaysLeft(warrantyEndDate?: string | null) {
  if (!warrantyEndDate) return null;
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(`${warrantyEndDate}T00:00:00`);
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.ceil((endUtc - todayUtc) / MS_PER_DAY);
}

export function getWarrantyStatus(product: Pick<Product, 'purchase_date' | 'warranty_months' | 'warranty_end_date'>): WarrantyStatus {
  if (!product.purchase_date || product.warranty_months == null || !product.warranty_end_date) return 'unknown';
  const daysLeft = calculateDaysLeft(product.warranty_end_date);
  if (daysLeft == null) return 'unknown';
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring';
  return 'active';
}

export function formatMoney(value?: number | null) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value ?? 0);
}

export function formatDate(value?: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function statusLabel(status: WarrantyStatus) {
  if (status === 'expiring') return 'Expiring Soon';
  if (status === 'expired') return 'Expired';
  if (status === 'unknown') return 'Unknown';
  return 'Active';
}

function formatLocalDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
