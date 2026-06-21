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
import Footer from './Footer';
import Whatsapp from './Whatsapp';

export const metadata = {
  metadataBase: new URL('https://lioncitytutors.com'),
  title: 'LionCity Tutors',
  description: 'Best tuition in Singapore',
  openGraph: {
    title: 'LionCity Tutors',
    description: 'Best tuition in Singapore',
    url: 'https://lioncitytutors.com',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
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
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Whatsapp />
      </body>
    </html>
  );
}