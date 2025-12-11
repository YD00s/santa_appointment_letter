import { SantaProvider } from '@/contexts/SantaContext';
import type { Metadata } from 'next';
import { ToastProvider } from '@/contexts/ToastProvider';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: '산타 테스트',
  description: '나는 어떤 산타일까?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h+KVbhxONx3O4FfOFgN6YXv5Jz3n0K4Zfn3bSnqYJ9KwqrJz3PmN8Kqy5"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className="custom-scrollbar">
        <SantaProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SantaProvider>
      </body>
    </html>
  );
}
