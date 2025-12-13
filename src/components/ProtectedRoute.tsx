'use client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // 로그인되지 않았으면 홈으로 리다이렉트
      router.replace('/?error=login_required');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이면 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않았으면 아무것도 렌더링하지 않음 (리다이렉트 진행 중)
  if (!isAuthenticated) {
    return null;
  }

  // 인증된 경우에만 자식 컴포넌트 렌더링
  return <>{children}</>;
}
