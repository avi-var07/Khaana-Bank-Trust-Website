import { NextResponse } from 'next/server';

/**
 * Global Middleware to handle CORS for API routes.
 * This allows the Vercel frontend to communicate with the Render backend.
 */
export function middleware(request) {
  const allowedOrigins = [
    'https://khaanabanktrust.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  const origin = request.headers.get('origin');
  
  // Create a response based on the next middleware or route
  const response = request.method === 'OPTIONS' 
    ? new NextResponse(null, { status: 204 })
    : NextResponse.next();

  // Set CORS headers if origin is allowed or if it's a server-to-server request (no origin)
  if (!origin || allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

// Only apply middleware to API routes
export const config = {
  matcher: '/api/:path*',
};
