import { Plus, Trash2 } from 'lucide-react';

import { Button, Card, Input, Skeleton, Spinner, Textarea } from '@/app/components/ui';
import type { MaintenanceRecord } from '@/shared/types/domain';
import { formatDate, formatMoney } from '@/shared/lib/warranty';

type MaintenanceFormState = {
  date: string;
  description: string;
  cost: string;
  service_provider: string;
};

type MaintenanceHistoryProps = {
  maintenance: MaintenanceRecord[];
  form: MaintenanceFormState;
  totalCost: number;
  isLoading?: boolean;
  isAdding: boolean;
  onFormChange: (form: MaintenanceFormState) => void;
  onAdd: () => void;
  onDelete: (maintenanceId: string) => void;
};

export function MaintenanceHistory({ maintenance, form, totalCost, isLoading, isAdding, onFormChange, onAdd, onDelete }: MaintenanceHistoryProps) {
  return (
    <Card>
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Maintenance History</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label htmlFor="maintenance-date" className="mb-1.5 block text-xs font-medium text-gray-500 md:hidden">
              Maintenance date
            </label>
            <Input
              id="maintenance-date"
              type="date"
              className="text-gray-900 [color-scheme:light]"
              value={form.date}
              onChange={(event) => onFormChange({ ...form, date: event.target.value })}
            />
          </div>
          <Input placeholder="Service provider" value={form.service_provider} onChange={(event) => onFormChange({ ...form, service_provider: event.target.value })} />
          <Input type="number" min="0" step="0.01" placeholder="Cost" value={form.cost} onChange={(event) => onFormChange({ ...form, cost: event.target.value })} />
          <Button type="button" className="gap-2" disabled={!form.date || !form.description || isAdding} onClick={onAdd}>
            {isAdding ? <Spinner /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
          <Textarea className="md:col-span-4" rows={2} placeholder="Maintenance description" value={form.description} onChange={(event) => onFormChange({ ...form, description: event.target.value })} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Provider</th>
              <th className="px-6 py-3 font-medium text-right">Cost</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && <MaintenanceSkeleton />}
            {!isLoading && maintenance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(record.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{record.description}</td>
                <td className="px-6 py-4 text-gray-500">{record.service_provider ?? '-'}</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">{formatMoney(record.cost)}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" className="p-2 h-auto text-red-600" onClick={() => onDelete(record.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50/50 font-medium text-gray-900">
            <tr>
              <td colSpan={3} className="px-6 py-3 text-right">Total Maintenance Cost</td>
              <td className="px-6 py-3 text-right">{formatMoney(totalCost)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

function MaintenanceSkeleton() {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <tr key={row}>
          {Array.from({ length: 5 }).map((_, column) => (
            <td key={column} className="px-6 py-4">
              <Skeleton className={column === 1 ? 'h-4 w-52' : 'h-4 w-24'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
