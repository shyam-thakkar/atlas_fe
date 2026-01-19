'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, FormInput, FormTextarea } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { ReservedUsername } from '@/types/admin';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReservedUsernamesPage() {
    const router = useRouter();
    const [items, setItems] = useState<ReservedUsername[]>([]);
    const [loading, setLoading] = useState(true);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ReservedUsername | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [form, setForm] = useState({
        username: '',
        reason: '',
    });

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getReservedUsernames();
            setItems(data);
        } catch (err) {
            console.error('Failed to load reserved usernames:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const resetForm = () => {
        setForm({ username: '', reason: '' });
        setSelectedItem(null);
    };

    const openEditModal = (item: ReservedUsername) => {
        setSelectedItem(item);
        setForm({
            username: item.username,
            reason: item.reason,
        });
        setFormModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setActionLoading(true);
            if (selectedItem) {
                await adminApi.updateReservedUsername(selectedItem.id, form);
            } else {
                await adminApi.createReservedUsername(form);
            }
            await loadItems();
            setFormModalOpen(false);
            resetForm();
        } catch (err) {
            console.error('Failed to save item:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            setActionLoading(true);
            await adminApi.deleteReservedUsername(selectedItem.id);
            await loadItems();
            setDeleteConfirmOpen(false);
            setSelectedItem(null);
        } catch (err) {
            console.error('Failed to delete item:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            key: 'username',
            header: 'Username',
            render: (item: ReservedUsername) => (
                <span className="font-medium text-red-400">{item.username}</span>
            ),
        },
        {
            key: 'reason',
            header: 'Reason',
            render: (item: ReservedUsername) => (
                <span className="text-zinc-400 text-sm">{item.reason}</span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/registries')}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Reserved Usernames</h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            Block usernames from being claimed
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setFormModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Reserve Username
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                getRowKey={(item) => item.id}
                emptyMessage="No reserved usernames"
                actions={(item) => (
                    <>
                        <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedItem(item);
                                setDeleteConfirmOpen(true);
                            }}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            />

            {/* Form Modal */}
            <FormModal
                open={formModalOpen}
                onClose={() => {
                    setFormModalOpen(false);
                    resetForm();
                }}
                title={selectedItem ? 'Edit Reserved Username' : 'Reserve Username'}
                onSubmit={handleSubmit}
                submitText={selectedItem ? 'Update' : 'Reserve'}
                loading={actionLoading}
            >
                <FormInput
                    label="Username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="admin"
                    disabled={!!selectedItem}
                />
                <FormTextarea
                    label="Reason"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="System reserved"
                    rows={3}
                />
            </FormModal>

            {/* Delete Confirm */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Remove Reservation"
                description={`Are you sure you want to unreserve "${selectedItem?.username}"? Users will be able to claim this username.`}
                confirmText="Remove"
                variant="warning"
                loading={actionLoading}
            />
        </div>
    );
}
