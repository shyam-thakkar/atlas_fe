import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Production portfolio domain (for subdomain routing)
const PORTFOLIO_DOMAIN = process.env.NEXT_PUBLIC_PORTFOLIO_DOMAIN || 'aifolio.in';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Extract potential subdomain pattern: {username}.{domain}
  // Example: shyam-thakkar.aifolio.in
  const domainParts = hostname.split('.');
  
  // Check if this is a subdomain of the portfolio domain
  // e.g., "shyam-thakkar.aifolio.in" has 3 parts
  if (domainParts.length >= 3) {
    const potentialDomain = domainParts.slice(-2).join('.'); // "aifolio.in"
    const subdomain = domainParts.slice(0, -2).join('.'); // "shyam-thakkar"
    
    // If it matches our portfolio domain and has a valid subdomain
    if (potentialDomain === PORTFOLIO_DOMAIN && subdomain && subdomain !== 'www') {
      // Rewrite to the portfolio page with the username
      const url = new URL(`/portfolio/${subdomain}`, request.url);
      return NextResponse.rewrite(url);
    }
  }
  
  // For development: Also check for localhost subdomains (username.localhost:3000)
  // This allows testing subdomain routing locally with /etc/hosts modifications
  if (hostname.includes('localhost') && domainParts.length >= 2) {
    const subdomain = domainParts[0];
    if (subdomain !== 'localhost' && subdomain !== 'www') {
      const url = new URL(`/portfolio/${subdomain}`, request.url);
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - portfolio (already handled directly)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|portfolio).*)',
  ],
};
