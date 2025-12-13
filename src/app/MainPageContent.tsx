'use client';
import AuthButtons from '@/components/AuthButtons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainPageContent() {
  const [mounted, setMounted] = useState(false);
  // user 객체를 useAuth에서 가져와 리다이렉션에 사용
  const { isAuthenticated, isLoading, user, setAuthStatus } = useAuthContext();

  // useKakaoLogin에 setAuthStatus 함수를 주입하여 내부적으로 사용
  const { login: kakaoLogin, isInitializing: isKakaoInitializing } = useKakaoLogin({
    setAuthStatus,
  });
  const router = useRouter();

  const totalLoading = isLoading || isKakaoInitializing;

  useEffect(() => {
    setMounted(true);
    // 로딩 완료 및 인증된 상태이며 user 정보가 있을 때, 해당 kakao_id로 이동
    if (!isLoading && isAuthenticated && user) {
      router.replace(`/mypage/${user.kakao_id}`);
    }
  }, [isAuthenticated, isLoading, router, user]); // user를 의존성 배열에 추가

  const handleKakaoLogin = async () => {
    // kakaoLogin 내부에서 setAuthStatus를 호출하여 상태를 업데이트
    const result = await kakaoLogin();

    // 로그인 완료 후, 결과로 받은 user의 kakao_id를 사용하여 리다이렉션
    if (result?.success && result.user) {
      router.push(`/mypage/${result.user.kakao_id}`);
    }
  };

  // 눈송이
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    left: (i * 17.3) % 100,
    size: (i % 3) + 5,
    duration: (i % 10) + 10,
    delay: i % 4,
  }));

  if (totalLoading) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a2847] px-6 py-24 text-center">
        <div className="text-xl font-semibold text-white">
          {isKakaoInitializing ? '인증 모듈 준비 중...' : '로딩중...'}
        </div>
      </main>
    );
  }

  // isAuthenticated가 true지만, user 정보가 아직 로드되지 않았거나 (최초 렌더링 시)
  if (isAuthenticated) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a2847] px-6 py-24 text-center">
        <div className="text-xl font-semibold text-white">마이페이지로 이동 중...</div>
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

        <AuthButtons onKakaoLogin={handleKakaoLogin} />
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
