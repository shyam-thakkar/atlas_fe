'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function LandingNavbar() {
    const { isAuthenticated } = useAuth();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800/50 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="AIFolio Logo"
                            width={40}
                            height={40}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            AIFolio
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            How it Works
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                            Pricing
                        </Link>

                        <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800" />

                        {/* Theme Toggle Button */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 transition-all hover:scale-105"
                                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        {isAuthenticated ? (
                            <Link
                                href="/dashboard"
                                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all hover:translate-y-[-1px]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all hover:translate-y-[-1px]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top duration-300">
                    <div className="px-4 py-6 space-y-4">
                        <Link href="#features" className="block text-base font-medium text-gray-600 dark:text-zinc-400">Features</Link>
                        <Link href="#how-it-works" className="block text-base font-medium text-gray-600 dark:text-zinc-400">How it Works</Link>
                        <Link href="#pricing" className="block text-base font-medium text-gray-600 dark:text-zinc-400">Pricing</Link>
                        <hr className="border-gray-100 dark:border-zinc-800" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">Appearance</span>
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400"
                            >
                                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                        {isAuthenticated ? (
                            <Link href="/dashboard" className="block w-full py-3 rounded-xl bg-violet-600 text-white text-center font-semibold shadow-lg shadow-violet-500/20">Dashboard</Link>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/login" className="py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white text-center font-medium">Login</Link>
                                <Link href="/signup" className="py-3 rounded-xl bg-violet-600 text-white text-center font-semibold shadow-lg shadow-violet-500/20">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
