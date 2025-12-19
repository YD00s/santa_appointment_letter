import { NextRequest, NextResponse } from 'next/server';

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: '인가 코드가 없습니다.' }, { status: 400 });
  }

  try {
    /**
     * 1. 인가 코드 → 액세스 토큰 요청
     */
    const tokenRes = await fetch(KAKAO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error('카카오 토큰 발급 실패');
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    /**
     * 2. 액세스 토큰 → 카카오 사용자 정보 조회
     */
    const userRes = await fetch(KAKAO_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      throw new Error('카카오 사용자 정보 조회 실패');
    }

    const userData = await userRes.json();
    const kakaoId = userData.id;

    /**
     * 3. 내부 사용자 저장 API 호출
     */
    const saveRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/kakao/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kakaoId }),
    });

    if (!saveRes.ok) {
      throw new Error('사용자 저장 실패');
    }

    /**
     * 4. 로그인 완료 후 리다이렉트
     */
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL));
  } catch (error) {
    console.error('Kakao callback error:', error);

    return NextResponse.redirect(new URL('/login?error=kakao', process.env.NEXT_PUBLIC_BASE_URL));
  }
}
