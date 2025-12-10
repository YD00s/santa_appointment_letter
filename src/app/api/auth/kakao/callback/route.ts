import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // 1. 액세스 토큰 요청
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
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

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || '토큰 발급 실패');
    }

    const { access_token } = tokenData;

    // 2. 사용자 정보 요청
    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error('사용자 정보 조회 실패');
    }

    // 3. 여기서 DB에 사용자 정보 저장하거나 JWT 생성
    // const user = await prisma.user.upsert({
    //   where: { kakaoId: userData.id.toString() },
    //   update: { ... },
    //   create: { ... }
    // });

    // 4. 쿠키 설정 (임시로 클라이언트에서 설정)
    const response = NextResponse.redirect(new URL('/?login=success', request.url));

    // 실제로는 HttpOnly 쿠키로 JWT 저장
    response.cookies.set('kakao_user_id', userData.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return response;
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    return NextResponse.redirect(new URL('/?error=kakao_login_failed', request.url));
  }
}
