import { SocialLinks } from "./social-links";
import { SOCIAL_LINKS } from "../constants/social-links";
import { CONTACT_DATA } from "../constants/contact-data";

export function ContactSection() {
  return (
    <section className="py-12 border-t-2 border-zinc-200 dark:border-zinc-800 mt-12">
      <div className="flex flex-col items-center text-center">
        {/* Header with lines */}
        <div className="w-full flex items-center justify-center gap-4 mb-8">
          <div className="h-[2px] w-12 md:w-24 bg-zinc-200 dark:bg-zinc-800" />
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white whitespace-nowrap">
            {CONTACT_DATA.title}
          </h2>
          <div className="h-[2px] w-12 md:w-24 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-8">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {CONTACT_DATA.description}
            <br />
            {CONTACT_DATA.descriptionLine2}
          </p>

          <div className="flex flex-col items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium mb-8">
            <span>📍 {CONTACT_DATA.location}</span>
          </div>

          {/* Social Links with Text */}
          <div className="flex justify-center">
            <SocialLinks links={SOCIAL_LINKS} showLabel={true} />
          </div>
        </div>

        {/* Bottom Line */}
        <div className="w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 mt-12" />
      </div>
    </section>
  );
}
