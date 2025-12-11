'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import MyPageContent from './MyPageContent';

export default function MyPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { isOwner, isLoading: authLoading } = useAuth();
  
  const [_pageOwner, setPageOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPageOwner();
  }, [userId]);

  const loadPageOwner = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('kakao_id', userId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPageOwner(data);
      }
    } catch (error) {
      console.error('페이지 주인 로드 실패:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-600">존재하지 않는 사용자입니다.</p>
        </div>
      </div>
    );
  }

  // 페이지 주인 여부와 관계없이 동일한 컴포넌트 렌더링
  // isOwner 여부를 props로 전달
  return <MyPageContent isOwner={isOwner(userId)} pageOwnerId={userId} />;
}