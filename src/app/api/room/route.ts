import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

// 특정 유저 기준으로 저장한다고 가정 (추측성)
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

export async function GET() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('user_id', MOCK_USER_ID)
    .single();

  if (error) {
    // 최초 이용 시 데이터가 없을 수 있으므로 기본값 반환
    return NextResponse.json(
      {
        wallType: 0,
        floorType: 0,
        objectType: 0,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      wallType: data.wall_type,
      floorType: data.floor_type,
      objectType: data.object_type,
    },
    { status: 200 }
  );
}

export async function PATCH(req: Request) {
  const body = await req.json();

  const { wallType, floorType, objectType } = body;

  // 유효성 검사
  if (
    typeof wallType !== 'number' ||
    typeof floorType !== 'number' ||
    typeof objectType !== 'number'
  ) {
    return NextResponse.json(
      { error: '유효하지 않은 요청입니다.' },
      { status: 400 }
    );
  }

  // upsert 사용하여 없으면 생성, 있으면 수정
  const { error } = await supabase.from('rooms').upsert({
    user_id: MOCK_USER_ID,
    wall_type: wallType,
    floor_type: floorType,
    object_type: objectType,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json(
      { error: '저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
