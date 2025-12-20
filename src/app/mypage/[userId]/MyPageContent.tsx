'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastProvider';
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
  initialVisible?: boolean;
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
  const [isVisible, setIsVisible] = useState(initialVisible);

  const { show } = useToast();
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

  const fetchVisibleStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/mypage?userId=${pageOwner.kakao_id}`);
      if (!res.ok) return;

      const result = await res.json();
      if (result.success && result.data && result.data.visible !== undefined) {
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

  const handleSelectCertificate = (cert: Certificate) => {
    if (isOwner || isVisible) {
      setSelectedCert(cert);
    } else {
      show('비공개된 작업실이에요!', 'success');
    }
  };

  const handleDelete = (certificateId: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
  };

  const handleToggleVisibility = (certificateId: string, isHidden: boolean) => {
    setCertificates(prev =>
      prev.map(cert => (cert.id === certificateId ? { ...cert, isHidden } : cert))
    );
  };

  return (
    <>
      <div className="relative z-20 flex h-170 w-full flex-col">
        <div>
          <Room
            images={currentImages}
            certificates={certificates}
            onSelectCertificate={handleSelectCertificate}
            isOwner={isOwner}
            isVisible={isVisible}
          />
        </div>

        <MyPageHeader
          isOwner={isOwner}
          initialName={pageOwner.name ?? ''}
          userId={pageOwner.kakao_id}
          isVisible={isVisible}
          onVisibilityChange={setIsVisible}
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
