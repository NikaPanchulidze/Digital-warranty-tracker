import React from 'react';
import { Card, Skeleton } from '@/app/components/ui';

export function SummaryCard({
  label,
  value,
  helper,
  icon,
  color,
  isLoading,
}: {
  label: string;
  value: React.ReactNode;
  helper: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red';
  isLoading?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {isLoading ? <Skeleton className="mt-2 h-7 w-20" /> : <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>}
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[color]}`}>{icon}</div>
      </div>
      {isLoading ? <Skeleton className="mt-5 h-3 w-28" /> : <p className="text-xs text-gray-500 mt-4">{helper}</p>}
    </Card>
  );
}
