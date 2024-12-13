'use client';

import { AuthProvider } from '@/lib/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
} 