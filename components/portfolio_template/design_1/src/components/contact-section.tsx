"use client";

import { DynamicSocialIcon } from "./dynamic-social-icon";
import { ContactSection as ContactSectionType } from "../../../../../types/portfolio";

interface ContactSectionProps {
  socials?: Record<string, string | undefined>;
  contact?: ContactSectionType | null;
}

const DEFAULT_MESSAGE = "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out through any of the social links!";

export function ContactSection({ socials, contact }: ContactSectionProps) {
  // If contact is null or empty object, don't render the section
  if (!contact || Object.keys(contact).length === 0) {
    return null;
  }
  
  // Use actual message if provided, otherwise show default
  const message = contact.message || DEFAULT_MESSAGE;
  
  return (
    <section className="py-8 border-t-2 border-zinc-200 dark:border-zinc-800 mt-8">
      <div className="flex flex-col items-center text-center">
        {/* Header with lines */}
        <div className="w-full flex items-center justify-center gap-4 mb-8">
          <div className="h-[2px] w-12 md:w-24 bg-zinc-200 dark:bg-zinc-800" />
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white whitespace-nowrap">
            Let's Connect
          </h2>
          <div className="h-[2px] w-12 md:w-24 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-8">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {message}
          </p>

          {/* Social Links - Only show if socials data is provided */}
          {socials && Object.keys(socials).length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Object.entries(socials).map(([platform, url]) => {
                if (!url || typeof url !== 'string') return null;

                // Handle email special case
                const finalUrl = platform === 'email'
                  ? (url.startsWith('mailto:') ? url : `mailto:${url}`)
                  : url;

                return (
                  <DynamicSocialIcon
                    key={platform}
                    platform={platform}
                    url={finalUrl}
                    showLabel={true}
                  />
                );
              })}
            </div>
          )}

          {/* CTA Button if provided */}
          {contact.cta_text && (
            <div className="pt-2">
              <a
                href={socials?.email ? `mailto:${socials.email.replace('mailto:', '')}` : '#'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300"
              >
                {contact.cta_text}
              </a>
            </div>
          )}
        </div>

        {/* Bottom Line */}
        <div className="w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 mt-8" />
      </div>
    </section>
  );
}
