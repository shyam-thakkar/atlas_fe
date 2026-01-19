'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { AdminChatSessionDetail } from '@/types/admin';
import { ArrowLeft, User, Bot, XCircle, Loader2 } from 'lucide-react';

export default function ChatSessionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = Number(params.id);

    const [session, setSession] = useState<AdminChatSessionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [terminateConfirmOpen, setTerminateConfirmOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadSession();
    }, [sessionId]);

    const loadSession = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getChatSession(sessionId);
            setSession(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load session');
        } finally {
            setLoading(false);
        }
    };

    const handleTerminate = async () => {
        try {
            setActionLoading(true);
            await adminApi.terminateChatSession(sessionId);
            await loadSession();
            setTerminateConfirmOpen(false);
        } catch (err) {
            console.error('Failed to terminate session:', err);
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

    if (error || !session) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Session not found'}</p>
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
                    <h1 className="text-2xl font-bold text-white">Chat Session</h1>
                    <p className="text-zinc-500 text-sm">{session.user_email}</p>
                </div>
                <div className="flex items-center gap-2">
                    {session.is_active ? (
                        <>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                            </span>
                            <button
                                onClick={() => setTerminateConfirmOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                Terminate
                            </button>
                        </>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-zinc-700 text-zinc-400">
                            Ended
                        </span>
                    )}
                </div>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 mb-1">Session ID</p>
                    <p className="text-sm text-zinc-200 font-mono truncate">{session.session_id}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 mb-1">Messages</p>
                    <p className="text-sm text-zinc-200">{session.messages_count}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 mb-1">Started</p>
                    <p className="text-sm text-zinc-200">{new Date(session.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <p className="text-xs text-zinc-500 mb-1">Last Activity</p>
                    <p className="text-sm text-zinc-200">{new Date(session.last_activity).toLocaleString()}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="px-5 py-4 border-b border-zinc-800">
                    <h3 className="text-lg font-medium text-white">Messages</h3>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    {session.messages && session.messages.length > 0 ? (
                        session.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? '' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                        ? 'bg-violet-500/20 text-violet-400'
                                        : 'bg-zinc-800 text-zinc-400'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-zinc-400">
                                            {msg.role === 'user' ? 'User' : 'Assistant'}
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            {new Date(msg.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-300 whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-zinc-500 text-center py-8">No messages in this session</p>
                    )}
                </div>
            </div>

            {/* Terminate Confirm */}
            <ConfirmDialog
                open={terminateConfirmOpen}
                onClose={() => setTerminateConfirmOpen(false)}
                onConfirm={handleTerminate}
                title="Terminate Session"
                description="This will end the chat session immediately."
                confirmText="Terminate"
                variant="danger"
                loading={actionLoading}
            />
        </div>
    );
}
