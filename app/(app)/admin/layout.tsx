'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { adminAuth } from '@/lib/admin-auth';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const router = useRouter();

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check for login page - it handles its own auth
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const checkAdminAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      try {
        const user = await adminAuth.getCurrentUser();
        if (user && user.is_staff) {
          setIsStaff(true);
          setChecking(false);
        } else {
          router.replace('/admin/login');
        }
      } catch (e) {
        // Token invalid or not admin
        router.replace('/admin/login');
      }
    };

    checkAdminAuth();
  }, [isLoginPage, router]);

  // Login page renders without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking || !isStaff) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <p className="text-sm text-zinc-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full z-40 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Main content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-300
          ${collapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
