import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'DataChain - AI数据交易市场',
  description: '2026年AI原始人类数据将耗尽，用户与AI的对话数据将成为各巨头争抢的资产。DataChain是下一代AI数据交易市场，让您的对话数据创造价值。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-dark-300 text-white antialiased">
        <Header />
        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
      </body>
    </html>
  );
}
