// certificates/route.ts
import {
  handleServerError,
  successResponse,
  validateParams,
} from '@/utils/server/handleServerError';
import {
  createCertificate,
  deleteCertificate,
  fetchCertificatesByMypageId,
  fetchMypageByUserId,
  fetchUserByKakaoId,
  updateCertificate,
} from '@/utils/server/safeFetch';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kakaoId = searchParams.get('userId');

  if (!kakaoId) {
    return handleServerError('BAD_REQUEST', 'userId 파라미터가 필요합니다.');
  }

  // kakao_id로 사용자 조회
  const { data: userData, error: userError } = await fetchUserByKakaoId(kakaoId);
  if (userError) {
    console.log('User not found, returning empty array');
    return successResponse([]);
  }

  // user_id로 mypage 조회
  const { data: mypageData, error: mypageError } = await fetchMypageByUserId(userData!.id);
  if (mypageError || !mypageData) {
    console.log('Mypage not found, returning empty array');
    return successResponse([]);
  }

  // mypage_id로 임명장 목록 조회
  const { data: certificates, error: certError } = await fetchCertificatesByMypageId(mypageData.id);
  if (certError) {
    return handleServerError('INTERNAL_ERROR', '임명장 조회 중 오류가 발생했습니다.', certError);
  }

  const formattedCertificates = (certificates || []).map((cert: any) => ({
    id: cert.id,
    mypageId: cert.mypage_id,
    senderName: cert.sender_name,
    receiverName: cert.receiver_name,
    santaId: cert.santa_id,
    message: cert.message,
    isHidden: cert.is_hidden,
    createdAt: cert.created_at,
  }));

  return successResponse(formattedCertificates);
}

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

    const formattedData = data
      ? {
          id: data.id,
          mypageId: data.mypage_id,
          senderName: data.sender_name,
          receiverName: data.receiver_name,
          santaId: data.santa_id,
          message: data.message,
          isHidden: data.is_hidden,
          createdAt: data.created_at,
        }
      : null;

    return successResponse({ ok: true, data: formattedData }, 201);
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateId = searchParams.get('id');
    const ownerId = searchParams.get('ownerId');

    if (!certificateId || !ownerId) {
      return handleServerError('BAD_REQUEST', 'id와 ownerId 파라미터가 필요합니다.');
    }

    // 쿠키에서 로그인한 사용자의 kakao_id 확인
    const cookieStore = await cookies();
    const loggedInKakaoId = cookieStore.get('kakao_id')?.value;

    if (!loggedInKakaoId) {
      return handleServerError('UNAUTHORIZED', '로그인이 필요합니다.');
    }

    // 본인 확인
    if (loggedInKakaoId !== ownerId) {
      return handleServerError('FORBIDDEN', '본인만 삭제할 수 있습니다.');
    }

    // 추가 권한 체크: 해당 임명장이 실제로 본인의 것인지 확인
    const { data: userData } = await fetchUserByKakaoId(ownerId);
    if (!userData) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.');
    }

    const { data: mypageData } = await fetchMypageByUserId(userData.id);
    if (!mypageData) {
      return handleServerError('NOT_FOUND', '마이페이지를 찾을 수 없습니다.');
    }

    // 삭제 시도 - mypage_id도 함께 체크
    const { data, error } = await deleteCertificate(certificateId, mypageData.id);

    if (error) {
      return handleServerError('INTERNAL_ERROR', '임명장 삭제 중 오류가 발생했습니다.', error);
    }

    if (!data || data.length === 0) {
      return handleServerError('NOT_FOUND', '임명장을 찾을 수 없거나 삭제 권한이 없습니다.');
    }

    return successResponse({ ok: true, message: '임명장이 삭제되었습니다.' });
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isHidden, ownerId } = body;

    const validation = validateParams(body, ['id', 'isHidden', 'ownerId']);
    if (!validation.valid) {
      return handleServerError(
        'BAD_REQUEST',
        `필수 파라미터 누락: ${validation.missing.join(', ')}`
      );
    }

    if (typeof isHidden !== 'boolean') {
      return handleServerError('BAD_REQUEST', 'isHidden은 boolean이어야 합니다.');
    }

    // 쿠키에서 로그인한 사용자의 kakao_id 확인
    const cookieStore = await cookies();
    const loggedInKakaoId = cookieStore.get('kakao_id')?.value;

    if (!loggedInKakaoId) {
      return handleServerError('UNAUTHORIZED', '로그인이 필요합니다.');
    }

    // 본인 확인
    if (loggedInKakaoId !== ownerId) {
      return handleServerError('FORBIDDEN', '본인만 수정할 수 있습니다.');
    }

    // 추가 권한 체크
    const { data: userData } = await fetchUserByKakaoId(ownerId);
    if (!userData) {
      return handleServerError('NOT_FOUND', '사용자를 찾을 수 없습니다.');
    }

    const { data: mypageData } = await fetchMypageByUserId(userData.id);
    if (!mypageData) {
      return handleServerError('NOT_FOUND', '마이페이지를 찾을 수 없습니다.');
    }

    // 업데이트 시도
    const { data, error } = await updateCertificate(id, { is_hidden: isHidden }, mypageData.id);

    if (error) {
      return handleServerError('INTERNAL_ERROR', '임명장 수정 중 오류가 발생했습니다.', error);
    }

    if (!data) {
      return handleServerError('NOT_FOUND', '임명장을 찾을 수 없거나 수정 권한이 없습니다.');
    }

    // snake_case를 camelCase로 변환
    const formattedData = {
      id: data.id,
      mypageId: data.mypage_id,
      senderName: data.sender_name,
      receiverName: data.receiver_name,
      santaId: data.santa_id,
      message: data.message,
      isHidden: data.is_hidden,
      createdAt: data.created_at,
    };

    return successResponse({
      ok: true,
      message: isHidden ? '임명장이 숨겨졌습니다.' : '임명장이 공개되었습니다.',
      data: formattedData,
    });
  } catch (err) {
    return handleServerError('INTERNAL_ERROR', '서버 오류가 발생했습니다.', err);
  }
}
