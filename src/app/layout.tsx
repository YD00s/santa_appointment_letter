import { SantaProvider } from '@/contexts/SantaContext';
import type { Metadata } from 'next';
import { ToastProvider } from '@/contexts/ToastProvider';
import Script from 'next/script';

import '../styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: '산타 테스트',
  description: '나는 어떤 산타일까?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
      </head>
      <body className="custom-scrollbar">
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy='beforeInteractive'
          />
          <AuthProvider>
            <SantaProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </SantaProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
