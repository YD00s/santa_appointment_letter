'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { floorImages, objectImages, wallImages } from '@/lib/constants/images';
import { Certificate } from '@/types/Certificate';
import { User } from '@/types/User';
import { useState } from 'react';

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
}

export default function MyPageContent({
  pageOwner,
  initialConfig,
  initialCertificates,
}: MyPageContentProps) {
  const { user, isAuthenticated } = useAuthContext();
  const [certificates] = useState(initialCertificates);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const closeModal = () => setSelectedCert(null);

  return (
    <>
      <div className="relative z-20 flex h-163 w-full flex-col">
        <div>
          <Room
            images={currentImages}
            certificates={certificates}
            onSelectCertificate={setSelectedCert}
          />
        </div>

        <MyPageHeader
          isOwner={isOwner}
          initialName={pageOwner.name ?? ''}
          userId={pageOwner.kakao_id}
          certificateCount={certificates.length}
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
      <CertificateModal certificate={selectedCert} onClose={closeModal} />
    </>
  );
}
