// src/app/api/mypage/visible/route.ts
import { handleServerError, successResponse } from '@/utils/server/handleServerError';
import { fetchUserByKakaoId, updateMyPageVisibility } from '@/utils/server/safeFetch';
import { cookies } from 'next/headers';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, visible } = body;

    if (!userId || typeof visible !== 'boolean') {
      return handleServerError(
        'BAD_REQUEST',
        '필수 파라미터(userId, visible)가 누락되었거나 형식이 잘못되었습니다.'
      );
    }

    // 본인 확인 (쿠키 기반)
    const cookieStore = await cookies();
    const loggedInKakaoId = cookieStore.get('kakao_id')?.value;

    if (!loggedInKakaoId || loggedInKakaoId !== userId) {
      return handleServerError('FORBIDDEN', '본인만 수정할 수 있습니다.');
    }

    // kakao_id로 유저 UUID 조회
    const { data: userData, error: userError } = await fetchUserByKakaoId(userId);
    if (userError || !userData) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.');
    }

    // ✅ userData.id (UUID)를 전달해야 함!
    const { error: updateError } = await updateMyPageVisibility({
      userId: userData.id, // ✅ UUID 전달
      visible,
    });

    if (updateError) {
      return handleServerError('INTERNAL_ERROR', updateError.message, updateError);
    }

    return successResponse({ visible });
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}
