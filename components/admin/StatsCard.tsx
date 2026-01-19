'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
    default: {
        bg: 'bg-zinc-900',
        iconBg: 'bg-zinc-800',
        iconColor: 'text-zinc-400',
        accent: 'text-zinc-400',
    },
    primary: {
        bg: 'bg-violet-500/10',
        iconBg: 'bg-violet-500/20',
        iconColor: 'text-violet-400',
        accent: 'text-violet-400',
    },
    success: {
        bg: 'bg-emerald-500/10',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
        accent: 'text-emerald-400',
    },
    warning: {
        bg: 'bg-amber-500/10',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        accent: 'text-amber-400',
    },
    danger: {
        bg: 'bg-red-500/10',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        accent: 'text-red-400',
    },
};

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
}: StatsCardProps) {
    const styles = variantStyles[variant];

    return (
        <div className={`${styles.bg} rounded-xl border border-zinc-800 p-5 transition-all hover:border-zinc-700`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-zinc-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                    {subtitle && (
                        <p className={`text-sm ${styles.accent} mt-1`}>{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <span
                                className={`text-xs font-medium ${trend.positive ? 'text-emerald-400' : 'text-red-400'
                                    }`}
                            >
                                {trend.positive ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-xs text-zinc-500">{trend.label}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`${styles.iconBg} p-3 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                    </div>
                )}
            </div>
        </div>
    );
}
