import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/app/components/ui';
import { ChartEmptyState } from '@/features/dashboard/components/ChartEmptyState';
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton';
import { hasChartData } from '@/features/dashboard/lib/chartData';

export function ProductsByCategoryCard({
  data,
  isLoading,
  onAddProduct,
}: {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
  onAddProduct: () => void;
}) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Products by Category</h3>
      {isLoading ? (
        <ChartSkeleton />
      ) : hasChartData(data) ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ChartEmptyState message="Add products with categories to compare your ownership by product type." onAddProduct={onAddProduct} />
      )}
    </Card>
  );
}
