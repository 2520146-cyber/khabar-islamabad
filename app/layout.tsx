import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Khabar Islamabad',
    default: 'Khabar Islamabad — Pakistan\'s Digital Newsroom',
  },
  description: 'Pakistan\'s most trusted digital newsroom. Breaking news, in-depth analysis, and AI-powered insights from Islamabad and across Pakistan.',
  keywords: ['Pakistan news', 'Islamabad news', 'breaking news', 'politics', 'business', 'sports', 'technology'],
  authors: [{ name: 'Abdullah Ashfaq Raja' }],
  creator: 'Khabar Islamabad',
  publisher: 'Khabar Islamabad',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://khabar.islamabad.pk'),
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: '/',
    siteName: 'Khabar Islamabad',
    title: 'Khabar Islamabad — Pakistan\'s Digital Newsroom',
    description: 'Pakistan\'s most trusted digital newsroom',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khabar Islamabad',
    description: 'Pakistan\'s most trusted digital newsroom',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: '',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#C0161D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
