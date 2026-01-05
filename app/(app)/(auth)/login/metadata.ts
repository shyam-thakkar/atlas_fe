import { Metadata } from 'next';
import { createMetadata, noIndexMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
    title: 'Sign In',
    description: 'Sign in to your AIFolio account to manage your AI-powered portfolio.',
    ...noIndexMetadata,
});
