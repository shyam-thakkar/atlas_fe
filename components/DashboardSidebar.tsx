'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { publish } from '@/lib/publish';
import { PublishModal } from './portfolio/PublishModal';

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function DashboardSidebar({ collapsed = false, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPublishStatus();
  }, []);

  const loadPublishStatus = async () => {
    try {
      const status = await publish.getPublishStatus();
      setIsPublished(status.is_published);
    } catch (err) {
      // Silently fail - user might not have published yet
      setIsPublished(false);
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigation = [
    {
      name: 'Overview', href: '/dashboard', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'My Profile', href: '/dashboard/profile', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      name: 'Resume', href: '/dashboard/resume', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Edit Details', href: '/dashboard/portfolio', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      name: 'Split Editor', href: '/dashboard/editor', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    },
    {
      name: 'Live Preview', href: '/dashboard/portfolio/preview', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      name: 'AI Chat', href: '/dashboard/chat', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <span className={`text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
            AIFolio
          </span>
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={handleThemeToggle}
            className={`p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:text-violet-600 dark:hover:text-violet-400 transition-all ${collapsed ? 'hidden' : ''}`}
            aria-label="Toggle theme"
            title="Switch theme"
          >
            {resolvedTheme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3">
        <nav className="space-y-0.5 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center h-10 gap-3 px-2 text-sm rounded-lg transition-all duration-300
                  ${isActive
                    ? 'bg-violet-100 dark:bg-violet-500/10 text-violet-900 dark:text-violet-300 font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }
                `}
                title={item.name}
              >
                {/* Icon wrapper - fixed size like PFP */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? 'bg-violet-200 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400' : 'text-zinc-500 dark:text-zinc-500'}`}>
                  {item.icon}
                </div>
                {/* Label - animate like other text */}
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Publish Button - Special item with status indicator */}
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className={`
              relative w-full flex items-center h-10 gap-3 px-2 text-sm rounded-lg transition-all duration-300
              ${isPublished
                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }
            `}
            title={isPublished ? 'Published - Click to manage' : 'Publish your portfolio'}
          >
            {/* Icon wrapper */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isPublished ? 'bg-green-200 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'text-zinc-500 dark:text-zinc-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Label */}
            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
              {isPublished ? 'Published' : 'Publish'}
            </span>
            {/* Status dot */}
            {isPublished && (
              <span className={`absolute right-2 w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50 ${collapsed ? 'right-1' : ''}`} />
            )}
          </button>
        </nav>
      </div>

      {/* User section */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/50">
        {/* User row - always horizontal */}
        <div className="flex items-center gap-2.5 mb-2">
          {/* Profile Picture */}
          <div
            className="w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-400 overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600 transition-shadow"
            title={user?.name || 'User'}
          >
            {user?.profile_image ? (
              <img src={user.profile_image} alt="User" className="w-full h-full object-cover" />
            ) : (
              user?.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>

          {/* User info - animate width */}
          <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate whitespace-nowrap">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate whitespace-nowrap">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          className="w-full h-8 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
          title="Sign out"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
            Sign out
          </span>
        </button>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          loadPublishStatus(); // Refresh status on close (catches unpublish too)
        }}
        onSuccess={() => {
          loadPublishStatus(); // Refresh status after publish
        }}
      />
    </div>
  );
}
