import type { Metadata, Viewport } from 'next';
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Motion } from '@/components/Motion';

const display = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--f-display', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic'], variable: '--f-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  title: { default: 'Anorix Studio', template: '%s · Anorix Studio' },
  description: 'Anorix studio dashboard',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#051236',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}<Motion /></body>
    </html>
  );
}
