'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/DataTable';
import { adminApi } from '@/lib/admin-api';
import type { AdminUser, UserTier, PaginatedResponse } from '@/types/admin';
import { Eye, Crown, Check, X } from 'lucide-react';

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<PaginatedResponse<AdminUser>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState<UserTier | ''>('');
    const [activeFilter, setActiveFilter] = useState<boolean | ''>('');
    const pageSize = 20;

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getUsers({
                page,
                page_size: pageSize,
                search: search || undefined,
                tier: tierFilter || undefined,
                is_active: activeFilter === '' ? undefined : activeFilter,
            });
            setUsers(data);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search, tierFilter, activeFilter]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = (query: string) => {
        setSearch(query);
        setPage(1);
    };

    const getTierBadge = (tier: UserTier) => {
        const styles = {
            free: 'bg-zinc-700 text-zinc-300',
            pro: 'bg-violet-500/20 text-violet-400',
            lifetime: 'bg-amber-500/20 text-amber-400',
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[tier]}`}>
                {tier === 'lifetime' && <Crown className="w-3 h-3" />}
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </span>
        );
    };

    const columns = [
        {
            key: 'email',
            header: 'Email',
            render: (user: AdminUser) => (
                <div>
                    <p className="font-medium text-white">{user.email}</p>
                    {user.name && <p className="text-xs text-zinc-500">{user.name}</p>}
                </div>
            ),
        },
        {
            key: 'user_tier',
            header: 'Tier',
            render: (user: AdminUser) => getTierBadge(user.user_tier),
        },
        {
            key: 'plan_type',
            header: 'Plan',
            render: (user: AdminUser) => (
                <span className="text-zinc-400 text-xs">
                    {user.plan_type.replace('_', ' ')}
                </span>
            ),
        },
        {
            key: 'subscription_expiry',
            header: 'Expiry',
            render: (user: AdminUser) => (
                <span className="text-zinc-400 text-xs">
                    {user.subscription_expiry
                        ? new Date(user.subscription_expiry).toLocaleDateString()
                        : '-'}
                </span>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (user: AdminUser) => (
                user.is_active ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-red-400">
                        <X className="w-3.5 h-3.5" /> Inactive
                    </span>
                )
            ),
        },
        {
            key: 'created_at',
            header: 'Joined',
            render: (user: AdminUser) => (
                <span className="text-zinc-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'last_login',
            header: 'Last Login',
            render: (user: AdminUser) => (
                <span className="text-zinc-500 text-xs">
                    {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'}
                </span>
            ),
        },
    ];

    const filters = (
        <>
            <select
                value={tierFilter}
                onChange={(e) => {
                    setTierFilter(e.target.value as UserTier | '');
                    setPage(1);
                }}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            >
                <option value="">All Tiers</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="lifetime">Lifetime</option>
            </select>
            <select
                value={activeFilter === '' ? '' : activeFilter ? 'true' : 'false'}
                onChange={(e) => {
                    setActiveFilter(e.target.value === '' ? '' : e.target.value === 'true');
                    setPage(1);
                }}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
        </>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Users</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Manage platform users and subscriptions
                </p>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={users.results}
                loading={loading}
                totalCount={users.count}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onSearch={handleSearch}
                searchPlaceholder="Search by email or name..."
                emptyMessage="No users found"
                getRowKey={(user) => user.id}
                onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
                filters={filters}
                actions={(user) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/users/${user.id}`);
                        }}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="View user"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                )}
            />
        </div>
    );
}
