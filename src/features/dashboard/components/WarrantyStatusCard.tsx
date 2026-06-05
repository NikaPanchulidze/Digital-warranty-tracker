import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/app/components/ui';
import { ChartEmptyState } from '@/features/dashboard/components/ChartEmptyState';
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton';
import { hasChartData } from '@/features/dashboard/lib/chartData';

const STATUS_COLORS = ['#22C55E', '#F59E0B', '#EF4444'];

export function WarrantyStatusCard({
  data,
  isLoading,
  onAddProduct,
}: {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
  onAddProduct: () => void;
}) {
  if (isLoading) {
    return (
      <Card className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Warranty Status</h3>
        <ChartSkeleton />
      </Card>
    );
  }

  if (!hasChartData(data)) {
    return (
      <Card className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Warranty Status</h3>
        <ChartEmptyState message="Add products with warranty dates to see active, expiring, and expired coverage." onAddProduct={onAddProduct} />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Warranty Status</h3>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
            {entry.name}
          </div>
        ))}
      </div>
    </Card>
  );
}
