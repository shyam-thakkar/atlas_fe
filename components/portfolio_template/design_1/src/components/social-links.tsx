"use client";

import { memo, useMemo, SVGProps } from "react";
import { Instagram, Twitter, Facebook, Mail, Github, Linkedin, LucideIcon, FileText } from "lucide-react";

const PinterestIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.92-.19-2.33 0-3.33l1.45-6.15s-.37-.74-.37-1.84c0-1.72 1-3 2.24-3 1.05 0 1.56.79 1.56 1.74 0 1.06-.68 2.64-1.03 4.11-.29 1.23.62 2.23 1.84 2.23 2.21 0 3.91-2.33 3.91-5.69 0-2.97-2.14-5.05-5.19-5.05-3.54 0-5.62 2.65-5.62 5.39 0 1.07.41 2.21.92 2.83.1.12.11.23.08.35l-.34 1.4c-.05.22-.18.27-.42.16-1.56-.73-2.54-3.01-2.54-4.85 0-3.94 2.86-7.56 8.25-7.56 4.33 0 7.69 3.08 7.69 7.2 0 4.29-2.71 7.75-6.47 7.75-1.26 0-2.45-.66-2.86-1.43l-.78 2.97c-.28 1.09-1.04 2.45-1.55 3.28A12 12 0 1 0 12 0z" />
  </svg>
);

interface SocialLink {
  name: string;
  href: string;
  icon: "instagram" | "twitter" | "pinterest" | "facebook" | "mail" | "github" | "linkedin" | "resume";
  ariaLabel: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  showLabel?: boolean;
}

const ICON_MAP: Record<SocialLink["icon"], LucideIcon | typeof PinterestIcon> = {
  instagram: Instagram,
  twitter: Twitter,
  pinterest: PinterestIcon,
  facebook: Facebook,
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  resume: FileText,
} as const;

export const SocialLinks = memo(function SocialLinks({ links, className = "", showLabel = false }: SocialLinksProps) {
  const iconComponents = useMemo(() => {
    return links.map((link) => ({
      ...link,
      IconComponent: ICON_MAP[link.icon] || Mail,
    }));
  }, [links]);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      {iconComponents.map(({ name, href, IconComponent, ariaLabel }) => (
        <a
          key={name}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          className={`group relative flex items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-105 hover:border-zinc-300 dark:hover:border-zinc-600 ${
            showLabel ? "px-3 py-1.5" : "p-2 hover:scale-110"
          }`}
          aria-label={ariaLabel}
        >
          <IconComponent className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />

          {showLabel ? (
            <span className="font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
              {name}
            </span>
          ) : (
            /* Tooltip - Only show when label is hidden */
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {name}
              {/* Arrow */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
            </span>
          )}
        </a>
      ))}
    </div>
  );
});

