import React from 'react';
import { cn } from '@/app/components/ui';

export function SettingsNavButton({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      )}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {badge && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">{badge}</span>}
    </button>
  );
}
