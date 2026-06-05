import { Mail } from 'lucide-react';
import { Card, Button, Spinner } from '@/app/components/ui';

export function NotificationSettingsCard({
  emailEnabled,
  thresholds,
  isSaving,
  isSuccess,
  isError,
  onEmailEnabledChange,
  onThresholdToggle,
  onSave,
}: {
  emailEnabled: boolean;
  thresholds: number[];
  isSaving: boolean;
  isSuccess: boolean;
  isError: boolean;
  onEmailEnabledChange: (checked: boolean) => void;
  onThresholdToggle: (threshold: number) => void;
  onSave: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
          <p className="text-sm text-gray-500">Control what updates you receive via email.</p>
        </div>
      </div>

      <div className="space-y-6">
        <ToggleRow title="Enable Email Reminders" description="Receive email reminders before warranty expiration." checked={emailEnabled} onChange={onEmailEnabledChange} />

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Reminder Thresholds</h3>
          <div className="space-y-3">
            {[30, 14, 7].map((days) => (
              <div key={days} className="flex items-center">
                <input id={`days-${days}`} type="checkbox" checked={thresholds.includes(days)} onChange={() => onThresholdToggle(days)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor={`days-${days}`} className="ml-2 text-sm text-gray-700">{days} days before expiration</label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          {isSuccess && <span className="text-sm text-green-600">Settings saved.</span>}
          {isError && <span className="text-sm text-red-600">Unable to save settings.</span>}
          <Button type="button" onClick={onSave} disabled={isSaving} className="gap-2">
            {isSaving && <Spinner />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
      </label>
    </div>
  );
}
