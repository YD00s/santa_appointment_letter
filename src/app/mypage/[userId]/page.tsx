// app/mypage/[userId]/page.tsx
import { supabase } from '@/lib/supabase/supabase';
import { Certificate } from '@/types/Certificate';
import { notFound } from 'next/navigation';

import MyPageContent from './MyPageContent';

interface PageProps {
  params: { userId: string } | Promise<{ userId: string }>;
}

export default async function MyPage(props: PageProps) {
  const { params } = props;
  const { userId } = params instanceof Promise ? await params : params;

  // 사용자 정보 조회
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('kakao_id', userId)
    .single();

  if (userError || !userData) {
    notFound();
  }

  // 마이페이지 설정
  const { data: mypageData } = await supabase
    .from('mypage')
    .select('*')
    .eq('user_id', userData.id)
    .single();

  // ✅ mypageData가 없으면 기본값으로 생성
  if (!mypageData) {
    await supabase.from('mypage').insert({
      user_id: userData.id,
      visible: true,
      wall_type: 1,
      floor_type: 1,
      object_type: 1,
    });

    // 생성 후 기본값으로 렌더링
    return (
      <MyPageContent
        pageOwner={userData}
        initialConfig={{
          wallType: 1,
          floorType: 1,
          objectType: 1,
        }}
        initialCertificates={[]}
        initialVisible={true}
      />
    );
  }

  const initialConfig = {
    wallType: mypageData.wall_type ?? 0,
    floorType: mypageData.floor_type ?? 0,
    objectType: mypageData.object_type ?? 0,
  };

  // 임명장 조회
  let certificates: Certificate[] = [];

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
      isHidden: cert.is_hidden ?? false,
    }));
  }

  return (
    <MyPageContent
      pageOwner={userData}
      initialConfig={initialConfig}
      initialCertificates={certificates}
      initialVisible={mypageData.visible ?? true} // ✅ null 체크 추가
    />
  );
}
