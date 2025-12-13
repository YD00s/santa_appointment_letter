import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

interface FetchUserByKakaoIdResult {
  data: { id: string } | null;
  error: Error | null;
}

// ============================================
// USERS 관련
// ============================================
// kakao_id로 users 테이블에서 UUID 조회
export async function fetchUserByKakaoId(kakaoId: string): Promise<FetchUserByKakaoIdResult> {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('id')
      .eq('kakao_id', kakaoId)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('User not found') };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// kakao_id로 user를 upsert (없으면 생성, 있으면 유지)
export async function upsertUserByKakaoId(kakaoId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .upsert({ kakao_id: kakaoId }, { onConflict: 'kakao_id' })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// ============================================
// MYPAGE 관련
// ============================================
// 회원가입 시 기본 mypage 생성
export async function createDefaultMypage(userId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('mypage')
      .insert({
        user_id: userId,
        name_tag: null,
        wall_type: 0,
        floor_type: 0,
        object_type: 0,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// user_id로 mypage 설정 조회
export async function fetchMypageByUserId(userId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('mypage')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 데이터가 없는 경우는 정상 (최초 접속)
    if (error && error.code === 'PGRST116') {
      return { data: null, error: null };
    }

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// 유저 이름 업데이트
export async function updateUserName(updateData: { user_id: string; name: string }) {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .update({ name: updateData.name })
      .eq('id', updateData.user_id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// mypage 설정 upsert
export async function upsertMypage(mypageData: {
  user_id: string;
  wall_type: number;
  floor_type: number;
  object_type: number;
}) {
  try {
    const { data, error } = await supabaseClient
      .from('mypage')
      .upsert(mypageData, { onConflict: 'user_id' })
      .select();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// ============================================
// CERTIFICATES 관련
// ============================================
// owner_id로 임명장 목록 조회 (deprecated - fetchCertificatesByMypageId 사용 권장)
export async function fetchCertificatesByOwnerId(ownerId: string) {
  console.warn(
    'fetchCertificatesByOwnerId is deprecated. Use fetchCertificatesByMypageId instead.'
  );

  try {
    // 호환성을 위해 user_id로 mypage를 찾은 후 certificates 조회
    const { data: mypageData, error: mypageError } = await supabaseClient
      .from('mypage')
      .select('id')
      .eq('user_id', ownerId)
      .single();

    if (mypageError) {
      return { data: null, error: new Error(mypageError.message) };
    }

    if (!mypageData) {
      return { data: [], error: null };
    }

    return await fetchCertificatesByMypageId(mypageData.id);
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// mypage_id로 임명장 목록 조회
export async function fetchCertificatesByMypageId(mypageId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .eq('mypage_id', mypageId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data || [], error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}

// 임명장 생성
export async function createCertificate(certificateData: {
  mypage_id: string;
  sender_name: string;
  receiver_name: string;
  santa_id: number;
  message: string;
  created_at?: string;
}) {
  try {
    const insertData: any = {
      mypage_id: certificateData.mypage_id,
      sender_name: certificateData.sender_name,
      receiver_name: certificateData.receiver_name,
      santa_id: certificateData.santa_id,
      message: certificateData.message,
    };

    if (certificateData.created_at) {
      insertData.created_at = certificateData.created_at;
    }

    const { data, error } = await supabaseClient
      .from('certificates')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error'),
    };
  }
}
