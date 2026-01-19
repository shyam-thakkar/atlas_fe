'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, FormSelect } from '@/components/admin/FormModal';
import { adminApi } from '@/lib/admin-api';
import type { AdminPayment, PaymentStatus, PlanType, PaginatedResponse } from '@/types/admin';
import { Check, Clock, X, Edit } from 'lucide-react';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<PaginatedResponse<AdminPayment>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
    const [planFilter, setPlanFilter] = useState<PlanType | ''>('');
    const pageSize = 20;

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
    const [newStatus, setNewStatus] = useState<PaymentStatus>('success');
    const [actionLoading, setActionLoading] = useState(false);

    const loadPayments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getPayments({
                page,
                page_size: pageSize,
                status: statusFilter || undefined,
                plan_type: planFilter || undefined,
            });
            setPayments(data);
        } catch (err) {
            console.error('Failed to load payments:', err);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, planFilter]);

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    const handleEditStatus = async () => {
        if (!selectedPayment) return;
        try {
            setActionLoading(true);
            await adminApi.updatePayment(selectedPayment.id, { status: newStatus });
            await loadPayments();
            setEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update payment:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: PaymentStatus) => {
        const config = {
            pending: { icon: Clock, bg: 'bg-amber-500/20', text: 'text-amber-400' },
            success: { icon: Check, bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
            failed: { icon: X, bg: 'bg-red-500/20', text: 'text-red-400' },
        };
        const { icon: Icon, bg, text } = config[status];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const columns = [
        {
            key: 'user_email',
            header: 'User',
            render: (payment: AdminPayment) => (
                <span className="text-zinc-200">{payment.user_email}</span>
            ),
        },
        {
            key: 'razorpay_order_id',
            header: 'Order ID',
            render: (payment: AdminPayment) => (
                <span className="text-zinc-400 font-mono text-xs">{payment.razorpay_order_id}</span>
            ),
        },
        {
            key: 'plan_type',
            header: 'Plan',
            render: (payment: AdminPayment) => (
                <span className="text-zinc-300 text-xs">
                    {payment.plan_type.replace('_', ' ').toUpperCase()}
                </span>
            ),
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (payment: AdminPayment) => (
                <span className="text-zinc-200 font-medium">₹{payment.amount}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (payment: AdminPayment) => getStatusBadge(payment.status),
        },
        {
            key: 'created_at',
            header: 'Date',
            render: (payment: AdminPayment) => (
                <span className="text-zinc-500 text-xs">
                    {new Date(payment.created_at).toLocaleString()}
                </span>
            ),
        },
    ];

    const filters = (
        <>
            <select
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value as PaymentStatus | '');
                    setPage(1);
                }}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
            </select>
            <select
                value={planFilter}
                onChange={(e) => {
                    setPlanFilter(e.target.value as PlanType | '');
                    setPage(1);
                }}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            >
                <option value="">All Plans</option>
                <option value="pro_monthly">Pro Monthly</option>
                <option value="lifetime">Lifetime</option>
            </select>
        </>
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Payments</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    View and manage payment transactions
                </p>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={payments.results}
                loading={loading}
                totalCount={payments.count}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                emptyMessage="No payments found"
                getRowKey={(payment) => payment.id}
                filters={filters}
                actions={(payment) => (
                    <button
                        onClick={() => {
                            setSelectedPayment(payment);
                            setNewStatus(payment.status);
                            setEditModalOpen(true);
                        }}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit status"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                )}
            />

            {/* Edit Status Modal */}
            <FormModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Update Payment Status"
                onSubmit={handleEditStatus}
                submitText="Update"
                loading={actionLoading}
            >
                {selectedPayment && (
                    <>
                        <div className="bg-zinc-800 rounded-lg p-3 mb-4">
                            <p className="text-xs text-zinc-500 mb-1">Order ID</p>
                            <p className="text-sm text-zinc-200 font-mono">{selectedPayment.razorpay_order_id}</p>
                        </div>
                        <FormSelect
                            label="Status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as PaymentStatus)}
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'success', label: 'Success' },
                                { value: 'failed', label: 'Failed' },
                            ]}
                        />
                    </>
                )}
            </FormModal>
        </div>
    );
}
