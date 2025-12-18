import { AuthProvider } from '@/contexts/AuthContext';
import { SantaProvider } from '@/contexts/SantaContext';
import { ToastProvider } from '@/contexts/ToastProvider';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Script from 'next/script';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: '산타 임명장 - 나는 어떤 산타일까? | 크리스마스 기념 산타 임명장',
  description:
    '친구에게 산타 임명장을 수여해봐요! 8가지 산타 유형 테스트로 친구의 성격을 분석하고 특별한 메시지를 보내보세요. 크리스마스 이벤트 테스트',
  keywords:
    '산타테스트, 산타 임명장, 크리스마스, 산타 성격 테스트, 크리스마스 테스트, 성격 테스트, 친구 테스트, 산타 유형, 크리스마스 이벤트, 편지, 연말 편지, christmas',
  authors: [{ name: '산타 임명장' }],
  creator: '산타 임명장',
  publisher: '산타 임명장',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.iamsanta.site/'),

  // Open Graph (카카오톡, 페이스북 등)
  openGraph: {
    title: '🎅 산타 임명장 - 너를 santa로 임명한다.',
    description: '친구에게 어울리는 산타를 찾아주고 메세지와 함께 보내기',
    url: '/',
    siteName: '산타 임명장',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // 1200x630px 권장
        width: 1200,
        height: 630,
        alt: '산타 임명장 - 친구에게 어울리는 산타 찾고 메세지 보내기',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '산타 임명장 - 나는 어떤 산타일까?',
    description: '친구에게 어울리는 산타를 찾아주세요! 8가지 산타 유형 테스트와 따뜻한 편지 보내기',
    images: ['/og-image.png'],
  },

  // 추가 메타 태그
  other: {
    'theme-color': '#DC2626', // 크리스마스 레드
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': '산타 임명장',
  },

  // 로봇 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 아이콘
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  // 매니페스트
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head></head>
      <body className="custom-scrollbar">
        <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="beforeInteractive" />
        <AuthProvider>
          <SantaProvider>
            <ToastProvider>{children}</ToastProvider>
          </SantaProvider>
        </AuthProvider>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
