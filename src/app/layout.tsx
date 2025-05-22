import React from 'react';
import { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/components/layout/ThemeRegistry';
import { Noto_Sans_JP, Roboto } from 'next/font/google';

// Noto Sans JPの設定
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

// Robotoの設定
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: '建材ECモック | 建設資材のオンラインショップ',
  description: '建設・建材業界向けECサイトのモックです。品質の高い建設資材、工具、作業用品をオンラインで簡単に注文できます。',
};

/**
 * Root layout component
 * Wraps the entire application in global providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${roboto.variable}`}>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
} 