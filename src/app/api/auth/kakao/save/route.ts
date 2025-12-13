import {
  handleServerError,
  successResponse,
  validateParams,
} from '@/utils/server/handleServerError';
import { createDefaultMypage, upsertUserByKakaoId } from '@/utils/server/safeFetch';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 파라미터 검증
    const validation = validateParams(body, ['kakaoId']);
    if (!validation.valid) {
      return handleServerError('BAD_REQUEST', 'kakaoId 파라미터가 필요합니다.');
    }

    const { kakaoId } = body;

    // 사용자 upsert
    const { data: userData, error: userError } = await upsertUserByKakaoId(kakaoId);

    if (userError) {
      return handleServerError(
        'INTERNAL_ERROR',
        '사용자 정보 저장 중 오류가 발생했습니다.',
        userError
      );
    }

    // mypage 자동 생성 (이미 존재하면 무시)
    const { error: mypageError } = await createDefaultMypage(userData!.id);

    if (mypageError) {
      console.error('Mypage creation error:', mypageError);
      // mypage 생성 실패해도 사용자는 생성되었으므로 계속 진행
    }

    return successResponse({ success: true, user: userData });
  } catch (error) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', error);
  }
}
