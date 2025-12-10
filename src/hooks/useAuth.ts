'use client';
import { cookies } from '@/lib/cookies';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const authStatus = cookies.get('isAuthenticated');
    const kakaoId = cookies.get('kakao_id');

    setIsAuthenticated(authStatus === 'true');

    // Supabase에서 사용자 정보 가져오기 (선택사항)
    if (authStatus === 'true' && kakaoId) {
      loadUser(kakaoId);
    }

    setIsLoading(false);
  }, []);

  const loadUser = async (kakaoId: string) => {
    try {
      // Supabase 연동
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('kakao_id', kakaoId)
        .single();

      if (!error && data) {
        setUser(data);
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    }
  };

  const setAuthStatus = (status: boolean, provider?: string, kakaoId?: string) => {
    if (status) {
      cookies.set('isAuthenticated', 'true', 7);
      if (provider) {
        cookies.set('authProvider', provider, 7);
      }
      if (kakaoId) {
        cookies.set('kakao_id', kakaoId, 7);
      }
    } else {
      cookies.remove('isAuthenticated');
      cookies.remove('authProvider');
      cookies.remove('kakao_id');
      setUser(null);
    }
    setIsAuthenticated(status);
  };

  const logout = () => {
    setAuthStatus(false);
  };

  return { isAuthenticated, isLoading, setAuthStatus, logout, user };
};
