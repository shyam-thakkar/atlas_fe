export interface SocialLink {
  name: string;
  href: string;
  icon: "instagram" | "twitter" | "pinterest" | "facebook" | "mail" | "github" | "linkedin" | "resume";
  ariaLabel: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Email", href: "mailto:work.shyamthakkar@gmail.com", icon: "mail", ariaLabel: "Email" },
  { name: "LinkedIn", href: "https://in.linkedin.com/in/shyam-thakkar167", icon: "linkedin", ariaLabel: "LinkedIn" },
  { name: "GitHub", href: "https://github.com/shyam-thakkar", icon: "github", ariaLabel: "GitHub" },
  { name: "Resume", href: "./Shyam_thakkar_resume.pdf", icon: "resume", ariaLabel: "Download Resume" },
];
