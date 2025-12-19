import { memo, ReactNode } from "react";

interface TechBadgeProps {
  name: string;
  href?: string;
  icon?: ReactNode;
  imageSrc?: string;
  variant?: 'colored' | 'black' | 'white';
}

export const TechBadge = memo(function TechBadge({ name, href = "#", icon, imageSrc, variant = 'colored' }: TechBadgeProps) {
  // Common background style for all variants
  const commonStyle = "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700";

  // Filter logic based on variant (Logo Color)
  const getImageFilterClass = () => {
    switch (variant) {
      case 'black':
        // Source is Black. Visible on Light. Invisible on Dark (needs invert).
        // Matches user request: "if theme of render is black and logo colour is black then do invert"
        return "dark:invert";
      case 'white':
        // Source is White. Invisible on Light (needs invert). Visible on Dark.
        // Matches user request: "if the theme of preview editor is white and colour of icon is white then only do invert"
        return "invert dark:invert-0";
      case 'colored':
      default:
        return "";
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2 py-1 align-middle rounded-md border text-sm font-medium transition-colors mx-1 ${commonStyle}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${name} logo`}
          className={`w-5 h-5 object-contain rounded-sm p-0.5 ${getImageFilterClass()}`}
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
          loading="lazy"
        />
      ) : (
        icon
      )}
      <span>{name}</span>
    </a>
  );
});

