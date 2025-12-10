'use client';

export const useGoogleLogin = () => {
  const login = async () => {
    try {
      // TODO: 실제 구글 OAuth 로직 구현
      // 1. Google OAuth 클라이언트 초기화
      // 2. 구글 로그인 팝업
      // 3. ID Token 받기
      // 4. 백엔드로 토큰 전송하여 사용자 정보 저장

      console.log('구글 로그인 시도...');

      // 임시: 데모용으로 바로 성공 처리
      return { success: true, provider: 'google' };
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      return { success: false, error };
    }
  };

  return { login };
};
