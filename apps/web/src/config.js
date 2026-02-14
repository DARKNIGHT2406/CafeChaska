// Centralized config for API URLs
// Force relative path to use Next.js rewrites (proxies to localhost:5000)
export const API_URL = ''; // Relative path, handled by Next.js rewrites
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
