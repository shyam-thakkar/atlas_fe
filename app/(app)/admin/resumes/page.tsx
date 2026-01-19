'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, FormTextarea } from '@/components/admin/FormModal';
import { adminApi } from '@/lib/admin-api';
import type { AdminResume, PaginatedResponse } from '@/types/admin';
import { Eye, Edit, Download, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

export default function ResumesPage() {
    const [resumes, setResumes] = useState<PaginatedResponse<AdminResume>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<AdminResume | null>(null);
    const [editText, setEditText] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const loadResumes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getResumes({
                page,
                page_size: pageSize,
            });
            setResumes(data);
        } catch (err) {
            console.error('Failed to load resumes:', err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadResumes();
    }, [loadResumes]);

    const handleEditSubmit = async () => {
        if (!selectedResume) return;
        try {
            setActionLoading(true);
            await adminApi.updateResume(selectedResume.id, { extracted_text: editText });
            await loadResumes();
            setEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update resume:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config = {
            pending: { icon: Clock, bg: 'bg-amber-500/20', text: 'text-amber-400' },
            processing: { icon: Loader2, bg: 'bg-blue-500/20', text: 'text-blue-400', spin: true },
            completed: { icon: CheckCircle, bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
            failed: { icon: XCircle, bg: 'bg-red-500/20', text: 'text-red-400' },
        };
        const conf = config[status as keyof typeof config] || config.pending;
        const Icon = conf.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${conf.bg} ${conf.text}`}>
                <Icon className={`w-3 h-3 ${'spin' in conf && conf.spin ? 'animate-spin' : ''}`} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const columns = [
        {
            key: 'user_email',
            header: 'User',
            render: (resume: AdminResume) => (
                <span className="text-zinc-200">{resume.user_email}</span>
            ),
        },
        {
            key: 'original_filename',
            header: 'Filename',
            render: (resume: AdminResume) => (
                <span className="text-zinc-300 text-sm">{resume.original_filename}</span>
            ),
        },
        {
            key: 'processing_status',
            header: 'Status',
            render: (resume: AdminResume) => getStatusBadge(resume.processing_status?.status || 'pending'),
        },
        {
            key: 'uploaded_at',
            header: 'Uploaded',
            render: (resume: AdminResume) => (
                <span className="text-zinc-500 text-xs">
                    {new Date(resume.uploaded_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            key: 'extracted_text',
            header: 'Extracted',
            render: (resume: AdminResume) => (
                <span className="text-zinc-500 text-xs">
                    {resume.extracted_text ? `${resume.extracted_text.length} chars` : '-'}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Resumes</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    View and manage uploaded resumes
                </p>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={resumes.results}
                loading={loading}
                totalCount={resumes.count}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                emptyMessage="No resumes found"
                getRowKey={(resume) => resume.id}
                actions={(resume) => (
                    <>
                        <button
                            onClick={() => {
                                setSelectedResume(resume);
                                setViewModalOpen(true);
                            }}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="View extracted text"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedResume(resume);
                                setEditText(resume.extracted_text);
                                setEditModalOpen(true);
                            }}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="Edit extracted text"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {resume.file && (
                            <a
                                href={resume.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                title="Download file"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        )}
                    </>
                )}
            />

            {/* View Modal */}
            <FormModal
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                title="Extracted Text"
                size="xl"
            >
                {selectedResume && (
                    <div className="bg-zinc-800 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                        <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                            {selectedResume.extracted_text || 'No text extracted'}
                        </pre>
                    </div>
                )}
            </FormModal>

            {/* Edit Modal */}
            <FormModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Extracted Text"
                onSubmit={handleEditSubmit}
                loading={actionLoading}
                size="xl"
            >
                <FormTextarea
                    label="Extracted Text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={20}
                    className="font-mono text-xs"
                />
            </FormModal>
        </div>
    );
}
