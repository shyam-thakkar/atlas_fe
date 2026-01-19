'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { adminApi } from '@/lib/admin-api';
import type { AdminChatSession, PaginatedResponse } from '@/types/admin';
import { Eye, XCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ChatSessionsPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<PaginatedResponse<AdminChatSession>>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<boolean | ''>('');
    const pageSize = 20;

    const [terminateConfirmOpen, setTerminateConfirmOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<AdminChatSession | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadSessions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.getChatSessions({
                page,
                page_size: pageSize,
                is_active: activeFilter === '' ? undefined : activeFilter,
            });
            setSessions(data);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        } finally {
            setLoading(false);
        }
    }, [page, activeFilter]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const handleTerminate = async () => {
        if (!selectedSession) return;
        try {
            setActionLoading(true);
            await adminApi.terminateChatSession(selectedSession.id);
            await loadSessions();
            setTerminateConfirmOpen(false);
        } catch (err) {
            console.error('Failed to terminate session:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        {
            key: 'user_email',
            header: 'User',
            render: (session: AdminChatSession) => (
                <span className="text-zinc-200">{session.user_email}</span>
            ),
        },
        {
            key: 'session_id',
            header: 'Session ID',
            render: (session: AdminChatSession) => (
                <span className="text-zinc-500 font-mono text-xs">{session.session_id.slice(0, 8)}...</span>
            ),
        },
        {
            key: 'messages_count',
            header: 'Messages',
            render: (session: AdminChatSession) => (
                <span className="text-zinc-300">{session.messages_count}</span>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            render: (session: AdminChatSession) => (
                session.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-700 text-zinc-400">
                        Ended
                    </span>
                )
            ),
        },
        {
            key: 'last_activity',
            header: 'Last Activity',
            render: (session: AdminChatSession) => (
                <span className="text-zinc-500 text-xs">
                    {new Date(session.last_activity).toLocaleString()}
                </span>
            ),
        },
        {
            key: 'ip_address',
            header: 'IP',
            render: (session: AdminChatSession) => (
                <span className="text-zinc-500 text-xs">{session.ip_address || '-'}</span>
            ),
        },
    ];

    const filters = (
        <select
            value={activeFilter === '' ? '' : activeFilter ? 'true' : 'false'}
            onChange={(e) => {
                setActiveFilter(e.target.value === '' ? '' : e.target.value === 'true');
                setPage(1);
            }}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
        >
            <option value="">All Sessions</option>
            <option value="true">Active</option>
            <option value="false">Ended</option>
        </select>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Chat Sessions</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Monitor and manage RAG chat sessions
                    </p>
                </div>
                <Link
                    href="/admin/chat/rag"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
                >
                    <MessageSquare className="w-4 h-4" />
                    RAG Documents
                </Link>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={sessions.results}
                loading={loading}
                totalCount={sessions.count}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                emptyMessage="No chat sessions found"
                getRowKey={(session) => session.id}
                onRowClick={(session) => router.push(`/admin/chat/${session.id}`)}
                filters={filters}
                actions={(session) => (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/chat/${session.id}`);
                            }}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                            title="View messages"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        {session.is_active && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSession(session);
                                    setTerminateConfirmOpen(true);
                                }}
                                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                title="Terminate"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </>
                )}
            />

            {/* Terminate Confirm */}
            <ConfirmDialog
                open={terminateConfirmOpen}
                onClose={() => setTerminateConfirmOpen(false)}
                onConfirm={handleTerminate}
                title="Terminate Session"
                description="This will end the chat session. The user will need to start a new session to continue chatting."
                confirmText="Terminate"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
