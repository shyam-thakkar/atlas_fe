"use client";

import { useMemo } from "react";
import { Calendar, Briefcase, Building2 } from "lucide-react";
import { ExperienceItem } from "../../../../../types/portfolio";

// Base API URL for media files
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to construct proper media URL
function getMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${BASE_API_URL}${url}`;
  return `${BASE_API_URL}/${url}`;
}

// Constants
const TIMELINE_STYLES = {
  dot: "absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white dark:bg-zinc-950 border-4 border-zinc-400 dark:border-zinc-600",
  line: "relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 md:ml-6 space-y-12",
  bullet: "mt-2 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0",
} as const;

interface ExperienceProps {
  data: ExperienceItem[];
}

export function Experience({ data }: ExperienceProps) {
  // Memoize experiences to prevent recreation on every render
  const experiences = useMemo(() => {
    return data || [];
  }, [data]);

  if (!experiences || experiences.length === 0) {
    return (
      <section className="py-2">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-8 flex items-center gap-3">
          <Briefcase className="w-8 h-8" aria-hidden="true" />
          Experience
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">No experience added yet.</p>
      </section>
    );
  }

  return (
    <section className="py-2">
      <h2 className="text-3xl font-bold text-black dark:text-white mb-8 flex items-center gap-3">
        <Briefcase className="w-8 h-8" aria-hidden="true" />
        Experience
      </h2>
      <div className={TIMELINE_STYLES.line}>
        {experiences.map((job, index) => {
          // Convert summary to bullet points
          const descriptionPoints = job.description
            ? job.description
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .map(line => line.replace(/^[-•*]\s*/, '')) // Remove existing bullets if user typed them
            : [];

          return (
            <article key={`${job.company_name}-${index}`} className="relative pl-8 md:pl-12">
              {/* Timeline dot */}
              <div className={TIMELINE_STYLES.dot} aria-hidden="true" />

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  {/* Logo Placeholder - Now supports user uploaded/linked logo */}
                  <div className="flex-shrink-0 flex items-center justify-center w-[60px] h-[60px] bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden relative">
                    {job.logo_url ? (
                      <>
                        <img
                          src={getMediaUrl(job.logo_url) || ''}
                          alt={`${job.company_name} logo`}
                          className="w-full h-full object-contain p-1 relative z-10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            // Show fallback by affecting sibling? 
                            // Easier: Just have fallback absolutely positioned behind it, or standard behavior.
                            // If img hides, the background is visible.
                            // Let's use the 'hidden' class toggle or just have fallback always there if transparent?
                            // No, if logo is transparent png, we see fallback behind.
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center fallback-icon">
                          <Building2 className="w-8 h-8 text-zinc-400" />
                        </div>
                      </>
                    ) : (
                      <Building2 className="w-8 h-8 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                      {job.company_name}
                    </h3>
                    <p className="text-lg text-zinc-700 dark:text-zinc-300 font-medium">
                      {job.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-0 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full w-fit self-start sm:self-center">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <time>
                    {(() => {
                      const formatDate = (d: string | null) => {
                        if (!d || d === 'Present') return 'Present';
                        const date = new Date(d);
                        // Verify valid date and it looks like it was parsed meaningfully
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        }
                        return d;
                      };
                      return `${formatDate(job.start_date)} - ${formatDate(job.end_date)}`;
                    })()}
                  </time>
                </div>
              </div>

              <ul className="space-y-3">
                {descriptionPoints.map((item, i) => (
                  <li
                    key={`${index}-desc-${i}`}
                    className="text-zinc-600 dark:text-zinc-400 leading-relaxed flex items-start gap-2"
                  >
                    <span className={TIMELINE_STYLES.bullet} aria-hidden="true" />
                    <span className="break-words min-w-0 w-full">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
