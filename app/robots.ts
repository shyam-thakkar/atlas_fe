import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aifolio.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard',
                    '/dashboard/*',
                    '/api',
                    '/api/*',
                    '/login',
                    '/signup',
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
