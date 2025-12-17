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
            <aside className="w-64 flex-shrink-0 hidden md:flex">
                <DashboardSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Mobile Drawer (Simplification: Hidden on mobile for now, would use state/sheet in full app) */}
            {/* For a production app, we would add a hamburger menu and mobile sidebar overlay here */}
        </div>
    );
}
