'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormModal, FormInput, FormTextarea } from '@/components/admin/FormModal';
import type { AdminPortfolioDetail, PublishedSnapshot } from '@/types/admin';
import {
    ArrowLeft,
    Globe,
    GlobeLock,
    Calendar,
    User,
    Mail,
    Briefcase,
    GraduationCap,
    Code2,
    Share2,
    FileStack,
    Check,
    RotateCcw,
    Trash2,
    Edit,
    ExternalLink,
    Loader2,
    Eye,
} from 'lucide-react';

type Tab = 'overview' | 'experiences' | 'projects' | 'education' | 'tech' | 'socials' | 'snapshots';

export default function PortfolioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const portfolioId = Number(params.id);

    const [portfolio, setPortfolio] = useState<AdminPortfolioDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [unpublishConfirmOpen, setUnpublishConfirmOpen] = useState(false);
    const [activateSnapshotId, setActivateSnapshotId] = useState<number | null>(null);
    const [deleteSnapshotId, setDeleteSnapshotId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        title: '',
        theme: '',
    });

    useEffect(() => {
        loadPortfolio();
    }, [portfolioId]);

    const loadPortfolio = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getPortfolio(portfolioId);
            setPortfolio(data);
            setEditForm({
                title: data.title,
                theme: data.theme,
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load portfolio');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        try {
            setActionLoading(true);
            const updated = await adminApi.updatePortfolio(portfolioId, editForm);
            setPortfolio(updated);
            setEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update portfolio:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnpublish = async () => {
        try {
            setActionLoading(true);
            await adminApi.unpublishPortfolio(portfolioId);
            await loadPortfolio();
            setUnpublishConfirmOpen(false);
        } catch (err) {
            console.error('Failed to unpublish:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleActivateSnapshot = async () => {
        if (!activateSnapshotId) return;
        try {
            setActionLoading(true);
            await adminApi.activateSnapshot(portfolioId, activateSnapshotId);
            await loadPortfolio();
            setActivateSnapshotId(null);
        } catch (err) {
            console.error('Failed to activate snapshot:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSnapshot = async () => {
        if (!deleteSnapshotId) return;
        try {
            setActionLoading(true);
            await adminApi.deleteSnapshot(portfolioId, deleteSnapshotId);
            await loadPortfolio();
            setDeleteSnapshotId(null);
        } catch (err) {
            console.error('Failed to delete snapshot:', err);
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

    if (error || !portfolio) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Portfolio not found'}</p>
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

    const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { key: 'overview', label: 'Overview', icon: <Briefcase className="w-4 h-4" /> },
        { key: 'experiences', label: 'Experiences', icon: <Briefcase className="w-4 h-4" />, count: portfolio.experiences?.length },
        { key: 'projects', label: 'Projects', icon: <Code2 className="w-4 h-4" />, count: portfolio.projects?.length },
        { key: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" />, count: portfolio.education?.length },
        { key: 'tech', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" />, count: portfolio.tech_stack?.length },
        { key: 'socials', label: 'Socials', icon: <Share2 className="w-4 h-4" />, count: portfolio.socials?.length },
        { key: 'snapshots', label: 'Snapshots', icon: <FileStack className="w-4 h-4" />, count: portfolio.published_snapshots?.length },
    ];

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
                    <h1 className="text-2xl font-bold text-white">{portfolio.title || 'Untitled Portfolio'}</h1>
                    <p className="text-zinc-500 text-sm">{portfolio.user_email}</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Preview in Template Button */}
                    <a
                        href={`/admin/portfolios/${portfolioId}/preview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                        title="Preview in template"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </a>
                    {portfolio.is_published ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400">
                            <Globe className="w-4 h-4" />
                            Published
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-zinc-700 text-zinc-400">
                            <GlobeLock className="w-4 h-4" />
                            Draft
                        </span>
                    )}
                    {portfolio.is_published && portfolio.public_url && (
                        <a
                            href={portfolio.public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="View live (public URL)"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-zinc-800">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.key
                                    ? 'text-violet-400 border-violet-400'
                                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                }
              `}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                            <h3 className="text-sm font-medium text-zinc-400 mb-4">Basic Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm text-zinc-300">{portfolio.username_str || 'No username'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm text-zinc-300">{portfolio.user_email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm text-zinc-300">
                                        Created: {new Date(portfolio.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm text-zinc-300">
                                        Updated: {new Date(portfolio.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setEditModalOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                {portfolio.is_published && (
                                    <button
                                        onClick={() => setUnpublishConfirmOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                                    >
                                        <GlobeLock className="w-4 h-4" />
                                        Unpublish
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile */}
                        {portfolio.profile && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                <h3 className="text-sm font-medium text-zinc-400 mb-4">Profile</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-1">Headline</p>
                                        <p className="text-sm text-zinc-200">{portfolio.profile.headline || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-1">Short Bio</p>
                                        <p className="text-sm text-zinc-300">{portfolio.profile.short_bio || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Missing Tech */}
                        {portfolio.missing_tech_stack && portfolio.missing_tech_stack.length > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 md:col-span-2">
                                <h3 className="text-sm font-medium text-amber-400 mb-3">Missing Tech Stack Items</h3>
                                <div className="flex flex-wrap gap-2">
                                    {portfolio.missing_tech_stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'experiences' && (
                    <div className="space-y-4">
                        {portfolio.experiences?.length > 0 ? (
                            portfolio.experiences.map((exp) => (
                                <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-medium text-white">{exp.role}</h4>
                                            <p className="text-violet-400">{exp.company_name}</p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-3">{exp.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8">No experiences added</p>
                        )}
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolio.projects?.length > 0 ? (
                            portfolio.projects.map((project) => (
                                <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                    <h4 className="text-lg font-medium text-white mb-1">{project.title}</h4>
                                    <p className="text-sm text-zinc-400 mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.tech_used?.map((techId) => (
                                            <span key={techId} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">
                                                Tech #{techId}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        {project.repo_url && (
                                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">
                                                Repo
                                            </a>
                                        )}
                                        {project.live_url && (
                                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-zinc-300">
                                                Live
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8 md:col-span-2">No projects added</p>
                        )}
                    </div>
                )}

                {activeTab === 'education' && (
                    <div className="space-y-4">
                        {portfolio.education?.length > 0 ? (
                            portfolio.education.map((edu) => (
                                <div key={edu.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                                    <h4 className="text-lg font-medium text-white">{edu.institution}</h4>
                                    <p className="text-violet-400">{edu.degree} in {edu.field_of_study}</p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        {edu.start_date} - {edu.end_date}
                                    </p>
                                    {edu.grade && (
                                        <p className="text-sm text-zinc-400 mt-2">
                                            Grade: {edu.grade} ({edu.grade_type?.toUpperCase()})
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8">No education added</p>
                        )}
                    </div>
                )}

                {activeTab === 'tech' && (
                    <div className="flex flex-wrap gap-3">
                        {portfolio.tech_stack?.length > 0 ? (
                            portfolio.tech_stack.map((tech) => (
                                <div key={tech.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                                    <p className="text-sm text-zinc-200">{tech.tech_name || `Tech #${tech.tech}`}</p>
                                    <p className="text-xs text-zinc-500">{tech.proficiency}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8 w-full">No tech stack added</p>
                        )}
                    </div>
                )}

                {activeTab === 'socials' && (
                    <div className="space-y-3">
                        {portfolio.socials?.length > 0 ? (
                            portfolio.socials.map((social) => (
                                <div key={social.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-200">{social.platform_name || `Platform #${social.social_platform}`}</p>
                                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-400 hover:underline">
                                            {social.url}
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8">No socials added</p>
                        )}
                    </div>
                )}

                {activeTab === 'snapshots' && (
                    <div className="space-y-4">
                        {portfolio.published_snapshots?.length > 0 ? (
                            portfolio.published_snapshots.map((snapshot) => (
                                <div key={snapshot.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${snapshot.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                            v{snapshot.version}
                                        </div>
                                        <div>
                                            <p className="text-sm text-zinc-200">Version {snapshot.version}</p>
                                            <p className="text-xs text-zinc-500">
                                                Published: {new Date(snapshot.published_at).toLocaleString()}
                                            </p>
                                        </div>
                                        {snapshot.is_active && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                                <Check className="w-3 h-3" />
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!snapshot.is_active && (
                                            <>
                                                <button
                                                    onClick={() => setActivateSnapshotId(snapshot.id)}
                                                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                                    title="Activate this version"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteSnapshotId(snapshot.id)}
                                                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 text-center py-8">No snapshots available</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <FormModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Portfolio"
                onSubmit={handleEditSubmit}
                loading={actionLoading}
            >
                <FormInput
                    label="Title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
                <FormInput
                    label="Theme"
                    value={editForm.theme}
                    onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                />
            </FormModal>

            <ConfirmDialog
                open={unpublishConfirmOpen}
                onClose={() => setUnpublishConfirmOpen(false)}
                onConfirm={handleUnpublish}
                title="Unpublish Portfolio"
                description="This will deactivate all published snapshots. The portfolio will no longer be accessible publicly."
                confirmText="Unpublish"
                variant="danger"
                loading={actionLoading}
            />

            <ConfirmDialog
                open={activateSnapshotId !== null}
                onClose={() => setActivateSnapshotId(null)}
                onConfirm={handleActivateSnapshot}
                title="Activate Snapshot"
                description="This will set this version as the active published version. The current active version will be archived."
                confirmText="Activate"
                variant="warning"
                loading={actionLoading}
            />

            <ConfirmDialog
                open={deleteSnapshotId !== null}
                onClose={() => setDeleteSnapshotId(null)}
                onConfirm={handleDeleteSnapshot}
                title="Delete Snapshot"
                description="This snapshot will be permanently deleted. This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
