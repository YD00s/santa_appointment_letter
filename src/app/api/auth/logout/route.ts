import { successResponse } from '@/utils/server/handleServerError';

// 로그아웃
export async function POST() {
  const response = successResponse({ success: true });

  // 쿠키 삭제
  response.cookies.delete('kakao_id');
  response.cookies.delete('isAuthenticated');
  response.cookies.delete('authProvider');

  return response;
}
