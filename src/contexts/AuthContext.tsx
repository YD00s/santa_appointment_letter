'use client';
import { cookies } from '@/lib/cookies';
import { supabase } from '@/lib/supabase/supabase';
import { User } from '@/types/User';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  name: string | null;
  login: (userData: User) => void;
  logout: () => void;
  isOwner: (pageUserId: string) => boolean;
  setAuthStatus: (status: boolean, provider?: string, kakaoId?: string, userData?: User) => void;
  loadUser: (kakaoId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const name = user?.name ?? null;

  useEffect(() => {
    checkAuth();
  }, []);

  const loadUser = async (kakaoId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('kakao_id', kakaoId)
        .single();

      if (!error && data) {
        setUser(data as User);
        setIsAuthenticated(true);
      } else {
        console.error('사용자 정보 로드 실패:', error);
        clearAuth();
      }
    } catch (err) {
      console.error('사용자 정보 로드 중 예외 발생:', err);
      clearAuth();
    }
  };

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
      } else {
        clearAuth();
      }
    } catch {
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

  const setAuthStatus = (status: boolean, provider?: string, kakaoId?: string, userData?: User) => {
    if (status && userData) {
      login(userData);
    } else {
      clearAuth();
    }
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

  const isOwner = (pageUserId: string) => {
    return isAuthenticated && user?.kakao_id === pageUserId;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        name,
        login,
        logout,
        isOwner,
        setAuthStatus,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
