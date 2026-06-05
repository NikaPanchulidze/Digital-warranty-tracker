import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/app/components/ui';

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageSize, totalItems, itemLabel, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        {totalItems === 0
          ? `No ${itemLabel}s`
          : `Showing ${startItem}-${endItem} of ${totalItems} ${itemLabel}${totalItems === 1 ? '' : 's'}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="h-9 gap-1 px-3"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="min-w-20 text-center text-sm font-medium text-gray-600">
          {safePage} / {totalPages}
        </span>
        <Button
          type="button"
          variant="secondary"
          className="h-9 gap-1 px-3"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
