'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function LandingPortfolioPreview() {
    return (
        <div className="pb-12 bg-white dark:bg-zinc-950 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[10%] w-[25%] h-[25%] rounded-full bg-violet-600/10 blur-[80px] animate-pulse [animation-delay:1s]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        See What You&apos;ll <span className="italic">Build</span>
                    </h2>
                    <p className="text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
                        Your portfolio will look this polished. Try the theme toggle inside!
                    </p>
                </div>

                {/* Portfolio Preview Mockup with iframe */}
                <div className="relative mx-auto max-w-5xl group">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

                    {/* Browser Frame */}
                    <div className="relative rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl overflow-hidden">
                        {/* Browser Chrome */}
                        <div className="rounded-[1.25rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
                            {/* Browser Header */}
                            <div className="h-10 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                </div>
                                <div className="ml-4 flex-1 max-w-md mx-auto">
                                    <div className="h-6 px-4 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center">
                                        <span className="text-xs text-gray-500 dark:text-zinc-500 font-mono">
                                            alexjohnson.portfolio.dev
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Portfolio Content via iframe */}
                            <iframe
                                src="/landing-preview"
                                className="w-full h-[500px] md:h-[600px] border-0"
                                title="Portfolio Preview"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Create Your Portfolio
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="mt-4 text-sm text-gray-500 dark:text-zinc-500">
                        Free to start • No credit card required
                    </p>
                </div>
            </div>
        </div>
    );
}


