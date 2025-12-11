'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cookies } from '@/lib/cookies';
import { supabase } from '@/lib/supabase/supabase';

interface User {
  kakao_id: string;
  email?: string;
  nickname?: string;
  profile_image?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isOwner: (pageUserId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authStatus = cookies.get('isAuthenticated');
      const kakaoId = cookies.get('kakao_id');

      if (authStatus === 'true' && kakaoId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('kakao_id', kakaoId)
          .single();

        if (!error && data) {
          setUser(data);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    cookies.set('isAuthenticated', 'true', 7);
    cookies.set('kakao_id', userData.kakao_id, 7);
    cookies.set('authProvider', 'kakao', 7);
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuth = () => {
    cookies.remove('isAuthenticated');
    cookies.remove('kakao_id');
    cookies.remove('authProvider');
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = () => {
    if (typeof window !== 'undefined' && window.Kakao?.Auth?.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        console.log('✅ 카카오 로그아웃 완료');
      });
    }
    clearAuth();
  };

  // 현재 페이지가 내 페이지인지 확인
  const isOwner = (pageUserId: string) => {
    return isAuthenticated && user?.kakao_id === pageUserId;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}