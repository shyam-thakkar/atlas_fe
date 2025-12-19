import type { NextConfig } from "next";

// Extract hostname and port from API URL for image configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const apiUrlObj = new URL(apiUrl);
const apiHostname = apiUrlObj.hostname;
const apiPort = apiUrlObj.port || (apiUrlObj.protocol === 'https:' ? '443' : '80');
const apiProtocol = apiUrlObj.protocol.replace(':', '') as 'http' | 'https';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        port: apiPort,
        pathname: '/media/**',
      },
      // Fallback for localhost in development
      ...(process.env.NODE_ENV === 'development' ? [
        {
          protocol: 'http' as const,
          hostname: 'localhost',
          port: '8000',
          pathname: '/media/**',
        },
        {
          protocol: 'http' as const,
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/media/**',
        },
      ] : []),
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow localhost images in development
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
