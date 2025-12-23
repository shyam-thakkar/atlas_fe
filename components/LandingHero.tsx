'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Shield, Wand2 } from 'lucide-react';

export function LandingHero() {
    return (
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-12 overflow-hidden bg-white dark:bg-zinc-950">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse [animation-delay:2s]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-semibold tracking-wide uppercase animate-fade-in">
                        <Sparkles className="w-3 h-3" />
                        AI-Powered Portfolio Builder
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Turn your resume into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">stunning portfolio</span> in seconds.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        AIFolio uses advanced AI to analyze your experience and generate a premium,
                        responsive portfolio that lands you the job you deserve.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Build My Portfolio
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#features"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            See Features
                        </Link>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-12 grayscale opacity-60 dark:opacity-40">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Rapid Analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Secure Hosting</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wand2 className="w-5 h-5" />
                            <span className="text-sm font-semibold tracking-wide uppercase">AI Generation</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
