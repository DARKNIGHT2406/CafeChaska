// Centralized config for API URLs
// Fallback to the active Ngrok tunnel since Render is unreachable/timed out
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ungesticulative-stuart-nonshattering.ngrok-free.dev';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
