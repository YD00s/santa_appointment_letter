// app/api/mypage/route.ts
import {
  handleServerError,
  successResponse,
  validateParams,
} from '@/utils/server/handleServerError';
import { fetchMypageByUserId, fetchUserByKakaoId, upsertMypage } from '@/utils/server/safeFetch';
import { cookies } from 'next/headers';

// api/mypage/route.ts
export async function GET(request: Request) {
  try {
    console.log('=== GET /api/mypage 시작 ===');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('userId:', userId);

    if (!userId) {
      return handleServerError('BAD_REQUEST', 'userId 파라미터가 필요합니다.');
    }

    // kakao_id로 사용자 조회
    const { data: userData, error: userError } = await fetchUserByKakaoId(userId);

    if (userError || !userData) {
      return successResponse(null);
    }

    // user_id로 mypage 조회
    const { data: mypageData, error: mypageError } = await fetchMypageByUserId(userData.id);

    if (mypageError) {
      return handleServerError(
        'INTERNAL_ERROR',
        'mypage 조회 중 오류가 발생했습니다.',
        mypageError
      );
    }

    if (!mypageData) {
      return successResponse({
        visible: true,
        wall_type: 1,
        floor_type: 1,
        object_type: 1,
      });
    }

    return successResponse(mypageData);
  } catch (error) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', error);
  }
}

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

    if (userError || !userData) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.', userError);
    }

    const { error: upsertError } = await upsertMypage({
      user_id: userData.id,
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
