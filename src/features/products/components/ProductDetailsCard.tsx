import type React from 'react';
import { Calendar, Clock, DollarSign, Hash } from 'lucide-react';

import { Card } from '@/app/components/ui';
import type { Product } from '@/shared/types/domain';
import { formatDate, formatMoney } from '@/shared/lib/warranty';

export function ProductDetailsCard({ product }: { product: Product }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <DetailItem icon={<DollarSign className="w-4 h-4" />} label="Price" value={formatMoney(product.price)} />
        <DetailItem icon={<Hash className="w-4 h-4" />} label="Serial Number" value={product.serial_number ?? 'Not recorded'} mono />
        <DetailItem icon={<Calendar className="w-4 h-4" />} label="Purchase Date" value={formatDate(product.purchase_date)} />
        <DetailItem icon={<Clock className="w-4 h-4" />} label="Warranty Period" value={`${product.warranty_months ?? 0} months`} />
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
        <p className="text-sm text-gray-600">{product.notes || 'No notes saved for this product.'}</p>
      </div>
    </Card>
  );
}

function DetailItem({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
        {icon} {label}
      </p>
      <p className={`font-medium text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
