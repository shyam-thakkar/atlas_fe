import './globals.css';
import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Portfolio Preview',
    description: 'Live portfolio preview',
};

export default function PreviewRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    disableTransitionOnChange
                    forcedTheme="light"
                    storageKey="portfolio-preview-theme"
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
