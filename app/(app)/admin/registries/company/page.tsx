'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, FormInput, FormCheckbox } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { CompanyRegistryItem } from '@/types/admin';
import { Plus, Edit, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompanyRegistryPage() {
    const router = useRouter();
    const [items, setItems] = useState<CompanyRegistryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CompanyRegistryItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        domain: '',
        logo_url: '',
        is_verified: false,
    });

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getCompanyRegistry();
            setItems(data);
        } catch (err) {
            console.error('Failed to load company registry:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const resetForm = () => {
        setForm({
            name: '',
            domain: '',
            logo_url: '',
            is_verified: false,
        });
        setSelectedItem(null);
    };

    const openEditModal = (item: CompanyRegistryItem) => {
        setSelectedItem(item);
        setForm({
            name: item.name,
            domain: item.domain,
            logo_url: item.logo_url || '',
            is_verified: item.is_verified,
        });
        setFormModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setActionLoading(true);
            if (selectedItem) {
                await adminApi.updateCompanyRegistryItem(selectedItem.id, form);
            } else {
                await adminApi.createCompanyRegistryItem(form as Omit<CompanyRegistryItem, 'id'>);
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
            await adminApi.deleteCompanyRegistryItem(selectedItem.id);
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
            key: 'name',
            header: 'Company',
            render: (item: CompanyRegistryItem) => (
                <div className="flex items-center gap-3">
                    {item.logo_url && (
                        <img src={item.logo_url} alt="" className="w-8 h-8 rounded" />
                    )}
                    <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.domain}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'domain',
            header: 'Domain',
            render: (item: CompanyRegistryItem) => (
                <span className="text-zinc-400 text-sm">{item.domain}</span>
            ),
        },
        {
            key: 'is_verified',
            header: 'Verified',
            render: (item: CompanyRegistryItem) => (
                item.is_verified ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                    <X className="w-4 h-4 text-zinc-600" />
                )
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
                        <h1 className="text-2xl font-bold text-white">Company Registry</h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            Manage companies for experience entries
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
                    Add Company
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                getRowKey={(item) => item.id}
                emptyMessage="No companies found"
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
                title={selectedItem ? 'Edit Company' : 'Add Company'}
                onSubmit={handleSubmit}
                submitText={selectedItem ? 'Update' : 'Create'}
                loading={actionLoading}
            >
                <FormInput
                    label="Company Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Google"
                />
                <FormInput
                    label="Domain"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    placeholder="google.com"
                />
                <FormInput
                    label="Logo URL"
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    placeholder="https://..."
                />
                <FormCheckbox
                    label="Verified"
                    checked={form.is_verified}
                    onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                />
            </FormModal>

            {/* Delete Confirm */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Company"
                description={`Are you sure you want to delete "${selectedItem?.name}"?`}
                confirmText="Delete"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
