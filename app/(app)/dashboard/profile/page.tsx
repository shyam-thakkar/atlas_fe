'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfileDetailsPage() {
    const { user } = useAuth();

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="w-full h-full p-8 lg:p-12 animate-in fade-in duration-500 overflow-y-auto bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <header>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Account Settings
                    </h1>
                    <p className="mt-2 text-base text-gray-500 dark:text-zinc-400 max-w-xl">
                        Manage your personal information and account preferences.
                    </p>
                </header>

                {/* Profile Card */}
                <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 rounded-2xl border border-gray-200 dark:border-zinc-800/50 shadow-sm dark:shadow-2xl">
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 dark:opacity-100" />

                    {/* Header / Avatar */}
                    <div className="px-8 py-8 border-b border-gray-100 dark:border-zinc-800/50 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-800/30 dark:to-zinc-900 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative">
                            {user?.profile_image ? (
                                <img
                                    key={user.profile_image}
                                    src={user.profile_image}
                                    alt={user?.name || "Profile"}
                                    className="h-24 w-24 rounded-2xl object-cover shadow-lg border-4 border-white dark:border-zinc-800"
                                />
                            ) : (
                                <span className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
                                    <span className="text-2xl font-bold leading-none text-white tracking-wider">
                                        {getInitials(user?.name)}
                                    </span>
                                </span>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white dark:border-zinc-900 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center sm:text-left flex-1 min-w-0 pt-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user?.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{user?.email}</p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                                <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-700/10 dark:ring-violet-500/20">
                                    Member
                                </span>
                                <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20">
                                    Early Access
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="px-8 py-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 block">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        readOnly
                                        disabled
                                        className="block w-full rounded-lg border-0 bg-gray-50 dark:bg-zinc-800/50 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-zinc-700/50 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm cursor-not-allowed"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-zinc-500">Your public display name.</p>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        disabled
                                        className="block w-full rounded-lg border-0 bg-gray-50 dark:bg-zinc-800/50 py-3 pl-11 pr-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-zinc-700/50 focus:ring-2 focus:ring-inset focus:ring-violet-500 sm:text-sm cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-zinc-500">Used for login and notifications.</p>
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="border-t border-gray-100 dark:border-zinc-800/50 pt-8">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Account Information</h3>
                            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-xl">
                                    <dt className="text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Authentication Method</dt>
                                    <dd className="mt-2 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                        <div className="p-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm">
                                            <svg className="w-4 h-4 text-gray-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                        Email / Password
                                    </dd>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-xl">
                                    <dt className="text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">Plan Status</dt>
                                    <dd className="mt-2 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
                                            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        Free Tier
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="bg-gray-50 dark:bg-zinc-800/30 px-8 py-5 border-t border-gray-100 dark:border-zinc-800/50 flex items-center justify-end">
                        <button
                            type="button"
                            disabled
                            className="group relative rounded-lg bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-400 dark:text-zinc-500 shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-zinc-700 cursor-not-allowed flex items-center gap-2"
                        >
                            Edit Profile
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-violet-100 dark:bg-violet-500/10 rounded-full text-violet-600 dark:text-violet-400">Soon</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

