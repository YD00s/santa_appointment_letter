'use client';

import { supabase } from '@/lib/supabase/supabase';
import { useEffect, useState } from 'react';

interface PageOwnerInfo {
  name: string | null;
  kakaoId: string;
}

export function usePageOwner(userId: string) {
  const [ownerInfo, setOwnerInfo] = useState<PageOwnerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        setIsLoading(true);

        // 1. users 테이블에서 기본 정보 조회
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, kakao_id, name')
          .eq('kakao_id', userId)
          .single();

        if (userError || !userData) {
          console.error('사용자 정보 조회 실패:', userError);
          setOwnerInfo(null);
          return;
        }

        // 2. mypage 테이블에서 name_tag 조회
        const { data: mypageData } = await supabase
          .from('mypage')
          .select('name_tag')
          .eq('user_id', userData.id)
          .single();

        // name_tag 우선, 없으면 users.name 사용
        const displayName = mypageData?.name_tag || userData.name || null;

        setOwnerInfo({
          name: displayName,
          kakaoId: userData.kakao_id,
        });
      } catch (error) {
        console.error('페이지 오너 정보 조회 중 오류:', error);
        setOwnerInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchOwnerInfo();
    }
  }, [userId]);

  return { ownerInfo, isLoading };
}
