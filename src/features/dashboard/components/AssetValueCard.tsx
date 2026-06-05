import { Card } from '@/app/components/ui';
import { formatMoney } from '@/shared/lib/warranty';
import { ChartEmptyState } from '@/features/dashboard/components/ChartEmptyState';
import { ChartSkeleton } from '@/features/dashboard/components/ChartSkeleton';
import { hasChartData } from '@/features/dashboard/lib/chartData';
import { useInViewOnce } from '@/shared/hooks/useInViewOnce';

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444'];

export function AssetValueCard({
  data,
  isLoading,
  onAddProduct,
}: {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
  onAddProduct: () => void;
}) {
  const { ref, hasEnteredView } = useInViewOnce();

  if (isLoading) {
    return (
      <div ref={ref} className="h-full">
        <Card className="h-full min-h-[360px] p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Asset Value by Category</h3>
          <ChartSkeleton />
        </Card>
      </div>
    );
  }

  if (!hasChartData(data)) {
    return (
      <div ref={ref} className="h-full">
        <Card className="h-full min-h-[360px] p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Asset Value by Category</h3>
          <ChartEmptyState message="Add product prices to see how your asset value is distributed by category." onAddProduct={onAddProduct} />
        </Card>
      </div>
    );
  }

  const visibleData = [...data]
    .filter((entry) => Number(entry.value) > 0)
    .sort((a, b) => Number(b.value) - Number(a.value));
  const totalValue = visibleData.reduce((sum, entry) => sum + Number(entry.value), 0);
  const maxValue = Math.max(...visibleData.map((entry) => Number(entry.value)));

  return (
    <div ref={ref} className="h-full">
      <Card className="h-full min-h-[360px] p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Asset Value by Category</h3>
            <p className="text-xs text-gray-500 mt-1">Ranked by value so smaller categories stay visible.</p>
          </div>
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{formatMoney(totalValue)}</span>
        </div>

        <div className="space-y-4 md:space-y-5">
          {visibleData.map((entry, index) => {
            const value = Number(entry.value);
            const width = Math.max((value / maxValue) * 100, 8);
            const percent = totalValue > 0 ? (value / totalValue) * 100 : 0;

            return (
              <div key={entry.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-gray-700 truncate">{entry.name}</span>
                  <span className="text-gray-500 whitespace-nowrap">
                    {formatMoney(value)} - {percent.toFixed(percent < 10 ? 1 : 0)}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: hasEnteredView ? `${width}%` : '0%',
                      transitionDelay: `${index * 90}ms`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
