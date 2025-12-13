import { getRandomNameTag } from '@/lib/constants/nameTags';
import { supabase } from '@/lib/supabase/supabase';
import { Certificate } from '@/types/Certificate';
import { cookies as nextCookies } from 'next/headers';

import MyPageContent from './MyPageContent';

interface PageProps {
  params: { userId: string } | Promise<{ userId: string }>;
}

export default async function MyPage(props: PageProps) {
  const { params } = props;
  const { userId } = params instanceof Promise ? await params : params;

  try {
    // 사용자 정보 조회
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('kakao_id', userId)
      .single();

    if (userError || !userData) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
            <p className="text-gray-600">존재하지 않는 사용자입니다.</p>
          </div>
        </div>
      );
    }

    // 2. 마이페이지 설정
    const { data: mypageData } = await supabase
      .from('mypage')
      .select('*')
      .eq('user_id', userData.id)
      .single();

    const initialConfig = {
      wallType: mypageData?.wall_type ?? 0,
      floorType: mypageData?.floor_type ?? 0,
      objectType: mypageData?.object_type ?? 0,
    };

    // 본인 여부
    const cookieStore = await nextCookies();
    const kakaoId = cookieStore.get('kakao_id')?.value ?? null;
    const isOwner = kakaoId === userId;

    // 임명장 조회
    let certificates: Certificate[] = [];

    if (mypageData) {
      const { data: certData } = await supabase
        .from('certificates')
        .select('*')
        .eq('mypage_id', mypageData.id)
        .order('created_at', { ascending: false });

      if (certData && Array.isArray(certData)) {
        certificates = certData.map(cert => ({
          id: cert.id,
          mypageId: cert.mypage_id,
          senderName: cert.sender_name,
          receiverName: cert.receiver_name,
          message: cert.message || '',
          santaId: cert.santa_id,
          createdAt: cert.created_at,
        }));
      }
    }

    return (
      <MyPageContent
        pageOwner={userData}
        initialConfig={initialConfig}
        initialCertificates={certificates}
      />
    );
  } catch (err) {
    console.error('페이지 로드 실패:', err);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">페이지를 불러오는 중 오류 발생</h1>
        </div>
      </div>
    );
  }
}
