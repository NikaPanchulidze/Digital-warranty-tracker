import { Shield } from 'lucide-react';
import { Card, Button, Input, Label, Spinner } from '@/app/components/ui';

export function SecuritySettingsCard({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  isPasswordSaving,
  isPasswordSuccess,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  isPasswordSaving: boolean;
  isPasswordSuccess: boolean;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onChangePassword: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-500">Update the password used to sign in to your account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <Label htmlFor="current-password">Current password</Label>
          <Input id="current-password" type="password" value={currentPassword} placeholder="Enter current password" onChange={(event) => onCurrentPasswordChange(event.target.value)} />
          <p className="mt-2 text-xs text-gray-500">We verify this before changing your password.</p>
        </div>

        <div>
          <Label htmlFor="new-password">New password</Label>
          <Input id="new-password" type="password" value={newPassword} placeholder="At least 8 characters" onChange={(event) => onNewPasswordChange(event.target.value)} />
        </div>

        <div>
          <Label htmlFor="confirm-new-password">Confirm new password</Label>
          <Input id="confirm-new-password" type="password" value={confirmPassword} placeholder="Repeat new password" onChange={(event) => onConfirmPasswordChange(event.target.value)} />
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-end gap-3">
        {isPasswordSuccess && <span className="text-sm text-green-600">Password changed.</span>}
        {passwordError && <span className="text-sm text-red-600">{passwordError}</span>}
        <Button type="button" onClick={onChangePassword} disabled={isPasswordSaving} className="gap-2">
          {isPasswordSaving && <Spinner />}
          {isPasswordSaving ? 'Changing...' : 'Change Password'}
        </Button>
      </div>
    </Card>
  );
}
