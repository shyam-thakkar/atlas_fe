'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { adminAuth } from '@/lib/admin-auth';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import type { AdminPortfolioDetail } from '@/types/admin';
import type { StructuredPortfolio } from '@/types/portfolio';
import { Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';

// Transform admin portfolio data to StructuredPortfolio format
function transformToStructuredPortfolio(data: AdminPortfolioDetail): StructuredPortfolio {
    // Create tech lookup map
    const techMap = new Map<number, string>();
    data.tech_stack.forEach(t => {
        techMap.set(t.tech, t.tech_name || `Tech ${t.tech}`);
    });

    // Map socials to object
    const socialLinks: Record<string, string> = {};
    data.socials.forEach(s => {
        const platform = s.platform_name?.toLowerCase() || `platform_${s.social_platform}`;
        socialLinks[platform] = s.url;
    });

    return {
        hero: {
            full_name: data.profile?.name || data.title || 'Portfolio',
            headline: data.profile?.headline || '',
            short_bio: data.profile?.short_bio || '',
            profile_image: data.profile?.image,
        },
        socials: socialLinks,
        tech_stack: data.tech_stack.map(t => t.tech_name || `Tech ${t.tech}`),
        experience: (data.experiences || []).map(exp => ({
            role: exp.role,
            company_name: exp.company_name,
            start_date: exp.start_date,
            end_date: exp.end_date,
            is_current: exp.is_current,
            description: exp.description,
            // Admin API doesn't return logo_url or technologies for experience yet
            logo_url: undefined,
            technologies: [],
        })),
        projects: (data.projects || []).map(proj => ({
            title: proj.title,
            description: proj.description,
            technologies: (proj.tech_used || []).map(id => techMap.get(id) || `Tech #${id}`),
            repo_url: proj.repo_url || undefined,
            live_url: proj.live_url || undefined,
            key_features: proj.key_features || [],
            technical_challenges: proj.technical_challenges || [],
            year: proj.year,
            project_type: proj.project_type,
            thumbnail_url: null, // Admin API doesn't strictly have this field matching
        })),
        education: (data.education || []).map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            field_of_study: edu.field_of_study,
            start_date: edu.start_date,
            end_date: edu.end_date,
            grade: edu.grade || undefined,
            grade_type: edu.grade_type || undefined,
        })),
        about: {
            long_bio: data.profile?.long_bio || '',
            hobbies: [],
        },
    };
}

export default function AdminPortfolioPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const portfolioId = Number(params.id);

    const [portfolio, setPortfolio] = useState<StructuredPortfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        checkAuthAndLoad();
    }, [portfolioId]);

    const checkAuthAndLoad = async () => {
        try {
            // Verify admin access
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.replace('/admin/login');
                return;
            }

            const user = await adminAuth.getCurrentUser();
            if (!user?.is_staff) {
                router.replace('/admin/login');
                return;
            }
            setIsAuthorized(true);

            // Load portfolio data
            setLoading(true);
            const data = await adminApi.getPortfolio(portfolioId);
            const transformed = transformToStructuredPortfolio(data);
            setPortfolio(transformed);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load portfolio');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthorized || loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                    <p className="text-sm text-zinc-500">Loading preview...</p>
                </div>
            </div>
        );
    }

    if (error || !portfolio) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 mb-4">{error || 'Portfolio not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Admin Preview Banner */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-sm px-4 py-2">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-900" />
                        <span className="text-sm font-medium text-amber-900">
                            Admin Preview Mode - This portfolio may not be published
                        </span>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 text-white rounded text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Admin
                    </button>
                </div>
            </div>

            {/* Portfolio Preview with top padding for banner */}
            <div className="pt-10">
                <PortfolioPreview data={portfolio} />
            </div>
        </div>
    );
}
