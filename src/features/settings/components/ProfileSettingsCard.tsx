import { User } from 'lucide-react';
import { Card, Button, Input, Label, Spinner } from '@/app/components/ui';

export function ProfileSettingsCard({
  email,
  fullName,
  phone,
  isSaving,
  isSuccess,
  isError,
  error,
  onFullNameChange,
  onPhoneChange,
  onSave,
}: {
  email: string;
  fullName: string;
  phone: string;
  isSaving: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500">Manage the basic identity shown in your workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <Label htmlFor="full-name">Display name</Label>
          <Input id="full-name" value={fullName} placeholder="Your name" maxLength={40} aria-invalid={Boolean(error)} onChange={(event) => onFullNameChange(event.target.value)} />
          <p className="mt-2 text-xs text-gray-500">Use 3-40 characters.</p>
        </div>

        <div>
          <Label htmlFor="profile-phone">Phone</Label>
          <Input id="profile-phone" value={phone} placeholder="+995 555 123 456" inputMode="tel" autoComplete="tel" onChange={(event) => onPhoneChange(event.target.value)} />
          <p className="mt-2 text-xs text-gray-500">Optional. Use digits with spaces, dashes, parentheses, or a leading plus sign.</p>
        </div>

        <div>
          <Label htmlFor="profile-email">Email address</Label>
          <Input id="profile-email" value={email} disabled />
          <p className="mt-2 text-xs text-gray-500">Email changes are disabled for this MVP to avoid confirmation-flow complexity.</p>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        {isSuccess && <span className="text-sm text-green-600">Profile saved.</span>}
        {(error || isError) && <span className="text-sm text-red-600">{error || 'Unable to save profile.'}</span>}
        <Button type="button" onClick={onSave} disabled={isSaving} className="gap-2">
          {isSaving && <Spinner />}
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </Card>
  );
}
