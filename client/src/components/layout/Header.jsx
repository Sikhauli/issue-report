import React from 'react';
import { useAuth } from '@/features/auth/authHooks';
import { PrimaryButton } from '@/common/buttons/PrimaryButton';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Issue Tracker</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <PrimaryButton onClick={logout} className="text-sm">
                  Logout
                </PrimaryButton>
              </>
            ) : (
              <div className="flex space-x-2">
                <PrimaryButton onClick={() => window.location.href = '/login'} className="text-sm">
                  Login
                </PrimaryButton>
                <PrimaryButton onClick={() => window.location.href = '/register'} className="text-sm">
                  Register
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};