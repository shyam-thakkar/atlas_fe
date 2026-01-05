import { Metadata } from 'next';
import { createMetadata, noIndexMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Dashboard',
  description: 'Manage your AIFolio portfolio, resume, and settings.',
  ...noIndexMetadata,
});
