// src/app/api/auth/kakao/callback/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/, ''))
    );
  }

  try {
    // 1. 인가 코드 → 액세스 토큰 요청
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
      const errorData = await tokenRes.text();
      console.error('카카오 토큰 발급 실패:', errorData);
      throw new Error('카카오 토큰 발급 실패');
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. 액세스 토큰 → 카카오 사용자 정보 조회
    const userRes = await fetch(KAKAO_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      const errorData = await userRes.text();
      console.error('카카오 사용자 정보 조회 실패:', errorData);
      throw new Error('카카오 사용자 정보 조회 실패');
    }

    const userData = await userRes.json();
    const kakaoId = String(userData.id);

    // 3. Supabase에 사용자 저장 (직접 처리)
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('kakao_id', kakaoId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116은 "not found" 에러
      console.error('사용자 조회 오류:', selectError);
      throw new Error('사용자 조회 실패');
    }

    if (!existingUser) {
      // 신규 사용자 생성 - .select()로 생성된 user 정보 받기
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          kakao_id: kakaoId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('사용자 생성 오류:', insertError);
        throw new Error('사용자 생성 실패');
      }

      // 신규 사용자면 mypage도 함께 생성
      if (newUser) {
        const { error: mypageError } = await supabase.from('mypage').insert({
          user_id: newUser.id,
          visible: true,
          wall_type: 1,
          floor_type: 1,
          object_type: 1,
        });

        if (mypageError) {
          console.error('마이페이지 생성 오류:', mypageError);
          // 에러가 나도 로그인은 진행 (나중에 수동으로 생성 가능)
        }
      }
    }

    // 4. 로그인 완료 후 리다이렉트
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/, '');
    return NextResponse.redirect(new URL('/', baseUrl));
  } catch (error) {
    console.error('Kakao callback error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!.replace(/\/$/, '');
    return NextResponse.redirect(new URL('/login?error=kakao', baseUrl));
  }
}
