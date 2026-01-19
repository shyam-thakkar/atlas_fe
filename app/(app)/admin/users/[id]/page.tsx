'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import type { AdminUser, UserTier, PlanType } from '@/types/admin';
import { FormModal, FormInput, FormSelect, FormCheckbox } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
    ArrowLeft,
    User,
    Mail,
    Crown,
    Calendar,
    Clock,
    Shield,
    FileText,
    AtSign,
    Edit,
    TrendingUp,
    RotateCcw,
    Loader2,
    Check,
    X,
} from 'lucide-react';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = Number(params.id);

    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [extendModalOpen, setExtendModalOpen] = useState(false);
    const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

    // Form states
    const [editForm, setEditForm] = useState({
        name: '',
        is_active: true,
        is_staff: false,
    });
    const [upgradeForm, setUpgradeForm] = useState({
        tier: 'pro' as UserTier,
        plan_type: 'pro_monthly' as PlanType,
        days: 30,
    });
    const [extendDays, setExtendDays] = useState(30);
    const [resetType, setResetType] = useState<'resume' | 'username' | 'all'>('all');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getUser(userId);
            setUser(data);
            setEditForm({
                name: data.name,
                is_active: data.is_active,
                is_staff: data.is_staff,
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load user');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        try {
            setActionLoading(true);
            const updated = await adminApi.updateUser(userId, editForm);
            setUser(updated);
            setEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update user:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpgradeSubmit = async () => {
        try {
            setActionLoading(true);
            const updated = await adminApi.upgradeUser(userId, upgradeForm);
            setUser(updated);
            setUpgradeModalOpen(false);
        } catch (err) {
            console.error('Failed to upgrade user:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleExtendSubmit = async () => {
        try {
            setActionLoading(true);
            await adminApi.extendSubscription(userId, { days: extendDays });
            await loadUser();
            setExtendModalOpen(false);
        } catch (err) {
            console.error('Failed to extend subscription:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetCounts = async () => {
        try {
            setActionLoading(true);
            await adminApi.resetUserCounts(userId, { type: resetType });
            await loadUser();
            setResetConfirmOpen(false);
        } catch (err) {
            console.error('Failed to reset counts:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'User not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const getTierBadge = (tier: UserTier) => {
        const styles = {
            free: 'bg-zinc-700 text-zinc-300',
            pro: 'bg-violet-500/20 text-violet-400',
            lifetime: 'bg-amber-500/20 text-amber-400',
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${styles[tier]}`}>
                {tier === 'lifetime' && <Crown className="w-4 h-4" />}
                {tier === 'pro' && <Crown className="w-4 h-4" />}
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{user.name || 'Unnamed User'}</h1>
                    <p className="text-zinc-500 text-sm">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    {getTierBadge(user.user_tier)}
                    {user.is_staff && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                            <Shield className="w-4 h-4" />
                            Staff
                        </span>
                    )}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Account Info */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-zinc-400 mb-4">Account Info</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">{user.name || 'No name'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <AtSign className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">{user.portfolio_username || 'No username'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {user.is_active ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <X className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-zinc-300">
                                {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditModalOpen(true)}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                </div>

                {/* Subscription */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-zinc-400 mb-4">Subscription</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Crown className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">
                                {user.plan_type.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">
                                Expires: {user.subscription_expiry
                                    ? new Date(user.subscription_expiry).toLocaleDateString()
                                    : 'Never'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <button
                            onClick={() => setUpgradeModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Upgrade Tier
                        </button>
                        <button
                            onClick={() => setExtendModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            Extend Subscription
                        </button>
                    </div>
                </div>

                {/* Usage & Activity */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-zinc-400 mb-4">Usage</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-zinc-500" />
                                <span className="text-sm text-zinc-400">Resume Processes</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-200">{user.resume_process_count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AtSign className="w-4 h-4 text-zinc-500" />
                                <span className="text-sm text-zinc-400">Username Changes</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-200">{user.username_change_count}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm text-zinc-300">
                                Last Login: {user.last_login
                                    ? new Date(user.last_login).toLocaleDateString()
                                    : 'Never'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setResetConfirmOpen(true)}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Counts
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            <FormModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit User"
                onSubmit={handleEditSubmit}
                loading={actionLoading}
            >
                <FormInput
                    label="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <FormCheckbox
                    label="Active"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                />
                <FormCheckbox
                    label="Staff"
                    checked={editForm.is_staff}
                    onChange={(e) => setEditForm({ ...editForm, is_staff: e.target.checked })}
                />
            </FormModal>

            {/* Upgrade Modal */}
            <FormModal
                open={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                title="Upgrade User Tier"
                onSubmit={handleUpgradeSubmit}
                submitText="Upgrade"
                loading={actionLoading}
            >
                <FormSelect
                    label="Tier"
                    value={upgradeForm.tier}
                    onChange={(e) => setUpgradeForm({ ...upgradeForm, tier: e.target.value as UserTier })}
                    options={[
                        { value: 'free', label: 'Free' },
                        { value: 'pro', label: 'Pro' },
                        { value: 'lifetime', label: 'Lifetime' },
                    ]}
                />
                <FormSelect
                    label="Plan Type"
                    value={upgradeForm.plan_type}
                    onChange={(e) => setUpgradeForm({ ...upgradeForm, plan_type: e.target.value as PlanType })}
                    options={[
                        { value: 'free', label: 'Free' },
                        { value: 'pro_monthly', label: 'Pro Monthly' },
                        { value: 'lifetime', label: 'Lifetime' },
                    ]}
                />
                <FormInput
                    label="Days"
                    type="number"
                    value={upgradeForm.days}
                    onChange={(e) => setUpgradeForm({ ...upgradeForm, days: Number(e.target.value) })}
                />
            </FormModal>

            {/* Extend Modal */}
            <FormModal
                open={extendModalOpen}
                onClose={() => setExtendModalOpen(false)}
                title="Extend Subscription"
                onSubmit={handleExtendSubmit}
                submitText="Extend"
                loading={actionLoading}
            >
                <FormInput
                    label="Days to extend"
                    type="number"
                    value={extendDays}
                    onChange={(e) => setExtendDays(Number(e.target.value))}
                />
            </FormModal>

            {/* Reset Confirm */}
            <FormModal
                open={resetConfirmOpen}
                onClose={() => setResetConfirmOpen(false)}
                title="Reset User Counts"
                onSubmit={handleResetCounts}
                submitText="Reset"
                loading={actionLoading}
            >
                <FormSelect
                    label="Reset Type"
                    value={resetType}
                    onChange={(e) => setResetType(e.target.value as 'resume' | 'username' | 'all')}
                    options={[
                        { value: 'all', label: 'All Counts' },
                        { value: 'resume', label: 'Resume Process Count' },
                        { value: 'username', label: 'Username Change Count' },
                    ]}
                />
                <p className="text-sm text-zinc-500">
                    This will reset the selected counter(s) to zero.
                </p>
            </FormModal>
        </div>
    );
}
