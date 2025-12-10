import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 쿠키 삭제
  response.cookies.delete('kakao_user_id');
  response.cookies.delete('isAuthenticated');

  return response;
}
