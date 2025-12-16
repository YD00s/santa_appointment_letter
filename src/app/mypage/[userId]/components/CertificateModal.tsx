'use client';

import Modal from '@/components/Modal/Modal';
import { getSantaById } from '@/lib/constants/santaData';
import { Certificate } from '@/types/Certificate';
import formatDate from '@/utils/formDate';
import Image from 'next/image';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export default function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  if (!certificate) {
    return (
      <div>
        <span>임명장을 불러오는 데에 실패했어요🥲</span>
      </div>
    );
  }
  const santaData = getSantaById(certificate.santaId);

  return (
    <Modal open={true} onClose={onClose}>
      <div className="flex w-80 flex-col items-center space-y-4">
        <div className="flex flex-col items-center">
          <span className="mb-4 text-2xl font-bold">임명장</span>
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

        <div className="w-full rounded-lg bg-gray-50 p-4">
          <p className="text-sm whitespace-pre-wrap text-gray-700">{certificate.message}</p>
        </div>

        <p className="w-full text-left text-xs text-gray-400">
          작성일 | {formatDate(certificate.createdAt)}
        </p>
      </div>
    </Modal>
  );
}
