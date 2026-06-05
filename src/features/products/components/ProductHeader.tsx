import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import { Badge, Button } from '@/app/components/ui';
import type { Product, WarrantyStatus } from '@/shared/types/domain';
import { statusLabel } from '@/shared/lib/warranty';

type ProductHeaderProps = {
  product: Product;
  status: WarrantyStatus;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductHeader({ product, status, onBack, onEdit, onDelete }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <Badge variant={status === 'unknown' ? 'neutral' : status}>{statusLabel(status)}</Badge>
          </div>
          <p className="text-gray-500 mt-1">
            {product.brand ?? 'No brand'} - {product.category ?? 'Uncategorized'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="gap-2" onClick={onEdit}>
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button variant="danger" className="gap-2" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
