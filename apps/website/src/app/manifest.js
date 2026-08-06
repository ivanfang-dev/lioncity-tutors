export default function manifest() {
  return {
    name: 'LionCity Tutors — Singapore Home Tuition',
    short_name: 'LionCity Tutors',
    description: 'Hand-matched, MOE-familiar tutors for PSLE, O-Level and JC students in Singapore. 100% free for parents.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0474BA',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
