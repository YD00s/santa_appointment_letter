'use client';
import { cookies } from '@/lib/cookies';
import { supabase } from '@/lib/supabase/supabase';
import { User } from '@/types/User';
import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 사용자 정보를 DB에서 로드
  const loadUser = useCallback(async (kakaoId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('kakao_id', kakaoId)
        .maybeSingle();

      if (error) {
        console.error('[AUTH] 사용자 조회 실패', error);
        setError('사용자 정보를 불러올 수 없습니다.');
        return null;
      }

      if (!data) {
        console.warn('[AUTH] 사용자 레코드 없음');
        setError('존재하지 않는 사용자입니다.');
        return null;
      }

      setUser(data as User);
      setError(null);
      return data as User;
    } catch (err) {
      console.error('[AUTH] loadUser 예외', err);
      setError('네트워크 오류가 발생했습니다.');
      return null;
    }
  }, []);

  /**
   * 인증 상태 변경 함수
   * - 로그인/로그아웃 시 호출
   * - 로그인 직후 userData 없으면 DB에서 강제로 최신 정보 로드
   * - 변경된 이름/설정이 있을 경우 즉시 재로드
   */
  const setAuthStatus = useCallback(
    async (status: boolean, provider?: string, kakaoId?: string, userData?: User) => {
      if (status && kakaoId) {
        cookies.set('isAuthenticated', 'true', 7);
        cookies.set('authProvider', provider || 'kakao', 7);
        cookies.set('kakao_id', kakaoId, 7);

        setIsAuthenticated(true);

        const freshUser = await loadUser(kakaoId);

        if (!freshUser) {
          // DB 기준으로 인증 실패 → 즉시 로그아웃
          cookies.remove('isAuthenticated');
          cookies.remove('authProvider');
          cookies.remove('kakao_id');

          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // 로그아웃 처리
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
          });
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error);
        }

        setUser(null);
        setIsAuthenticated(false);
        setError(null);
      }
    },
    [loadUser]
  );

  // 최초 진입 시 쿠키 기반으로 자동 로그인 처리
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const authStatus = cookies.get('isAuthenticated');
      const kakaoId = cookies.get('kakao_id');

      if (authStatus === 'true' && kakaoId) {
        setIsAuthenticated(true);
        const user = await loadUser(kakaoId);
        if (!user && mounted) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      if (mounted) setIsLoading(false);
    };

    checkAuth();
  }, [loadUser]);

  const logout = async () => {
    await setAuthStatus(false);
  };

  return { isAuthenticated, isLoading, error, setAuthStatus, logout, user, loadUser };
};
