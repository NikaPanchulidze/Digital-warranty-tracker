import { PackagePlus } from 'lucide-react';

import { Button } from '@/app/components/ui';

type ChartEmptyStateProps = {
  message: string;
  onAddProduct: () => void;
};

export function ChartEmptyState({ message, onAddProduct }: ChartEmptyStateProps) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-center px-6 rounded-lg border border-dashed border-gray-200 bg-gray-50/60">
      <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        <PackagePlus className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-900">No chart data yet</p>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">{message}</p>
      <Button className="mt-4" onClick={onAddProduct}>
        Add Product
      </Button>
    </div>
  );
}
