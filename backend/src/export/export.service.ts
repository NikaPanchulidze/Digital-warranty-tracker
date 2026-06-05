import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { getWarrantyStatus } from '../common/warranty';

@Injectable()
export class ExportService {
  constructor(private readonly supabase: SupabaseService) {}

  async productsCsv(userId: string) {
    const { data, error } = await this.supabase.client.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    const rows = [
      ['name', 'category', 'purchase date', 'price', 'warranty months', 'warranty end date', 'warranty status', 'serial number'],
      ...((data ?? []) as any[]).map((product) => [
        product.name,
        product.category ?? '',
        product.purchase_date ?? '',
        product.price ?? '',
        product.warranty_months ?? '',
        product.warranty_end_date ?? '',
        getWarrantyStatus(product),
        product.serial_number ?? '',
      ]),
    ];
    return rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  }
}

function csvEscape(value: unknown) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}
