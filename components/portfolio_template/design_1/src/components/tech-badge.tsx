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
        return "dark:invert";
      case 'white':
        // Source is White. Invisible on Light (needs invert). Visible on Dark.
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

// Official SVG Icons
export const Icons = {
  Python: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" role="img">
      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77V9.7l.09.73.2.6.3.47.38.35.44.23.49.11.52.02h1.77l.53-.05.46-.14.38-.23.28-.32.17-.41.06-.5h2.16l-.08.96-.26.88-.42.77-.55.63-.66.46-.73.27-.78.09-.8.02h-3.8l-.94-.04-.85-.14-.74-.25-.6-.36-.45-.48-.28-.61-.11-.76v-4.2l.01-1.53.16-1.31.37-1.12.63-.93.88-.73 1.1-.52 1.27-.29 1.36-.05 1.38.19 1.29.43 1.09.68.8.94.42 1.22.05 1.53h-2.16l-.04-.63-.11-.5-.2-.37-.27-.24-.31-.13-.34-.04h-1.9l-.37.04-.33.13-.27.24-.18.37-.07.51v2.5l.02.4.07.36.14.3.22.23.3.16.36.08.4.02h3.3l.41-.02.38-.08.33-.14.27-.21.2-.28.12-.35.04-.42V4.6l-.02-.34-.05-.28-.1-.22-.14-.17-.18-.12-.22-.07-.25-.03h-1.8l-.24.03-.22.07-.18.12-.14.17-.1-.22-.05-.28-.02-.34v-2.1l.04-.42.12-.35.2-.28.27-.21.33-.14.38-.08.41-.02h3.3l.4.02.36.08.3.16.22.23.14.3.07.36.02.4v2.5l-.07.51-.18.37-.27.24-.33.13-.37.04h-1.9l-.34-.04-.31-.13-.27-.24-.2-.37-.11-.5-.04-.63h-2.16l.05 1.53.42 1.22.8.94 1.09.68 1.29.43 1.38.19 1.36-.05 1.27-.29 1.1-.52.88-.73.63-.93.37-1.12.16-1.31.01-1.53v-4.2l-.11-.76-.28-.61-.45-.48-.6-.36-.74-.25-.85-.14-.94-.04h-3.8l-.8.02-.78.09-.73.27-.66.46-.55.63-.42.77-.26.88-.08.96h2.16l.06-.5.17-.41.28-.32.38-.23.46-.14.53-.05h1.77l.52.02.49.11.44.23.38.35.3.47.2.6.09.73v2.24h-3.17l-.21.02-.26.04-.3.07-.33.1-.35.14-.35.19-.33.25-.3.31-.26.38-.21.46-.13.55-.05.63v5.37l-.01.13.02.2.04.26.1.3.16.33.25.34.34.34.45.32.59.3.73.26.9.2 1.06.13 1.21.05 1.34-.04 1.45-.14 1.53-.26 1.58-.4 1.6-.55 1.58-.72 1.53-.9 1.44-1.1 1.32-1.32 1.16-1.56.96-1.83.72-2.12.45-2.43.14-2.77-.2-3.12-.56-3.47-.94-3.8-1.35-4.11-1.79-4.38-2.26-4.61-2.76-4.79-3.29-4.92-3.85-5-4.43-5.02-5.04-4.98-5.66-4.87-6.3-4.7-6.94-4.48-7.58-4.21-8.23-3.89-8.87-3.53-9.51-3.12-10.14-2.68-10.76-2.2-11.37-1.69-11.97-1.15-12.56-.58-13.14.01-13.71.62-14.27 1.25z" />
    </svg>
  ),
  Django: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" role="img">
      <path d="M11.146 0h3.876v18.046c0 2.229-1.342 3.567-3.876 3.567-2.029 0-3.324-1.071-3.662-2.314l2.843-.957c.129.5.5.786 1.057.786.729 0 1.129-.443 1.129-1.371V0zm-6.8 6.043H7.5v12.214H4.346V6.043zM19.2 21.614c-2.9 0-4.857-1.886-4.857-5.329V6.043h3.157v9.843c0 1.6.771 2.386 2.057 2.386 1.243 0 1.843-.757 1.843-2.143V6.043H24.5v10.3c0 3.329-2.071 5.271-5.3 5.271zM7.457 0H1.914l-1.8 3.529h3.614L7.457 0z" />
    </svg>
  ),
  FastAPI: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" role="img">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.55 18.25h-2.2v-4.15H6.95l5.2-9.35h2.2v4.15h3.4l-5.2 9.35z" />
    </svg>
  ),
  LangChain: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" role="img">
      <path d="M12.005 2.846c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94h-1.88zm-5.64 2.82c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94H6.365zm11.28 0c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94h-1.88zM3.545 8.486c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94H3.545zm16.92 0c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94h-1.88zm-14.1 5.64c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94H6.365zm11.28 0c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94h-1.88zm-5.64 2.82c-.52 0-.94.42-.94.94v1.88c0 .52.42.94.94.94h1.88c.52 0 .94-.42.94-.94v-1.88c0-.52-.42-.94-.94-.94h-1.88z" />
    </svg>
  ),
  LangGraph: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" role="img">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="17.2" cy="9" r="1.5" fill="currentColor" />
      <circle cx="17.2" cy="15" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
      <circle cx="6.8" cy="15" r="1.5" fill="currentColor" />
      <circle cx="6.8" cy="9" r="1.5" fill="currentColor" />
    </svg>
  )
};
