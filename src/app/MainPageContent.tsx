'use client';
import AuthButtons from '@/components/AuthButtons';
import SnowFall from '@/components/SnowFall';
import Spinner from '@/components/Spinner';
import { useAuthContext } from '@/contexts/AuthContext';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainPageContent() {
  const [_mounted, setMounted] = useState(false);
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

  if (totalLoading || isAuthenticated) {
    return (
      <div className="text-gray50 flex h-screen w-screen flex-col items-center justify-center gap-4">
        <div className="text-3xl font-semibold">이동 중...</div>
        <Spinner />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
      <SnowFall />
      <div className="relative flex max-w-md flex-col items-center rounded-2xl bg-white/90 p-8 backdrop-blur-sm">
        <Image
          src="/assets/images/santaHat.png"
          width={50}
          height={50}
          alt="아이콘"
          className="transition-transform hover:scale-110 active:scale-100"
        />
        <h1 className="mb-4 text-3xl font-bold">산타 임명장</h1>
        <p className="mb-5 leading-7 text-gray-600">
          우리 모두는 누군가에게 선물을 준 산타야.
          <br />
          올해 나는 주변인들에게 어떤 산타였을까?
          <br />
          산타 작업실을 만들고 임명장을 받아봐!
        </p>
        <AuthButtons onKakaoLogin={handleKakaoLogin} />
      </div>
    </main>
  );
}
