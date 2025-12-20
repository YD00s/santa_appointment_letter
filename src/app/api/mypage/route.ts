// app/api/mypage/route.ts
import {
  handleServerError,
  successResponse,
  validateParams,
} from '@/utils/server/handleServerError';
import { fetchMypageByUserId, fetchUserByKakaoId, upsertMypage } from '@/utils/server/safeFetch';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kakaoId = searchParams.get('userId');

  if (!kakaoId) {
    return handleServerError('BAD_REQUEST', 'userId 파라미터가 필요합니다.');
  }

  // 1. kakao_id로 사용자 조회
  const { data: userData, error: userError } = await fetchUserByKakaoId(kakaoId);

  if (userError) {
    return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.', userError);
  }

  // 2. mypage 설정 조회
  const { data: mypageData, error: mypageError } = await fetchMypageByUserId(userData!.id);

  if (mypageError) {
    return handleServerError('INTERNAL_ERROR', '설정 조회 중 오류가 발생했습니다.', mypageError);
  }

  // 데이터가 없으면 기본값 반환
  if (!mypageData) {
    return successResponse({
      wallType: 1,
      floorType: 1,
      objectType: 1,
      visible: false, // ✅ 기본값 추가
    });
  }

  return successResponse({
    wallType: mypageData.wall_type,
    floorType: mypageData.floor_type,
    objectType: mypageData.object_type,
    visible: mypageData.visible ?? false, // ✅ visible 필드 추가
  });
}

/**
 * PATCH /api/mypage
 * 마이페이지 설정 저장
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, wallType, floorType, objectType } = body;

    // 필수 파라미터 검증
    const validation = validateParams(body, ['userId', 'wallType', 'floorType', 'objectType']);
    if (!validation.valid) {
      return handleServerError(
        'BAD_REQUEST',
        `필수 파라미터가 누락되었습니다: ${validation.missing.join(', ')}`
      );
    }

    // 타입 검증
    if (
      typeof wallType !== 'number' ||
      typeof floorType !== 'number' ||
      typeof objectType !== 'number'
    ) {
      return handleServerError('BAD_REQUEST', '유효하지 않은 데이터 타입입니다.');
    }

    // 본인 확인
    const cookieStore = await cookies();
    const loggedInKakaoId = cookieStore.get('kakao_id')?.value;

    if (!loggedInKakaoId) {
      return handleServerError('UNAUTHORIZED', '로그인이 필요합니다.');
    }

    if (loggedInKakaoId !== userId) {
      return handleServerError('FORBIDDEN', '본인만 수정할 수 있습니다.');
    }

    // 사용자 UUID 조회
    const { data: userData, error: userError } = await fetchUserByKakaoId(userId);

    if (userError) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.', userError);
    }

    // mypage 설정 upsert
    const { error: upsertError } = await upsertMypage({
      user_id: userData!.id,
      wall_type: wallType,
      floor_type: floorType,
      object_type: objectType,
    });

    if (upsertError) {
      return handleServerError('INTERNAL_ERROR', '저장 중 오류가 발생했습니다.', upsertError);
    }

    return successResponse({ success: true });
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}
