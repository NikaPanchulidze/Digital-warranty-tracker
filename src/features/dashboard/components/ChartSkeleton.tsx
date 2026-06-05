import { Skeleton } from '@/app/components/ui';

export function ChartSkeleton() {
  return (
    <div className="h-64 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex h-full items-end gap-3">
        {[44, 72, 54, 90, 38].map((height, index) => (
          <Skeleton key={index} className="flex-1 rounded-t-lg" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}
