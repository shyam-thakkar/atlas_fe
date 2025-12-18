import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Inter, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatWidget } from "@/components/chat-widget";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Shyam Thakkar | GenAI Developer",
  description: "Portfolio of Shyam Thakkar - A production-ready GenAI Engineer specializing in building intelligent applications with LangChain, LangGraph, Django, and FastAPI.",
  keywords: ["GenAI", "AI Developer", "LangChain", "LangGraph", "Python", "Django", "FastAPI", "Portfolio"],
  authors: [{ name: "Shyam Thakkar" }],
  openGraph: {
    title: "Shyam Thakkar | GenAI Developer",
    description: "Portfolio of Shyam Thakkar - GenAI Engineer specializing in intelligent applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9L52LJC3CE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9L52LJC3CE');
          `}
        </Script>
      </head>
      <body
        className={`${sora.variable} ${inter.variable} ${caveat.variable} font-heading antialiased transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

