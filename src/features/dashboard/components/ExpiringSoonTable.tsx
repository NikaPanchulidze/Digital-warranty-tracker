import { ArrowRight } from 'lucide-react';
import { Card, Badge, Button, Skeleton } from '@/app/components/ui';
import { Pagination } from '@/app/components/Pagination';
import type { DashboardAnalytics } from '@/shared/types/domain';
import { formatDate, statusLabel } from '@/shared/lib/warranty';

export function ExpiringSoonTable({
  products,
  isLoading,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onViewAll,
  onViewProduct,
}: {
  products: DashboardAnalytics['expiringSoonProducts'];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onViewAll: () => void;
  onViewProduct: (id: string) => void;
}) {
  return (
    <Card>
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Expiring Soon</h3>
        <Button variant="ghost" onClick={onViewAll} className="text-sm px-2 py-1 h-auto">
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Product Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Warranty End Date</th>
              <th className="px-6 py-3 font-medium">Days Left</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && <ExpiringSoonTableSkeleton />}
            {!isLoading && products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-gray-500">{product.category ?? 'Uncategorized'}</td>
                <td className="px-6 py-4 text-gray-500">{formatDate(product.warranty_end_date)}</td>
                <td className="px-6 py-4 font-medium text-red-600">{product.daysLeft} days</td>
                <td className="px-6 py-4">
                  <Badge variant={product.warrantyStatus === 'unknown' ? 'neutral' : product.warrantyStatus}>
                    {statusLabel(product.warrantyStatus)}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="secondary" onClick={() => onViewProduct(product.id)}>View</Button>
                </td>
              </tr>
            ))}
            {!isLoading && totalItems === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No warranties are expiring soon.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && totalItems > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          itemLabel="expiring product"
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}

function ExpiringSoonTableSkeleton() {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <tr key={row}>
          {Array.from({ length: 6 }).map((_, column) => (
            <td key={column} className="px-6 py-4">
              <Skeleton className="h-4 w-full max-w-32" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
