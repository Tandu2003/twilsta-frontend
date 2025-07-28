import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import ReduxProvider from '@/providers/ReduxProvider';

import './globals.css';

// Khởi tạo biến font Inter, dùng biến CSS để apply toàn cục
const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

// Metadata cho SEO
export const metadata: Metadata = {
  title: 'Twilsta - Nơi kết nối và chia sẻ',
  description: 'Kết nối với bạn bè, chia sẻ khoảnh khắc và khám phá thế giới cùng Twilsta.',
};

// Root layout: Đặt lang="vi" cho html, apply font Inter toàn cục
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <body
        className={
          `${inter.variable} font-sans antialiased` // font-sans fallback cho Tailwind
        }
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster richColors position='top-right' expand duration={3000} />
      </body>
    </html>
  );
}
