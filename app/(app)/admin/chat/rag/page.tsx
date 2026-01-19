'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, FormInput, FormTextarea, FormSelect } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { AdminRAGDocument, PaginatedResponse } from '@/types/admin';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function RAGDocumentsPage() {
    const router = useRouter();
    const [documents, setDocuments] = useState<PaginatedResponse<AdminRAGDocument>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sectionFilter, setSectionFilter] = useState('');
    const pageSize = 20;

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<AdminRAGDocument | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        text: '',
        section: '',
    });

    const loadDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getRAGDocuments({
                page,
                page_size: pageSize,
                section: sectionFilter || undefined,
            });
            setDocuments(data);
        } catch (err) {
            console.error('Failed to load RAG documents:', err);
        } finally {
            setLoading(false);
        }
    }, [page, sectionFilter]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    const openEditModal = (doc: AdminRAGDocument) => {
        setSelectedDoc(doc);
        setEditForm({
            text: doc.text,
            section: doc.section,
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!selectedDoc) return;
        try {
            setActionLoading(true);
            await adminApi.updateRAGDocument(selectedDoc.id, editForm);
            await loadDocuments();
            setEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update document:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedDoc) return;
        try {
            setActionLoading(true);
            await adminApi.deleteRAGDocument(selectedDoc.id);
            await loadDocuments();
            setDeleteConfirmOpen(false);
        } catch (err) {
            console.error('Failed to delete document:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            key: 'user_email',
            header: 'User',
            render: (doc: AdminRAGDocument) => (
                <span className="text-zinc-200">{doc.user_email}</span>
            ),
        },
        {
            key: 'title',
            header: 'Title',
            render: (doc: AdminRAGDocument) => (
                <span className="text-zinc-300 font-medium">{doc.title}</span>
            ),
        },
        {
            key: 'section',
            header: 'Section',
            render: (doc: AdminRAGDocument) => (
                <span className="text-violet-400 text-xs">{doc.section}</span>
            ),
        },
        {
            key: 'source',
            header: 'Source',
            render: (doc: AdminRAGDocument) => (
                <span className="text-zinc-500 text-xs">{doc.source}</span>
            ),
        },
        {
            key: 'text',
            header: 'Preview',
            render: (doc: AdminRAGDocument) => (
                <span className="text-zinc-400 text-xs truncate max-w-[200px] block">
                    {doc.text.slice(0, 100)}...
                </span>
            ),
        },
    ];

    const filters = (
        <select
            value={sectionFilter}
            onChange={(e) => {
                setSectionFilter(e.target.value);
                setPage(1);
            }}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
        >
            <option value="">All Sections</option>
            <option value="bio">Bio</option>
            <option value="experience">Experience</option>
            <option value="projects">Projects</option>
            <option value="education">Education</option>
            <option value="skills">Skills</option>
        </select>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/admin/chat')}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">RAG Documents</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Manage embedded documents for chat context
                    </p>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={documents.results}
                loading={loading}
                totalCount={documents.count}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                emptyMessage="No RAG documents found"
                getRowKey={(doc) => doc.id}
                filters={filters}
                actions={(doc) => (
                    <>
                        <button
                            onClick={() => openEditModal(doc)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedDoc(doc);
                                setDeleteConfirmOpen(true);
                            }}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            />

            {/* Edit Modal */}
            <FormModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit RAG Document"
                onSubmit={handleEditSubmit}
                loading={actionLoading}
                size="lg"
            >
                {selectedDoc && (
                    <>
                        <div className="bg-zinc-800 rounded-lg p-3 mb-4">
                            <p className="text-xs text-zinc-500 mb-1">Title</p>
                            <p className="text-sm text-zinc-200">{selectedDoc.title}</p>
                        </div>
                        <FormSelect
                            label="Section"
                            value={editForm.section}
                            onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                            options={[
                                { value: 'bio', label: 'Bio' },
                                { value: 'experience', label: 'Experience' },
                                { value: 'projects', label: 'Projects' },
                                { value: 'education', label: 'Education' },
                                { value: 'skills', label: 'Skills' },
                            ]}
                        />
                        <FormTextarea
                            label="Text Content"
                            value={editForm.text}
                            onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                            rows={10}
                        />
                    </>
                )}
            </FormModal>

            {/* Delete Confirm */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete RAG Document"
                description={`Are you sure you want to delete "${selectedDoc?.title}"? This will affect the chat context for this user.`}
                confirmText="Delete"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
