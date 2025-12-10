import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버 전용 키 사용
);

export async function POST(request: NextRequest) {
  try {
    const { kakaoId, email, nickname, profileImage } = await request.json();

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          kakao_id: kakaoId,
          email,
          nickname,
          profile_image: profileImage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'kakao_id' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
