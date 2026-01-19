'use client';

import React, { useEffect, useState } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { adminApi } from '@/lib/admin-api';
import type { DashboardStats } from '@/types/admin';
import {
    Users,
    Wallet,
    Briefcase,
    MessageSquare,
    FileText,
    TrendingUp,
    Crown,
    Globe,
    Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getDashboardStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                    <p className="text-sm text-zinc-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={loadStats}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Platform overview and key metrics
                </p>
            </div>

            {/* User Stats */}
            <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-4">Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Users"
                        value={stats?.users.total || 0}
                        subtitle={`${stats?.users.active || 0} active`}
                        icon={Users}
                        variant="primary"
                    />
                    <StatsCard
                        title="New This Month"
                        value={stats?.users.new_this_month || 0}
                        icon={TrendingUp}
                        variant="success"
                    />
                    <StatsCard
                        title="Pro Users"
                        value={stats?.users.by_tier.pro || 0}
                        icon={Crown}
                        variant="warning"
                    />
                    <StatsCard
                        title="Lifetime Users"
                        value={stats?.users.by_tier.lifetime || 0}
                        subtitle={`${stats?.users.by_tier.free || 0} free`}
                        icon={Users}
                        variant="default"
                    />
                </div>
            </div>

            {/* Revenue Stats */}
            <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-4">Revenue</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${stats?.revenue.total?.toLocaleString() || 0}`}
                        icon={Wallet}
                        variant="success"
                    />
                    <StatsCard
                        title="This Month"
                        value={`₹${stats?.revenue.this_month?.toLocaleString() || 0}`}
                        icon={TrendingUp}
                        variant="primary"
                    />
                    <StatsCard
                        title="Pending Payments"
                        value={stats?.revenue.pending_payments || 0}
                        icon={Wallet}
                        variant={stats?.revenue.pending_payments && stats.revenue.pending_payments > 0 ? 'warning' : 'default'}
                    />
                </div>
            </div>

            {/* Portfolio & Content Stats */}
            <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-4">Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Portfolios"
                        value={stats?.portfolios.total || 0}
                        subtitle={`${stats?.portfolios.published || 0} published`}
                        icon={Briefcase}
                        variant="primary"
                    />
                    <StatsCard
                        title="Published"
                        value={stats?.portfolios.published || 0}
                        icon={Globe}
                        variant="success"
                    />
                    <StatsCard
                        title="Chat Sessions"
                        value={stats?.chat.total_sessions || 0}
                        subtitle={`${stats?.chat.active_sessions || 0} active`}
                        icon={MessageSquare}
                        variant="default"
                    />
                    <StatsCard
                        title="RAG Documents"
                        value={stats?.chat.total_rag_documents || 0}
                        icon={FileText}
                        variant="default"
                    />
                </div>
            </div>

            {/* Resumes */}
            <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-4">Resumes</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Resumes"
                        value={stats?.resumes.total || 0}
                        icon={FileText}
                        variant="default"
                    />
                </div>
            </div>
        </div>
    );
}
