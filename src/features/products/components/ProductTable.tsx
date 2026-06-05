import { Card, Badge, Skeleton } from '@/app/components/ui';
import { Pagination } from '@/app/components/Pagination';
import type { Product } from '@/shared/types/domain';
import { calculateDaysLeft, formatDate, formatMoney, getWarrantyStatus, statusLabel } from '@/shared/lib/warranty';

import { ProductRowActions } from './ProductRowActions';

type ProductTableProps = {
  products: Product[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
};

export function ProductTable({ products, isLoading, page, pageSize, totalItems, onPageChange, onView, onEdit, onDelete }: ProductTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Product Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Purchase Date</th>
              <th className="px-6 py-4 font-medium">Warranty End Date</th>
              <th className="px-6 py-4 font-medium">Days Left</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && <ProductTableSkeleton />}
            {!isLoading && products.map((product) => {
              const productStatus = getWarrantyStatus(product);
              const daysLeft = calculateDaysLeft(product.warranty_end_date);

              return (
                <tr
                  key={product.id}
                  tabIndex={0}
                  className="hover:bg-blue-50/40 focus:bg-blue-50/60 focus:outline-none transition-colors group cursor-pointer"
                  onClick={() => onView(product.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onView(product.id);
                    }
                  }}
                  aria-label={`Open ${product.name}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.brand ?? product.serial_number ?? 'No brand or serial'}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category ?? 'Uncategorized'}</td>
                  <td className="px-6 py-4 text-gray-500">{formatMoney(product.price)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(product.purchase_date)}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(product.warranty_end_date)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {daysLeft == null ? '-' : daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={productStatus === 'unknown' ? 'neutral' : productStatus}>{statusLabel(productStatus)}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                    <ProductRowActions productId={product.id} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              );
            })}
            {!isLoading && !products.length && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageSize={pageSize} totalItems={isLoading ? 0 : totalItems} itemLabel="product" onPageChange={onPageChange} />
    </Card>
  );
}

function ProductTableSkeleton() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((row) => (
        <tr key={row}>
          {Array.from({ length: 8 }).map((_, column) => (
            <td key={column} className="px-6 py-4">
              <Skeleton className={column === 0 ? 'h-4 w-36' : 'h-4 w-24'} />
              {column === 0 && <Skeleton className="mt-2 h-3 w-24" />}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
