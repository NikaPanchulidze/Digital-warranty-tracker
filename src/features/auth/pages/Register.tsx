import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Input, Label, Spinner } from '@/app/components/ui';
import { useAuth } from '@/features/auth/auth-context';

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const password = String(form.get('password'));
    const confirmPassword = String(form.get('confirm-password'));

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUp(String(form.get('email')), password);
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
