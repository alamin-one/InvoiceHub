import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import ThemeProviders from '@/providers/ThemeProvider';
import ReduxProvider from '@/providers/ReduxProvider';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const dMSans = DM_Sans({
  variable: '--font-dMSans',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'InvoiceHub | Invoice & Customer Management System',

  description:
    'A full-stack invoicing application for businesses and freelancers to manage customers, invoices, payments, and analytics with secure authentication and PDF invoice generation.',

  metadataBase: new URL('https://alamin-invoicehub.vercel.app/'),

  openGraph: {
    title: 'InvoiceHub | Invoice & Customer Management System',

    description:
      'Manage customers, invoices, payments, and business analytics with InvoiceHub, a full-stack invoicing application built with Next.js, Express, MongoDB, and TypeScript.',

    siteName: 'InvoiceHub',

    url: 'https://alamin-invoicehub.vercel.app/',

    type: 'website',

    images: [
      {
        url: '/image/invoicePrev.webp',
        width: 1200,
        height: 630,
        alt: 'InvoiceHub Invoice & Customer Management System Preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'InvoiceHub | Invoice & Customer Management System',

    description:
      'Full-stack invoicing application for managing customers, invoices, payments, and business analytics.',

    images: ['/image/invoicePrev.webp'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${spaceGrotesk.variable} ${dMSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {
          <ThemeProviders>
            <ReduxProvider>{children}</ReduxProvider>
          </ThemeProviders>
        }
      </body>
    </html>
  );
}
