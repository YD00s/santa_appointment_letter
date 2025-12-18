'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { floorImages, objectImages, wallImages } from '@/lib/constants/images';
import { Certificate } from '@/types/Certificate';
import { User } from '@/types/User';
import { useCallback, useEffect, useState } from 'react';

import CertificateModal from './components/CertificateModal';
import EditTab from './components/EditTab';
import MyPageFooter from './components/MyPageFooter/MyPageFooter';
import MyPageHeader from './components/MyPageHeader/MyPageHeader';
import Room from './components/Room';
import { useRoomConfig } from './hooks/useRoomConfig';
import { useSaveMyPageConfig } from './hooks/useSaveMyPageConfig';

type initialConfig = {
  wallType: number;
  floorType: number;
  objectType: number;
};
interface MyPageContentProps {
  pageOwner: User;
  initialConfig: initialConfig;
  initialCertificates: Certificate[];
  initialVisible?: boolean; // ✅ 초기 visible 상태 추가
}

export default function MyPageContent({
  pageOwner,
  initialConfig,
  initialCertificates,
  initialVisible = false,
}: MyPageContentProps) {
  const { user, isAuthenticated } = useAuthContext();
  const [certificates, setCertificates] = useState(initialCertificates);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVisible, setIsVisible] = useState(initialVisible); // ✅ visible 상태 관리

  const isOwner = isAuthenticated && user?.kakao_id === pageOwner.kakao_id;

  // 룸 설정
  const { config, currentImages, updateWallType, updateFloorType, updateObjectType } =
    useRoomConfig(initialConfig);

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  /** 훅 적용 */
  const { saveMyPageConfig } = useSaveMyPageConfig({
    isEditMode,
    pageOwnerId: pageOwner.kakao_id,
    wallType: config.wallType,
    floorType: config.floorType,
    objectType: config.objectType,
    toggleEditMode,
    onSuccess: () => setIsEditMode(false),
  });

  // ✅ visible 상태 동기화
  const fetchVisibleStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/mypage?userId=${pageOwner.kakao_id}`);
      if (!res.ok) return;

      const result = await res.json();
      if (result.success && result.data) {
        setIsVisible(!!result.data.visible);
      }
    } catch (err) {
      console.warn('visible 상태 조회 실패:', err);
    }
  }, [pageOwner.kakao_id]);

  useEffect(() => {
    fetchVisibleStatus();
  }, [fetchVisibleStatus]);

  const closeModal = () => setSelectedCert(null);

  // ✅ 뱃지 클릭 핸들러: 게스트이면서 visible=false일 때 차단
  const handleSelectCertificate = (cert: Certificate) => {
    // 주인이거나 visible=true면 모달 열기
    if (isOwner || isVisible) {
      setSelectedCert(cert);
    }
    // 게스트이면서 visible=false면 아무것도 안 함 (클릭 무시)
  };

  // 삭제 후 UI 업데이트 (낙관적 업데이트)
  const handleDelete = (certificateId: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
  };

  // 숨김 토글 후 UI 업데이트 (낙관적 업데이트)
  const handleToggleVisibility = (certificateId: string, isHidden: boolean) => {
    setCertificates(prev =>
      prev.map(cert => (cert.id === certificateId ? { ...cert, isHidden } : cert))
    );
  };

  return (
    <>
      <div className="relative z-20 flex h-163 w-full flex-col">
        <div>
          <Room
            images={currentImages}
            certificates={certificates}
            onSelectCertificate={handleSelectCertificate}
            isOwner={isOwner}
            isVisible={isVisible} // ✅ visible 상태 전달
          />
        </div>

        <MyPageHeader
          isOwner={isOwner}
          initialName={pageOwner.name ?? ''}
          userId={pageOwner.kakao_id}
          isVisible={isVisible}
          onVisibilityChange={setIsVisible} // ✅ visible 변경 콜백
        />

        <MyPageFooter
          isOwner={isOwner}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          onSave={saveMyPageConfig}
          userId={pageOwner.kakao_id}
        />

        {isOwner && (
          <div className="absolute -bottom-105 w-full bg-white">
            <EditTab
              isEditMode={isEditMode}
              wallImages={wallImages}
              floorImages={floorImages}
              objectImages={objectImages}
              currentWallType={config.wallType}
              currentFloorType={config.floorType}
              currentObjectType={config.objectType}
              onWallTypeChange={updateWallType}
              onFloorTypeChange={updateFloorType}
              onObjectTypeChange={updateObjectType}
            />
          </div>
        )}
      </div>
      <CertificateModal
        ownerId={pageOwner.kakao_id}
        isOwner={isOwner}
        name={pageOwner.name ?? ''}
        certificate={selectedCert}
        onClose={closeModal}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
      />
    </>
  );
}
