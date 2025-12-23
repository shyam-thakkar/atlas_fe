import { LandingNavbar } from "@/components/LandingNavbar";
import { LandingHero } from "@/components/LandingHero";
import { LandingPortfolioPreview } from "@/components/LandingPortfolioPreview";
import { LandingFeatures } from "@/components/LandingFeatures";
import { LandingHowItWorks } from "@/components/LandingHowItWorks";
import { LandingPricing } from "@/components/LandingPricing";
import { LandingFooter } from "@/components/LandingFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-grow">
        <LandingHero />
        <LandingPortfolioPreview />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  );
}
