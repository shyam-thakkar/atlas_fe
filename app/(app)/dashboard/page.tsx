'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user?.name || 'User'}!</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    This is your Atlas dashboard. Navigate using the sidebar to manage your profile and resume.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/resume" className="block p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Resume</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Upload, view, and analyze your resume.</p>
                    </Link>

                    <Link href="/dashboard/profile" className="block p-6 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-md group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">View Profile</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Check your account details and settings.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
