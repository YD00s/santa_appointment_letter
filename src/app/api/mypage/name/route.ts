import {
  handleServerError,
  successResponse,
  validateParams,
} from '@/utils/server/handleServerError';
import { fetchUserByKakaoId, updateUserName } from '@/utils/server/safeFetch';
import { cookies } from 'next/headers';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, name } = body;

    const validation = validateParams(body, ['userId', 'name']);
    if (!validation.valid) {
      return handleServerError(
        'BAD_REQUEST',
        `필수 파라미터가 누락되었습니다: ${validation.missing.join(', ')}`
      );
    }

    if (typeof name !== 'string' || name.trim() === '' || name.length > 6) {
      return handleServerError('BAD_REQUEST', '이름표는 1~6자 문자열이어야 합니다.');
    }

    const cookieStore = await cookies();
    const loggedInKakaoId = cookieStore.get('kakao_id')?.value;

    if (!loggedInKakaoId) {
      return handleServerError('UNAUTHORIZED', '로그인이 필요합니다.');
    }

    if (loggedInKakaoId !== userId) {
      return handleServerError('FORBIDDEN', '본인만 수정할 수 있습니다.');
    }

    const { data: userData, error: userError } = await fetchUserByKakaoId(userId);

    if (userError || !userData) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.', userError);
    }

    // mypage의 name_tag 업데이트 (users.name이 아님!)
    const { error: updateError } = await updateUserName({
      user_id: userData.id,
      name: name.trim(),
    });

    if (updateError) {
      return handleServerError(
        'INTERNAL_ERROR',
        '이름표 저장 중 오류가 발생했습니다.',
        updateError
      );
    }

    return successResponse({ success: true });
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}
