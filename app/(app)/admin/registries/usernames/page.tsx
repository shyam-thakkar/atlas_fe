'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { UsernameItem } from '@/types/admin';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsernamesPage() {
    const router = useRouter();
    const [items, setItems] = useState<UsernameItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UsernameItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getUsernames();
            setItems(data);
        } catch (err) {
            console.error('Failed to load usernames:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            setActionLoading(true);
            await adminApi.deleteUsername(selectedItem.id);
            await loadItems();
            setDeleteConfirmOpen(false);
            setSelectedItem(null);
        } catch (err) {
            console.error('Failed to delete username:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            key: 'username',
            header: 'Username',
            render: (item: UsernameItem) => (
                <span className="font-medium text-violet-400">{item.username}</span>
            ),
        },
        {
            key: 'user_email',
            header: 'User',
            render: (item: UsernameItem) => (
                <span className="text-zinc-300">{item.user_email}</span>
            ),
        },
        {
            key: 'user',
            header: 'User ID',
            render: (item: UsernameItem) => (
                <span className="text-zinc-500 text-xs">#{item.user}</span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/admin/registries')}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Usernames</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Manage assigned portfolio usernames
                    </p>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                getRowKey={(item) => item.id}
                emptyMessage="No usernames found"
                actions={(item) => (
                    <button
                        onClick={() => {
                            setSelectedItem(item);
                            setDeleteConfirmOpen(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete username"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Username"
                description={`Are you sure you want to delete username "${selectedItem?.username}"? This will free up the username for other users.`}
                confirmText="Delete"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
