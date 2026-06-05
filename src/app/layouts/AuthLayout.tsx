import React from 'react';
import { Outlet } from 'react-router';
import { Package } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 mb-8">
            <Package className="w-8 h-8" />
            <span>WarrantyTracker</span>
          </div>
          <Outlet />
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-blue-600">
        <div className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-12">
          <div className="max-w-2xl text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Manage all your products in one place</h2>
            <p className="text-blue-100 text-lg mb-12">Never lose a receipt or forget a warranty expiration date again. Digital Warranty & Product Ownership Tracker keeps your assets organized.</p>
            
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Warranties</h3>
                <p className="text-blue-100 text-sm">Get notified before warranties expire so you can make claims in time.</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Store Receipts</h3>
                <p className="text-blue-100 text-sm">Safely keep all your digital manuals and purchase receipts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
