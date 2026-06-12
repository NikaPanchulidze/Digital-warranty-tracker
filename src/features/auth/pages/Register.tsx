import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Input, Label, Spinner } from '@/app/components/ui';
import { useAuth } from '@/features/auth/auth-context';

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setConfirmationEmail('');
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email')).trim();
    const password = String(form.get('password'));
    const confirmPassword = String(form.get('confirm-password'));

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (result.needsConfirmation) {
        setConfirmationEmail(result.email);
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Start tracking your products and warranties today.
        </p>
      </div>

      <div className="mt-8">
        {confirmationEmail ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-medium text-blue-950">Check your email to confirm your account</p>
            <p className="mt-2 text-sm leading-6 text-blue-900">
              We sent a confirmation link to <span className="font-medium">{confirmationEmail}</span>. Open that email and confirm your account before signing in.
            </p>
            <p className="mt-3 text-sm leading-6 text-blue-800">
              If you do not see it, check Spam or Promotions. After confirming, return here and sign in.
            </p>
            <Link to="/login" className="mt-5 inline-flex text-sm font-medium text-blue-700 hover:text-blue-600">
              Go to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input id="password" name="password" type="password" required placeholder="Create a strong password" />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="mt-1">
                <Input id="confirm-password" name="confirm-password" type="password" required placeholder="Repeat your password" />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading && <Spinner />}
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
