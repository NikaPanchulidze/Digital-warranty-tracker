import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Package } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600 font-semibold">
          <Package className="w-6 h-6 animate-pulse" />
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
