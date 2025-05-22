import React from 'react';
import { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/components/layout/ThemeRegistry';

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
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
} 