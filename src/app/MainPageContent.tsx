'use client';
import AuthButtons from '@/components/AuthButtons';
import Button from '@/components/Button/Button';
import { useAuth } from '@/hooks/useAuth';
// import { useGoogleLogin } from '@/hooks/useGoogleLogin';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import { useEffect, useState } from 'react';

export default function MainPageContent() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading, setAuthStatus } = useAuth();
  const { login: kakaoLogin } = useKakaoLogin();
  // const { login: googleLogin } = useGoogleLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKakaoLogin = async () => {
    const result = await kakaoLogin();
    if (result?.success) {
      const kakaoId = result.user?.id?.toString();
      setAuthStatus(true, 'kakao', kakaoId);
    }
  };

  // const handleGoogleLogin = async () => {
  //   const result = await googleLogin();
  //   if (result.success) {
  //     setAuthStatus(true, 'google');
  //   }
  // };

  // 눈송이
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    left: (i * 17.3) % 100,
    size: (i % 3) + 5,
    duration: (i % 10) + 10,
    delay: i % 4,
  }));

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a2847] px-6 py-24 text-center">
        <div className="text-xl text-white">로딩중...</div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a2847] px-6 py-24 text-center">
      {mounted && (
        <div className="pointer-events-none absolute inset-0">
          {snowflakes.map((flake, i) => (
            <div
              key={i}
              className="animate-snowfall absolute rounded-full bg-blue-50"
              style={{
                left: `${flake.left}%`,
                top: '-10px',
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                animationDuration: `${flake.duration}s`,
                animationDelay: `${flake.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-md rounded-2xl bg-white/90 p-8 backdrop-blur-sm">
        <h1 className="mb-4 text-3xl font-bold">산타 임명장</h1>
        <p className="mb-8 text-gray-600">
          우리 모두는 누군가에게 선물을 준 산타야.
          <br />
          올해 나는 주변인들에게 어떤 산타였을까?
        </p>

        {isAuthenticated ? (
          <Button href="/mypage" size="lg" label="내 산타 작업실 가기" />
        ) : (
          <AuthButtons onKakaoLogin={handleKakaoLogin} />
        )}
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </main>
  );
}
