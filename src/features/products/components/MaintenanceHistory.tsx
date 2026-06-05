import { useRef } from "react";
import { Calendar, Plus, Trash2 } from "lucide-react";

import {
  Button,
  Card,
  Input,
  Skeleton,
  Spinner,
  Textarea,
} from "@/app/components/ui";
import type { MaintenanceRecord } from "@/shared/types/domain";
import { formatDate, formatMoney } from "@/shared/lib/warranty";

type MaintenanceFormState = {
  date: string;
  description: string;
  cost: string;
  service_provider: string;
  next_reminder_date: string;
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

export function MaintenanceHistory({
  maintenance,
  form,
  totalCost,
  isLoading,
  isAdding,
  onFormChange,
  onAdd,
  onDelete,
}: MaintenanceHistoryProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const reminderDateInputRef = useRef<HTMLInputElement>(null);

  function openDatePicker(input: HTMLInputElement | null) {
    if (!input) return;

    input.focus();
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  }

  return (
    <Card>
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Maintenance History
        </h2>
        <div className="mt-4 grid grid-cols-1 items-end gap-3 md:grid-cols-4">
          <div className="relative">
            <label
              htmlFor="maintenance-date"
              className="mb-1.5 block text-xs font-medium text-gray-500 md:sr-only md:mb-0"
            >
              Maintenance date
            </label>
            <button
              type="button"
              className="relative flex h-12 w-full items-center justify-between rounded-lg border-2 border-gray-300 bg-white px-4 text-left text-sm transition-colors hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={() => openDatePicker(dateInputRef.current)}
            >
              <span
                className={
                  form.date ? "font-medium text-gray-900" : "text-gray-400"
                }
              >
                {form.date ? formatDate(form.date) : "Select date"}
              </span>
              <Calendar className="h-4 w-4 text-gray-500" />
            </button>
            <Input
              ref={dateInputRef}
              id="maintenance-date"
              type="date"
              aria-label="Maintenance date"
              className="pointer-events-none absolute h-px w-px opacity-0"
              tabIndex={-1}
              value={form.date}
              onChange={(event) =>
                onFormChange({ ...form, date: event.target.value })
              }
            />
          </div>
          <Input
            className="h-12 rounded-lg border-2 border-gray-300 bg-white px-4"
            placeholder="Service provider"
            value={form.service_provider}
            onChange={(event) =>
              onFormChange({ ...form, service_provider: event.target.value })
            }
          />
          <Input
            className="h-12 rounded-lg border-2 border-gray-300 bg-white px-4"
            type="number"
            min="0"
            step="0.01"
            placeholder="Cost"
            value={form.cost}
            onChange={(event) =>
              onFormChange({ ...form, cost: event.target.value })
            }
          />
          <Button
            type="button"
            className="order-last h-12 gap-2 rounded-lg md:order-none"
            disabled={!form.date || !form.description || isAdding}
            onClick={onAdd}
          >
            {isAdding ? <Spinner /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Adding..." : "Add"}
          </Button>
          <Textarea
            className="md:col-span-4"
            rows={2}
            placeholder="Maintenance description"
            value={form.description}
            onChange={(event) =>
              onFormChange({ ...form, description: event.target.value })
            }
          />
          <div className="relative md:col-span-4">
            <label
              htmlFor="next-maintenance-reminder-date"
              className="mb-1.5 block text-xs font-medium text-gray-500"
            >
              Next reminder date (optional)
            </label>
            <button
              type="button"
              className="relative flex h-12 w-full items-center justify-between rounded-lg border-2 border-gray-300 bg-white px-4 text-left text-sm transition-colors hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              onClick={() => openDatePicker(reminderDateInputRef.current)}
            >
              <span
                className={
                  form.next_reminder_date
                    ? "font-medium text-gray-900"
                    : "text-gray-400"
                }
              >
                {form.next_reminder_date
                  ? formatDate(form.next_reminder_date)
                  : "Remind me 7 days before and on this date"}
              </span>
              <Calendar className="h-4 w-4 text-gray-500" />
            </button>
            <Input
              ref={reminderDateInputRef}
              id="next-maintenance-reminder-date"
              type="date"
              aria-label="Next maintenance reminder date"
              className="pointer-events-none absolute h-px w-px opacity-0"
              tabIndex={-1}
              value={form.next_reminder_date}
              onChange={(event) =>
                onFormChange({
                  ...form,
                  next_reminder_date: event.target.value,
                })
              }
            />
          </div>
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
            {!isLoading &&
              maintenance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {record.description}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {record.service_provider ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    <div>{formatMoney(record.cost)}</div>
                    {record.next_reminder_date && (
                      <div className="mt-1 text-xs font-normal text-blue-600">
                        Reminder {formatDate(record.next_reminder_date)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      className="p-2 h-auto text-red-600"
                      onClick={() => onDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot className="bg-gray-50/50 font-medium text-gray-900">
            <tr>
              <td colSpan={3} className="px-6 py-3 text-right">
                Total Maintenance Cost
              </td>
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
              <Skeleton className={column === 1 ? "h-4 w-52" : "h-4 w-24"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
