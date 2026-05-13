/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production — prevents code leaking via browser DevTools
  productionBrowserSourceMaps: false,

  // Powered-by header exposes Next.js version — disable it
  poweredByHeader: false,

  // Security headers to protect against common attacks and source inspection
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent the site from being embedded in iframes (clickjacking protection)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Enable XSS protection in older browsers
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Strict referrer policy — don't leak full URL to external sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — restrict browser features you don't use
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
      {
        // Block direct access to API source files
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');

    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
