import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Input, Label, Spinner } from '@/app/components/ui';
import { supabase } from '@/shared/api/supabase';

export function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handlePasswordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const form = new FormData(event.currentTarget);
    const password = String(form.get('password'));
    const confirmPassword = String(form.get('confirm-password'));

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      window.setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create New Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose a new password for your WarrantyTracker account.
        </p>
      </div>

      <div className="mt-8">
        {!ready && !success ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-medium text-amber-900">Reset link required</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Open this page from the password reset email. If your link expired, request a new reset link.
            </p>
            <Link to="/forgot-password" className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-500">
              Request a new link
            </Link>
          </div>
        ) : success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="font-medium text-green-900">Password updated</p>
            <p className="mt-2 text-sm leading-6 text-green-800">
              Your password was changed successfully. Redirecting you to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <Label htmlFor="password">New password</Label>
              <div className="mt-1">
                <Input id="password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="mt-1">
                <Input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required placeholder="Repeat your new password" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading && <Spinner />}
              {loading ? 'Updating password...' : 'Update password'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Back to{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
