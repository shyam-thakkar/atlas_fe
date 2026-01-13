'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-zinc-950 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Welcome Card */}
                <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 rounded-2xl border border-gray-200 dark:border-zinc-800/50 p-8 shadow-sm dark:shadow-2xl">
                    {/* Gradient accent in dark mode */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 dark:opacity-100" />

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, <span className="text-violet-600 dark:text-violet-400">{user?.name || 'User'}</span>!
                    </h1>
                    <p className="mt-3 text-gray-600 dark:text-zinc-400 max-w-lg">
                        This is your AIFolio dashboard. Build your AI-powered portfolio by uploading your resume and customizing your profile.
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Resume Card */}
                    <Link
                        href="/dashboard/resume"
                        className="group relative overflow-hidden p-6 bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/50 rounded-2xl hover:border-violet-500/50 dark:hover:border-violet-500/30 hover:shadow-lg dark:hover:shadow-violet-500/5 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-500 dark:group-hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Resume</h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Upload your resume to generate AI-powered portfolio content.</p>
                            <div className="mt-4 flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform duration-300">
                                Get started
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Editor Card */}
                    <Link
                        href="/dashboard/editor"
                        className="group relative overflow-hidden p-6 bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/50 rounded-2xl hover:border-purple-500/50 dark:hover:border-purple-500/30 hover:shadow-lg dark:hover:shadow-purple-500/5 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500 dark:group-hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Editor</h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Edit and preview your portfolio in real-time.</p>
                            <div className="mt-4 flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform duration-300">
                                Open Editor
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* AI Chat Card */}
                    <Link
                        href="/dashboard/chat"
                        className="group relative overflow-hidden p-6 bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/50 rounded-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/30 hover:shadow-lg dark:hover:shadow-emerald-500/5 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Test your portfolio chatbot and update its knowledge.</p>
                            <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-300">
                                Start Chat
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Profile Card */}
                    <Link
                        href="/dashboard/profile"
                        className="group relative overflow-hidden p-6 bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800/50 rounded-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/30 hover:shadow-lg dark:hover:shadow-indigo-500/5 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:text-white transition-colors duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Profile</h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your account settings and personal information.</p>
                            <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
                                View details
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

