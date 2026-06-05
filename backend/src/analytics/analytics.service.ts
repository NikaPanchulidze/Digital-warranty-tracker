import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { calculateDaysLeft, getWarrantyStatus } from '../common/warranty';

type ProductRow = {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  category: string | null;
  purchase_date: string | null;
  price: number | null;
  warranty_months: number | null;
  warranty_end_date: string | null;
  serial_number: string | null;
  notes: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class AnalyticsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getDashboard(userId: string) {
    const { data, error } = await this.supabase.client.from('products').select('*').eq('user_id', userId);
    if (error) throw error;
    const products = (data ?? []) as ProductRow[];
    const withStatus = products.map((product) => ({
      ...product,
      daysLeft: calculateDaysLeft(product.warranty_end_date) ?? 0,
      warrantyStatus: getWarrantyStatus(product),
    }));

    return {
      totalProducts: products.length,
      totalAssetValue: products.reduce((sum, product) => sum + Number(product.price ?? 0), 0),
      activeWarrantyCount: withStatus.filter((product) => product.warrantyStatus === 'active').length,
      expiringSoonCount: withStatus.filter((product) => product.warrantyStatus === 'expiring').length,
      expiredWarrantyCount: withStatus.filter((product) => product.warrantyStatus === 'expired').length,
      productsByCategory: groupCount(products, (product) => product.category ?? 'Uncategorized'),
      assetValueByCategory: groupSum(products, (product) => product.category ?? 'Uncategorized', (product) => Number(product.price ?? 0)),
      warrantyStatusDistribution: [
        { name: 'Active', value: withStatus.filter((product) => product.warrantyStatus === 'active').length },
        { name: 'Expiring Soon', value: withStatus.filter((product) => product.warrantyStatus === 'expiring').length },
        { name: 'Expired', value: withStatus.filter((product) => product.warrantyStatus === 'expired').length },
      ],
      expiringSoonProducts: withStatus
        .filter((product) => product.warrantyStatus === 'expiring')
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5),
    };
  }
}

function groupCount<T>(items: T[], getKey: (item: T) => string) {
  const map = new Map<string, number>();
  items.forEach((item) => map.set(getKey(item), (map.get(getKey(item)) ?? 0) + 1));
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function groupSum<T>(items: T[], getKey: (item: T) => string, getValue: (item: T) => number) {
  const map = new Map<string, number>();
  items.forEach((item) => map.set(getKey(item), (map.get(getKey(item)) ?? 0) + getValue(item)));
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
