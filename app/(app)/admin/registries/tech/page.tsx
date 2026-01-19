'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, FormInput, FormSelect, FormCheckbox } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { TechRegistryItem, IconType, ColorVariant } from '@/types/admin';
import { Plus, Edit, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TechRegistryPage() {
    const router = useRouter();
    const [items, setItems] = useState<TechRegistryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TechRegistryItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [form, setForm] = useState({
        display_name: '',
        code_name: '',
        icon_type: 'url' as IconType,
        icon_source_url: '',
        doc_url: '',
        color_variant: 'colored' as ColorVariant,
        is_verified: false,
    });

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getTechRegistry();
            setItems(data);
        } catch (err) {
            console.error('Failed to load tech registry:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const resetForm = () => {
        setForm({
            display_name: '',
            code_name: '',
            icon_type: 'url',
            icon_source_url: '',
            doc_url: '',
            color_variant: 'colored',
            is_verified: false,
        });
        setSelectedItem(null);
    };

    const openEditModal = (item: TechRegistryItem) => {
        setSelectedItem(item);
        setForm({
            display_name: item.display_name,
            code_name: item.code_name,
            icon_type: item.icon_type,
            icon_source_url: item.icon_source_url || '',
            doc_url: item.doc_url || '',
            color_variant: item.color_variant,
            is_verified: item.is_verified,
        });
        setFormModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            setActionLoading(true);
            if (selectedItem) {
                await adminApi.updateTechRegistryItem(selectedItem.id, form);
            } else {
                await adminApi.createTechRegistryItem(form as Omit<TechRegistryItem, 'id'>);
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
            await adminApi.deleteTechRegistryItem(selectedItem.id);
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
            key: 'display_name',
            header: 'Name',
            render: (item: TechRegistryItem) => (
                <div className="flex items-center gap-3">
                    {item.icon_source_url && (
                        <img src={item.icon_source_url} alt="" className="w-6 h-6" />
                    )}
                    <div>
                        <p className="font-medium text-white">{item.display_name}</p>
                        <p className="text-xs text-zinc-500">{item.code_name}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'icon_type',
            header: 'Icon Type',
            render: (item: TechRegistryItem) => (
                <span className="text-zinc-400 text-xs">{item.icon_type}</span>
            ),
        },
        {
            key: 'color_variant',
            header: 'Color',
            render: (item: TechRegistryItem) => (
                <span className="text-zinc-400 text-xs">{item.color_variant}</span>
            ),
        },
        {
            key: 'is_verified',
            header: 'Verified',
            render: (item: TechRegistryItem) => (
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
                        <h1 className="text-2xl font-bold text-white">Tech Registry</h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            Manage technology stack items
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
                    Add Tech
                </button>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={items}
                loading={loading}
                getRowKey={(item) => item.id}
                emptyMessage="No tech items found"
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
                title={selectedItem ? 'Edit Tech Item' : 'Add Tech Item'}
                onSubmit={handleSubmit}
                submitText={selectedItem ? 'Update' : 'Create'}
                loading={actionLoading}
                size="lg"
            >
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Display Name"
                        value={form.display_name}
                        onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                        placeholder="React"
                    />
                    <FormInput
                        label="Code Name"
                        value={form.code_name}
                        onChange={(e) => setForm({ ...form, code_name: e.target.value })}
                        placeholder="react"
                    />
                </div>
                <FormSelect
                    label="Icon Type"
                    value={form.icon_type}
                    onChange={(e) => setForm({ ...form, icon_type: e.target.value as IconType })}
                    options={[
                        { value: 'url', label: 'URL' },
                        { value: 'svg', label: 'SVG' },
                        { value: 'font', label: 'Font Icon' },
                    ]}
                />
                <FormInput
                    label="Icon URL"
                    value={form.icon_source_url}
                    onChange={(e) => setForm({ ...form, icon_source_url: e.target.value })}
                    placeholder="https://..."
                />
                <FormInput
                    label="Documentation URL"
                    value={form.doc_url}
                    onChange={(e) => setForm({ ...form, doc_url: e.target.value })}
                    placeholder="https://reactjs.org"
                />
                <FormSelect
                    label="Color Variant"
                    value={form.color_variant}
                    onChange={(e) => setForm({ ...form, color_variant: e.target.value as ColorVariant })}
                    options={[
                        { value: 'colored', label: 'Colored' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'light', label: 'Light' },
                    ]}
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
                title="Delete Tech Item"
                description={`Are you sure you want to delete "${selectedItem?.display_name}"? This may affect portfolios using this tech.`}
                confirmText="Delete"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
