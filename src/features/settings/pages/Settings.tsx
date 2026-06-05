import { useEffect, useState } from 'react';
import { Bell, Shield, User } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingBlock } from '@/app/components/ui';
import { useAuth } from '@/features/auth/auth-context';
import { changePassword, getNotificationSettings, saveNotificationSettings, saveProfile } from '@/features/settings/api/settingsApi';
import { NotificationSettingsCard } from '@/features/settings/components/NotificationSettingsCard';
import { ProfileSettingsCard } from '@/features/settings/components/ProfileSettingsCard';
import { SecuritySettingsCard } from '@/features/settings/components/SecuritySettingsCard';
import { SettingsNavButton } from '@/features/settings/components/SettingsNavButton';

type SettingsSection = 'notifications' | 'profile' | 'security';

export function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['notification-settings'], queryFn: getNotificationSettings });

  const [activeSection, setActiveSection] = useState<SettingsSection>('notifications');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [thresholds, setThresholds] = useState<number[]>([30, 14, 7]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!settings) return;
    setEmailEnabled(settings.email_reminders_enabled);
    setThresholds(settings.thresholds?.length ? settings.thresholds : [30, 14, 7]);
  }, [settings]);

  useEffect(() => {
    setFullName(String(user?.user_metadata?.full_name ?? ''));
    setPhone(String(user?.user_metadata?.phone ?? ''));
  }, [user]);

  const notificationMutation = useMutation({
    mutationFn: () => saveNotificationSettings({
      email_reminders_enabled: emailEnabled,
      thresholds,
      weekly_summary_enabled: false,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notification-settings'] }),
  });

  const profileMutation = useMutation({
    mutationFn: () => saveProfile({ fullName, phone }),
    onSuccess: () => setProfileError(''),
    onError: (error) => setProfileError(error instanceof Error ? error.message : 'Unable to save profile.'),
  });

  const passwordMutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    },
    onError: (error) => setPasswordError(error instanceof Error ? error.message : 'Unable to change password.'),
  });

  const toggleThreshold = (value: number) => {
    setThresholds((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value].sort((a, b) => b - a));
  };

  const handleChangePassword = () => {
    setPasswordError('');
    const error = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (error) {
      setPasswordError(error);
      return;
    }
    passwordMutation.mutate();
  };

  const handleSaveProfile = () => {
    setProfileError('');
    const error = validateDisplayName(fullName);
    if (error) {
      setProfileError(error);
      return;
    }
    profileMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-1">
            <SettingsNavButton icon={<Bell className="w-4 h-4" />} label="Notifications" active={activeSection === 'notifications'} onClick={() => setActiveSection('notifications')} />
            <SettingsNavButton icon={<User className="w-4 h-4" />} label="Profile" active={activeSection === 'profile'} onClick={() => setActiveSection('profile')} />
            <SettingsNavButton icon={<Shield className="w-4 h-4" />} label="Security" active={activeSection === 'security'} onClick={() => setActiveSection('security')} />
          </nav>
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeSection === 'notifications' && (isLoading ? (
            <LoadingBlock label="Loading settings..." />
          ) : (
            <NotificationSettingsCard
              emailEnabled={emailEnabled}
              thresholds={thresholds}
              isSaving={notificationMutation.isPending}
              isSuccess={notificationMutation.isSuccess}
              isError={notificationMutation.isError}
              onEmailEnabledChange={setEmailEnabled}
              onThresholdToggle={toggleThreshold}
              onSave={() => notificationMutation.mutate()}
            />
          ))}

          {activeSection === 'profile' && (
            <ProfileSettingsCard
              email={user?.email ?? ''}
              fullName={fullName}
              phone={phone}
              isSaving={profileMutation.isPending}
              isSuccess={profileMutation.isSuccess}
              isError={profileMutation.isError}
              error={profileError}
              onFullNameChange={setFullName}
              onPhoneChange={setPhone}
              onSave={handleSaveProfile}
            />
          )}

          {activeSection === 'security' && (
            <SecuritySettingsCard
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              passwordError={passwordError}
              isPasswordSaving={passwordMutation.isPending}
              isPasswordSuccess={passwordMutation.isSuccess}
              onCurrentPasswordChange={setCurrentPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onChangePassword={handleChangePassword}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function validatePasswordChange(currentPassword: string, newPassword: string, confirmPassword: string) {
  if (!currentPassword) return 'Enter your current password.';
  if (!newPassword) return 'Enter a new password.';
  if (newPassword.length < 8) return 'New password must be at least 8 characters.';
  if (newPassword !== confirmPassword) return 'New passwords do not match.';
  if (currentPassword === newPassword) return 'New password must be different from your current password.';
  return '';
}

function validateDisplayName(fullName: string) {
  const value = fullName.trim();
  if (!value) return 'Enter a display name.';
  if (value.length < 3) return 'Display name must be at least 3 characters.';
  if (value.length > 40) return 'Display name must be 40 characters or fewer.';
  return '';
}
