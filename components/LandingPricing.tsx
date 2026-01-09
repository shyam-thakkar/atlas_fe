'use client';

import React from 'react';
import { Check, Zap, Rocket, Star } from 'lucide-react';

const tiers = [
    {
        name: "Free",
        price: "0",
        period: "/forever",
        description: "Perfect for getting started and exploring the platform.",
        features: [
            "1 AI Portfolio Generation",
            "Basic Template Access",
            "Community Support",
            "AIFolio Branding"
        ],
        cta: "Get Started Free",
        highlight: false
    },
    {
        name: "Pro",
        price: "149",
        period: "/month",
        description: "For professionals who want to stand out and land their dream job.",
        features: [
            "Unlimited AI Generations",
            "All Premium Templates",
            "Custom Domain Support",
            "Advanced SEO Tools",
            "No AIFolio Branding",
            "Priority Support"
        ],
        cta: "Upgrade to Pro",
        highlight: true
    },
    {
        name: "Lifetime",
        price: "499",
        period: "one-time",
        description: "Pay once, own forever. Best value for serious professionals.",
        features: [
            "Everything in Pro",
            "Lifetime Access",
            "All Future Updates",
            "Early Access to Features",
            "Exclusive Templates",
            "1-on-1 Setup Support"
        ],
        cta: "Get Lifetime Access",
        highlight: false
    }
];

export function LandingPricing() {
    return (
        <section id="pricing" className="py-12 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <h2 className="text-sm font-bold text-violet-600 dark:text-violet-400 tracking-[0.2em] uppercase">
                        Pricing Plans
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Simple, transparent <span className="text-violet-600 dark:text-violet-400">pricing</span>.
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-zinc-400">
                        Choose the plan that fits your career goals. All plans include our core AI engine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`relative p-8 rounded-[2.5rem] border transition-all duration-300 ${tier.highlight
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-2xl scale-105 z-10'
                                : 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border-gray-100 dark:border-zinc-800 hover:border-violet-500/30'
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                    <Star className="w-3 h-3 fill-white" />
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-lg font-bold mb-2 uppercase tracking-wide opacity-80">{tier.name}</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-extrabold tracking-tight">₹{tier.price}</span>
                                    <span className="text-sm font-medium opacity-60">{tier.period}</span>
                                </div>
                                <p className="mt-4 text-sm opacity-70 leading-relaxed italic">{tier.description}</p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {tier.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-sm font-medium">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${tier.highlight ? 'bg-violet-500/20 text-violet-400 dark:bg-violet-600 dark:text-white' : 'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="opacity-90">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${tier.highlight
                                ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-xl shadow-violet-500/30'
                                : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white'
                                }`}>
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
