'use client';

import React from 'react';
import Link from 'next/link';
import {
    Code2,
    Share2,
    Building2,
    AtSign,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react';

const registries = [
    {
        name: 'Tech Registry',
        description: 'Manage technology stack items (languages, frameworks, tools)',
        href: '/admin/registries/tech',
        icon: Code2,
        color: 'violet',
    },
    {
        name: 'Social Platforms',
        description: 'Manage social media platforms (GitHub, LinkedIn, etc.)',
        href: '/admin/registries/social',
        icon: Share2,
        color: 'blue',
    },
    {
        name: 'Companies',
        description: 'Manage company registry for experience entries',
        href: '/admin/registries/company',
        icon: Building2,
        color: 'emerald',
    },
    {
        name: 'Usernames',
        description: 'View and manage assigned portfolio usernames',
        href: '/admin/registries/usernames',
        icon: AtSign,
        color: 'amber',
    },
    {
        name: 'Reserved Usernames',
        description: 'Manage reserved/blocked usernames',
        href: '/admin/registries/reserved',
        icon: ShieldCheck,
        color: 'red',
    },
];

const colorClasses = {
    violet: { bg: 'bg-violet-500/10', icon: 'bg-violet-500/20 text-violet-400', border: 'hover:border-violet-500/50' },
    blue: { bg: 'bg-blue-500/10', icon: 'bg-blue-500/20 text-blue-400', border: 'hover:border-blue-500/50' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'bg-emerald-500/20 text-emerald-400', border: 'hover:border-emerald-500/50' },
    amber: { bg: 'bg-amber-500/10', icon: 'bg-amber-500/20 text-amber-400', border: 'hover:border-amber-500/50' },
    red: { bg: 'bg-red-500/10', icon: 'bg-red-500/20 text-red-400', border: 'hover:border-red-500/50' },
};

export default function RegistriesPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Registries</h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Manage platform registries and system data
                </p>
            </div>

            {/* Registry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registries.map((registry) => {
                    const colors = colorClasses[registry.color as keyof typeof colorClasses];
                    const Icon = registry.icon;
                    return (
                        <Link
                            key={registry.name}
                            href={registry.href}
                            className={`${colors.bg} border border-zinc-800 ${colors.border} rounded-xl p-5 transition-all group`}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-lg ${colors.icon}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mt-4">{registry.name}</h3>
                            <p className="text-sm text-zinc-500 mt-1">{registry.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
