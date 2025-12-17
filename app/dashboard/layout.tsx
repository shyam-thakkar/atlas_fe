import React from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
                <DashboardSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 w-full h-full overflow-hidden relative">
                    {children}
                </div>
            </main>

            {/* Mobile Drawer (Simplification: Hidden on mobile for now, would use state/sheet in full app) */}
            {/* For a production app, we would add a hamburger menu and mobile sidebar overlay here */}
        </div>
    );
}
