export type WarrantyStatus = 'active' | 'expiring' | 'expired' | 'unknown';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculateDaysLeft(warrantyEndDate?: string | null) {
  if (!warrantyEndDate) return null;
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(`${warrantyEndDate}T00:00:00`);
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.ceil((endUtc - todayUtc) / MS_PER_DAY);
}

export function getWarrantyStatus(product: { purchase_date?: string | null; warranty_months?: number | null; warranty_end_date?: string | null }): WarrantyStatus {
  if (!product.purchase_date || product.warranty_months == null || !product.warranty_end_date) return 'unknown';
  const daysLeft = calculateDaysLeft(product.warranty_end_date);
  if (daysLeft == null) return 'unknown';
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'expiring';
  return 'active';
}
