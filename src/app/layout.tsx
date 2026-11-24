import type { Metadata } from 'next';
import '@/styles/globals.css';
import { db } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import FloatingTools from '@/components/FloatingTools';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Nexus News UP | उत्तर प्रदेश — सच की आवाज़, निष्पक्ष समाचार',
    template: '%s | Nexus News UP'
  },
  description: 'Nexus News UP (उत्तर प्रदेश) - राज्य की ताज़ा ख़बरें, ब्रेकिंग न्यूज़, ग्राउंड रिपोर्ट और 24x7 लाइव अपडेट्स।',
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    siteName: 'Nexus News UP (उत्तर प्रदेश)',
    images: [
      {
        url: '/images/nexus-news-up-logo.png',
        width: 1200,
        height: 630,
        alt: 'Nexus News UP - उत्तर प्रदेश',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@NexusNewsUP',
    images: ['/images/nexus-news-up-logo.png'],
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await db.getCategories();
  const breaking = await db.getBreakingArticles();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-red-600 selection:text-white">
        <BreakingTicker initialBreaking={breaking} />
        <Header categories={categories} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          {children}
        </main>
        <Footer />
        <FloatingTools />
      </body>
    </html>
  );
}
