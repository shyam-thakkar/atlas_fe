import { Metadata } from 'next';
import { createMetadata, noIndexMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Create Account',
  description: 'Create your AIFolio account and build your AI-powered portfolio in minutes.',
  ...noIndexMetadata,
});
