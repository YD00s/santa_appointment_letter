'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface LoginResult {
  success: boolean;
  provider?: string;
  user?: any;
  error?: any;
}

export const useKakaoLogin = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initKakao = () => {
      if (typeof window !== 'undefined' && window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
          if (jsKey) {
            window.Kakao.init(jsKey);
            setIsInitialized(true);
            console.log('✅ Kakao SDK 초기화 완료');
          } else {
            console.error('❌ NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았습니다.');
          }
        } else {
          setIsInitialized(true);
          console.log('✅ Kakao SDK 이미 초기화됨');
        }
      }
    };

    // SDK 로드 대기
    if (document.readyState === 'complete') {
      initKakao();
    } else {
      window.addEventListener('load', initKakao);
      return () => window.removeEventListener('load', initKakao);
    }
  }, []);

  const login = async (): Promise<LoginResult> => {
    if (!isInitialized) {
      console.error('❌ Kakao SDK가 초기화되지 않았습니다.');
      return { success: false, error: 'SDK not initialized' };
    }

    try {
      return new Promise(resolve => {
        window.Kakao.Auth.login({
          success: async (authObj: any) => {
            console.log('✅ 카카오 로그인 성공:', authObj);

            // 사용자 정보 가져오기
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: async (response: any) => {
                console.log('✅ 사용자 정보:', response);

                try {
                  // Supabase에 사용자 정보 저장/업데이트
                  const userData = {
                    kakao_id: response.id.toString(),
                    email: response.kakao_account?.email || null,
                    nickname: response.kakao_account?.profile?.nickname || null,
                    profile_image: response.kakao_account?.profile?.profile_image_url || null,
                  };

                  // Supabase 연동 (아래 주석 해제)

                  const { data, error } = await supabase
                    .from('users')
                    .upsert(
                      {
                        ...userData,
                        updated_at: new Date().toISOString(),
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

                  console.log('✅ Supabase 저장 성공:', data);

                  resolve({
                    success: true,
                    provider: 'kakao',
                    user: response,
                  });
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
      console.error('❌ 카카오 로그인 오류:', error);
      return { success: false, error };
    }
  };

  const logout = () => {
    if (window.Kakao?.Auth?.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        console.log('✅ 카카오 로그아웃 완료');
      });
    }
  };

  return { login, logout, isInitialized };
};
