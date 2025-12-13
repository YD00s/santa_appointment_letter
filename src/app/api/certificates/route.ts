// certificates/route.ts
import {
  handleServerError,
  successResponse,
  validateParams,
} from '@/utils/server/handleServerError';
import {
  createCertificate,
  fetchCertificatesByMypageId,
  fetchMypageByUserId,
  fetchUserByKakaoId,
} from '@/utils/server/safeFetch';

/**
 * GET /api/certificates?userId={kakao_id}
 * 특정 mypage의 임명장 목록 조회
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kakaoId = searchParams.get('userId');

  if (!kakaoId) {
    return handleServerError('BAD_REQUEST', 'userId 파라미터가 필요합니다.');
  }

  // 1. kakao_id로 사용자 조회
  const { data: userData, error: userError } = await fetchUserByKakaoId(kakaoId);

  if (userError) {
    console.log('User not found, returning empty array');
    return successResponse([]);
  }

  // 2. user_id로 mypage 조회
  const { data: mypageData, error: mypageError } = await fetchMypageByUserId(userData!.id);

  if (mypageError || !mypageData) {
    console.log('Mypage not found, returning empty array');
    return successResponse([]);
  }

  // 3. mypage_id로 임명장 목록 조회
  const { data: certificates, error: certError } = await fetchCertificatesByMypageId(mypageData.id);

  if (certError) {
    return handleServerError('INTERNAL_ERROR', '임명장 조회 중 오류가 발생했습니다.', certError);
  }

  return successResponse(certificates || []);
}

/**
 * POST /api/certificates
 * 임명장 생성 (로그인 필요 없음 - 방문자도 가능)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderName, message, ownerId, receiverName, santaId, createdAt } = body;

    // 필수 파라미터 확인
    const validation = validateParams(body, [
      'senderName',
      'message',
      'ownerId',
      'receiverName',
      'santaId',
    ]);
    if (!validation.valid) {
      return handleServerError(
        'BAD_REQUEST',
        `필수 파라미터 누락: ${validation.missing.join(', ')}`
      );
    }

    // 메시지 길이 체크
    if (message.trim().length > 200) {
      return handleServerError('BAD_REQUEST', '메시지는 200자 이내로 작성해주세요.');
    }

    // santaId 범위 체크
    if (santaId < 1 || santaId > 8) {
      return handleServerError('BAD_REQUEST', 'santaId는 1~8 사이의 값이어야 합니다.');
    }

    // 1. kakao_id로 사용자 조회
    const { data: userData, error: userError } = await fetchUserByKakaoId(ownerId);
    if (userError || !userData) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.', userError);
    }

    // 2. user_id로 mypage 조회
    const { data: mypageData, error: mypageError } = await fetchMypageByUserId(userData.id);
    if (mypageError || !mypageData) {
      return handleServerError('NOT_FOUND', '마이페이지를 찾을 수 없습니다.', mypageError);
    }

    // 3. 임명장 생성
    const { data, error } = await createCertificate({
      mypage_id: mypageData.id,
      sender_name: senderName.trim(),
      receiver_name: receiverName.trim(),
      santa_id: santaId,
      message: message.trim(),
      created_at: createdAt || new Date().toISOString(),
    });

    if (error) {
      return handleServerError('INTERNAL_ERROR', '임명장 생성 중 오류가 발생했습니다.', error);
    }

    return successResponse({ ok: true, data }, 201);
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}
