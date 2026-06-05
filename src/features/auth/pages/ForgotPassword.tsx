import React, { useState } from 'react';
import { Link } from 'react-router';
import { Button, Input, Label, Spinner } from '@/app/components/ui';
import { supabase } from '@/shared/api/supabase';

export function ForgotPassword() {
  const [emailSentTo, setEmailSentTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setEmailSentTo('');
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email')).trim();

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setEmailSentTo(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your account email and we will send you a secure password reset link.
        </p>
      </div>

      <div className="mt-8">
        {emailSentTo ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="font-medium text-green-900">Check your email</p>
            <p className="mt-2 text-sm leading-6 text-green-800">
              We sent a password reset link to {emailSentTo}. Open it from the same browser to create a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading && <Spinner />}
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
