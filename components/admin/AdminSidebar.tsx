'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Briefcase,
    Database,
    MessageSquare,
    FileText,
    ChevronDown,
    ChevronRight,
    LogOut,
    Sun,
    Moon,
    Menu,
    Building2,
    Code2,
    Share2,
    AtSign,
    ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    children?: { name: string; href: string; icon: React.ReactNode }[];
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['Registries']);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const toggleMenu = (name: string) => {
        setExpandedMenus((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    const navigation: NavItem[] = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: <Users className="w-5 h-5" />,
        },
        {
            name: 'Payments',
            href: '/admin/payments',
            icon: <CreditCard className="w-5 h-5" />,
        },
        {
            name: 'Portfolios',
            href: '/admin/portfolios',
            icon: <Briefcase className="w-5 h-5" />,
        },
        {
            name: 'Registries',
            href: '/admin/registries',
            icon: <Database className="w-5 h-5" />,
            children: [
                { name: 'Tech Stack', href: '/admin/registries/tech', icon: <Code2 className="w-4 h-4" /> },
                { name: 'Socials', href: '/admin/registries/social', icon: <Share2 className="w-4 h-4" /> },
                { name: 'Companies', href: '/admin/registries/company', icon: <Building2 className="w-4 h-4" /> },
                { name: 'Usernames', href: '/admin/registries/usernames', icon: <AtSign className="w-4 h-4" /> },
                { name: 'Reserved', href: '/admin/registries/reserved', icon: <ShieldCheck className="w-4 h-4" /> },
            ],
        },
        {
            name: 'Chat & RAG',
            href: '/admin/chat',
            icon: <MessageSquare className="w-5 h-5" />,
        },
        {
            name: 'Resumes',
            href: '/admin/resumes',
            icon: <FileText className="w-5 h-5" />,
        },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 transition-all duration-300">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors flex-shrink-0"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-5 h-5 text-zinc-400" />
                        </button>
                    )}
                    <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                        <Image
                            src="/logo.png"
                            alt="AIFolio"
                            width={28}
                            height={28}
                            className="flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white tracking-tight whitespace-nowrap">
                                AIFolio
                            </span>
                            <span className="text-[10px] text-violet-400 font-medium -mt-0.5">
                                Admin Panel
                            </span>
                        </div>
                    </div>
                </div>

                {mounted && !collapsed && (
                    <button
                        onClick={handleThemeToggle}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                        aria-label="Toggle theme"
                    >
                        {resolvedTheme === 'dark' ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedMenus.includes(item.name);

                        return (
                            <div key={item.name}>
                                {hasChildren ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={`
                        w-full flex items-center h-10 gap-3 px-3 text-sm rounded-lg transition-all duration-200
                        ${active
                                                    ? 'bg-violet-500/10 text-violet-400'
                                                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                                                }
                      `}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-violet-500/20 text-violet-400' : 'text-zinc-500'}`}>
                                                {item.icon}
                                            </div>
                                            <span className={`flex-1 text-left overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                                                {item.name}
                                            </span>
                                            {!collapsed && (
                                                isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                                            )}
                                        </button>
                                        {!collapsed && isExpanded && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {item.children?.map((child) => {
                                                    const childActive = pathname === child.href;
                                                    return (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className={`
                                flex items-center h-9 gap-3 px-3 text-sm rounded-lg transition-all duration-200
                                ${childActive
                                                                    ? 'bg-violet-500/10 text-violet-400'
                                                                    : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                                                                }
                              `}
                                                        >
                                                            <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${childActive ? 'text-violet-400' : 'text-zinc-600'}`}>
                                                                {child.icon}
                                                            </div>
                                                            <span className="whitespace-nowrap">{child.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`
                      flex items-center h-10 gap-3 px-3 text-sm rounded-lg transition-all duration-200
                      ${active
                                                ? 'bg-violet-500/10 text-violet-400'
                                                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                                            }
                    `}
                                        title={item.name}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-violet-500/20 text-violet-400' : 'text-zinc-500'}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-zinc-800">
                <button
                    onClick={handleLogout}
                    className="w-full h-9 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Sign out"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
                        Sign out
                    </span>
                </button>
            </div>
        </div>
    );
}
