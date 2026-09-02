import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // 1. Make sure this import is here

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
import { Toaster } from 'sonner';
import Navbar from '../components/Navbar';
import SiteChrome from '../components/SiteChrome';
import Footer from './Footer';
import Whatsapp from './Whatsapp';

export const metadata = {
  metadataBase: new URL('https://www.lioncitytutors.com'),
  title: 'LionCity Tutors — Singapore Home Tuition Agency',
  description: 'Hand-matched, MOE-familiar tutors for PSLE, O-Level and JC students in Singapore, usually within 6 hours. 100% free for parents, no agency fee.',
  openGraph: {
    title: 'LionCity Tutors — Singapore Home Tuition Agency',
    description: 'Hand-matched, MOE-familiar tutors for PSLE, O-Level and JC students in Singapore, usually within 6 hours. 100% free for parents, no agency fee.',
    url: 'https://www.lioncitytutors.com',
    images: [
      {
        url: '/final.png',
        width: 800,
        height: 600,
        alt: 'LionCity Tutors',
      },
    ],
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0474BA',
  // Without `cover`, every `env(safe-area-inset-*)` on the site resolves to 0 —
  // which is what the (previously unused) safe-area helpers in globals.css were
  // silently doing. The floating WhatsApp and back-to-top controls sit exactly
  // in the home-indicator band, so this is what keeps them thumb-reachable on a
  // notched iPhone instead of half-under the system gesture bar.
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-SG" className={inter.variable}>
      {/* No preconnect for analytics: both tags below are lazyOnload, so warming
          those connections spends TLS round trips on the critical path for
          resources deliberately deferred — competing with the CSS, font and
          hero image that first paint actually waits on. */}
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-BRCN6DHYT1"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BRCN6DHYT1', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <body>
        <Toaster />
        <SiteChrome navbar={<Navbar />} footer={<Footer />} whatsapp={<Whatsapp />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}