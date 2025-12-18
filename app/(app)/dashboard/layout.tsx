'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { useTheme } from 'next-themes';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors">
            {/* Sidebar */}
            <aside className={`${sidebarCollapsed ? 'w-16' : 'w-56'} flex-shrink-0 transition-all duration-200`}>
                <DashboardSidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {/* Top Bar - Minimal */}
                <div className="h-12 flex items-center justify-end px-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-950 transition-colors">
                    {mounted && (
                        <button
                            onClick={handleThemeToggle}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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

                <div className="flex-1 w-full h-full overflow-hidden relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
