'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800/50 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/logo.png"
                                alt="AIFolio Logo"
                                width={32}
                                height={32}
                                className="group-hover:scale-110 transition-transform"
                            />
                            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                AIFolio
                            </span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed max-w-xs">
                            The AI-powered portfolio builder that turns your experience into opportunities.
                            Build your professional presence in seconds.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="https://x.com/YOUR_X_USERNAME" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="https://github.com/shyam-thakkar" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/shyam-thakkar167/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Templates</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Showcase</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-gray-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-400">
                                <Mail className="w-4 h-4 text-violet-600" />
                                shyam@aifolio.in
                            </li>
                            <li className="pt-2">
                                <div className="p-4 rounded-2xl bg-violet-600/5 dark:bg-violet-500/5 border border-violet-600/10 dark:border-violet-500/10">
                                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-widest mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-medium text-gray-900 dark:text-white">All systems operational</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-100 dark:border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-widest">
                        © 2025 AIFolio - AI Portfolio Builder. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-zinc-500">
                        <Link href="#" className="hover:text-violet-600 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-violet-600 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-violet-600 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
