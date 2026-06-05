import { Wrench } from 'lucide-react';

import { Card } from '@/app/components/ui';
import type { Product } from '@/shared/types/domain';
import { formatDate } from '@/shared/lib/warranty';

type WarrantyStatusPanelProps = {
  product: Product;
  daysRemaining: number | null;
};

export function WarrantyStatusPanel({ product, daysRemaining }: WarrantyStatusPanelProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="p-6 bg-blue-600 text-white shadow-lg border-none">
        <h3 className="text-blue-100 text-sm font-medium mb-1">Warranty Status</h3>
        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-bold">{daysRemaining == null ? '-' : Math.max(daysRemaining, 0)}</span>
          <span className="text-blue-100 mb-1">days left</span>
        </div>
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Ends On</p>
            <p className="font-medium">{formatDate(product.warranty_end_date)}</p>
          </div>
          <p className="text-xs text-blue-100">Notifications are generated at 30, 14, and 7 days remaining.</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-gray-400" /> Support Notes
        </h3>
        <p className="text-sm text-gray-600">Store support phone numbers, claim references, and repair context in product notes or maintenance history.</p>
      </Card>
    </div>
  );
}
