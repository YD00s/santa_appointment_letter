// CertificateModal.tsx
'use client';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { getSantaById } from '@/lib/constants/santaData';
import { Certificate } from '@/types/Certificate';
import formatDate from '@/utils/formDate';
import Image from 'next/image';
import { useState } from 'react';

import { useDeleteCertificate } from '../hooks/useDeleteCertificate';
import { useToggleCertificateVisibility } from '../hooks/useToggleCertificateVisibility';

interface CertificateModalProps {
  certificate: Certificate | null;
  name: string;
  onClose: () => void;
  isOwner?: boolean;
  ownerId?: string;
  onDelete?: (certificateId: string) => void; // 삭제 후 UI 업데이트용
  onToggleVisibility?: (certificateId: string, isHidden: boolean) => void; // 숨김 토글 후 UI 업데이트용
}

export default function CertificateModal({
  certificate,
  name,
  onClose,
  isOwner = false,
  ownerId,
  onDelete,
  onToggleVisibility,
}: CertificateModalProps) {
  const { deleteCertificate, isDeleting } = useDeleteCertificate();
  const { toggleVisibility, isUpdating } = useToggleCertificateVisibility();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!certificate) {
    return (
      <div>
        <span>임명장을 불러오는 데에 실패했어요🥲</span>
      </div>
    );
  }

  const santaData = getSantaById(certificate.santaId);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    if (!ownerId) {
      alert('사용자 정보를 확인할 수 없습니다.');
      return;
    }

    const success = await deleteCertificate(certificate.id, ownerId);
    if (success) {
      // 낙관적 업데이트: 삭제 성공 시 부모 컴포넌트에 알림
      onDelete?.(certificate.id);
      onClose();
    } else {
      alert('임명장 삭제에 실패했습니다.');
      setShowConfirm(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!ownerId) {
      alert('사용자 정보를 확인할 수 없습니다.');
      return;
    }

    const newIsHidden = !certificate.isHidden;
    const success = await toggleVisibility(certificate.id, newIsHidden, ownerId);

    if (success) {
      // 낙관적 업데이트: 숨김 상태 변경 성공 시 부모 컴포넌트에 알림
      onToggleVisibility?.(certificate.id, newIsHidden);
      onClose();
    } else {
      alert('임명장 상태 변경에 실패했습니다.');
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="flex w-80 flex-col items-center space-y-4">
        <div className="flex flex-col items-center">
          <span className="mb-4 text-2xl font-bold">임명장</span>
          <span className="text-gray700 my-2 w-full text-right text-sm">이름 {name}</span>
          <span className="whitespace-break-spaces text-gray-600">{santaData.miniTitle}</span>
          <span className="text-2xl font-semibold whitespace-break-spaces">{santaData.title}</span>
          <Image
            src={santaData.image}
            alt={santaData.title}
            width={200}
            height={200}
            className="mt-5 object-contain"
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-center">
          <p className="text-sm text-gray-500">From.</p>
          <h3 className="text-md font-bold text-gray-800">{certificate.senderName}</h3>
        </div>

        <div className="custom-scrollbar max-h-36 w-full overflow-y-auto rounded-lg bg-gray-50 p-4">
          <p className="text-sm whitespace-pre-wrap text-gray-700">{certificate.message}</p>
        </div>

        <p className="w-full text-left text-xs text-gray-400">
          작성일 | {formatDate(certificate.createdAt)}
        </p>

        {/* 주인만 볼 수 있는 버튼들 */}
        {isOwner && (
          <div className="flex w-full justify-end gap-2">
            <Button
              label={isUpdating ? '처리 중...' : certificate.isHidden ? '공개하기' : '나만보기'}
              variant="secondary"
              size="sm"
              onClick={handleToggleVisibility}
              disabled={isUpdating}
              className="border-gray100 border"
            />
            <Button
              label={isDeleting ? '삭제 중...' : showConfirm ? '정말 삭제..?' : '삭제'}
              variant="secondary"
              onClick={handleDelete}
              disabled={isDeleting}
              size="sm"
              className="border-gray100 border"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
