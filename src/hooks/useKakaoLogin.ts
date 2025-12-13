'use client';
import { supabase } from '@/lib/supabase/supabase';
import { KakaoLoginData, User } from '@/types/User';
import { useEffect, useState } from 'react';

// Kakao SDK가 전역에 정의됨을 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

interface LoginResult {
  success: boolean;
  provider?: string;
  user?: User & { id?: string }; // Supabase에서 반환된 전체 user 객체
  error?: any;
}

// useAuth 훅의 반환 타입에서 setAuthStatus만 명시적으로 가져옵니다.
interface AuthHookApi {
  setAuthStatus: (status: boolean, provider?: string, kakaoId?: string, userData?: any) => void;
}

// useAuth 훅에서 setAuthStatus 함수를 외부에서 주입받아 사용하도록 변경합니다.
// 이렇게 하면 AuthContext를 직접 가져올 필요 없이 의존성을 주입할 수 있습니다.
export const useKakaoLogin = (authApi: AuthHookApi) => {
  const [isInitialized, setIsInitialized] = useState(false);
  // [수정]: 초기화 시도 중 상태를 명확히 반환합니다.
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      setIsInitializing(false);
      return;
    }

    let initTimer: NodeJS.Timeout | null = null;

    const checkKakaoLoad = () => {
      if (typeof window !== 'undefined' && window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
          if (jsKey) {
            try {
              window.Kakao.init(jsKey);
              setIsInitialized(true);
            } catch (e) {
              console.error('❌ Kakao SDK 초기화 중 오류 발생:', e);
            }
          } else {
            console.error('❌ NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다.');
          }
        } else {
          setIsInitialized(true);
        }
        setIsInitializing(false);
        if (initTimer) clearTimeout(initTimer);
      } else {
        initTimer = setTimeout(checkKakaoLoad, 200);
      }
    };

    checkKakaoLoad();

    return () => {
      if (initTimer) clearTimeout(initTimer);
    };
  }, [isInitialized]);

  const login = async (): Promise<LoginResult> => {
    if (!isInitialized) {
      console.error('❌ Kakao SDK가 초기화되지 않아 로그인 시도 실패.');
      return { success: false, error: 'SDK not initialized' };
    }

    try {
      return new Promise(resolve => {
        window.Kakao.Auth.login({
          success: async () => {
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: async (response: any) => {
                try {
                  const userData: KakaoLoginData = {
                    kakao_id: response.id.toString(),
                  };

                  // Supabase upsert
                  const { data, error } = await supabase
                    .from('users')
                    .upsert(
                      {
                        ...userData,
                      },
                      { onConflict: 'kakao_id' }
                    )
                    .select()
                    .single();

                  if (error) {
                    console.error('❌ Supabase 저장 실패:', error);
                    resolve({ success: false, error });
                    return;
                  }

                  // setAuthStatus를 호출하여 인증 상태와 쿠키를 업데이트하고, user 데이터를 AuthContext에 저장합니다.
                  authApi.setAuthStatus(true, 'kakao', data.kakao_id, data);

                  resolve({ success: true, provider: 'kakao', user: data });
                } catch (error) {
                  console.error('❌ 사용자 정보 저장 오류:', error);
                  resolve({ success: false, error });
                }
              },
              fail: (error: any) => {
                console.error('❌ 사용자 정보 조회 실패:', error);
                resolve({ success: false, error });
              },
            });
          },
          fail: (error: any) => {
            console.error('❌ 카카오 로그인 실패:', error);
            resolve({ success: false, error });
          },
        });
      });
    } catch (error) {
      console.error('❌ 카카오 로그인 Promise 오류:', error);
      return { success: false, error };
    }
  };

  const logout = () => {
    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        console.log('✅ Kakao 로그아웃 완료');
      });
    }
  };

  // [수정]: isInitializing을 반환합니다.
  return { login, logout, isInitialized, isInitializing };
};
