'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors">
            {/* Sidebar */}
            <aside className={`${sidebarCollapsed ? 'w-16' : 'w-56'} flex-shrink-0 transition-all duration-300`}>
                <DashboardSidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
