'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { siteConfig } from '@/lib/seo';
import { StructuredPortfolio, SocialLinks } from '@/types/portfolio';

interface PortfolioJsonLdProps {
  portfolio: StructuredPortfolio;
  username: string;
}

export function PortfolioJsonLd({ portfolio, username }: PortfolioJsonLdProps) {
  const [jsonLd, setJsonLd] = useState<object | null>(null);

  useEffect(() => {
    const heroData = portfolio?.hero;
    const name = heroData?.full_name || username;
    const title = heroData?.headline || '';
    const bio = heroData?.short_bio || '';
    const profileImage = heroData?.profile_image;
    
    // Get email from socials object
    const socials: SocialLinks | undefined = portfolio?.socials;
    const email = socials?.email;

    // Build social links array from socials object
    const socialLinks: string[] = [];
    if (socials) {
      if (socials.github) socialLinks.push(socials.github);
      if (socials.linkedin) socialLinks.push(socials.linkedin);
      if (socials.twitter) socialLinks.push(socials.twitter);
      if (socials.portfolio) socialLinks.push(socials.portfolio);
    }

    const data = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      'mainEntity': {
        '@type': 'Person',
        'name': name,
        ...(title && { 'jobTitle': title }),
        ...(bio && { 'description': bio }),
        ...(profileImage && { 'image': profileImage }),
        ...(email && { 'email': email }),
        ...(socialLinks.length > 0 && { 'sameAs': socialLinks }),
        'url': `${siteConfig.url}/portfolio/${username}`,
      },
    };

    setJsonLd(data);
  }, [portfolio, username]);

  if (!jsonLd) return null;

  return (
    <Script
      id="portfolio-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
