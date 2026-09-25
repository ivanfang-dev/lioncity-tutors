// Base URL of the contact-form backend on Render. Falls back to production so a
// missing env var can't silently point the live site at localhost.
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tuition-backend-afud.onrender.com';
