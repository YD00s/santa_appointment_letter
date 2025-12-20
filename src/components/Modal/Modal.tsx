'use client';
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import IconButton from '../IconButton/IconButton';
import {
  modalBodyStyle,
  modalContentStyle,
  modalHeaderStyle,
  modalOverlayStyle,
} from './Modal.style';

interface Props {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  ariaLabel = 'Modal Window',
  children,
  className,
}: PropsWithChildren<Props>) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // 포털 렌더링을 위한 div 체크
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let portalDiv = document.getElementById('modal-root');
      if (!portalDiv) {
        portalDiv = document.createElement('div');
        portalDiv.id = 'modal-root';
        document.body.appendChild(portalDiv);
      }
      setPortalElement(portalDiv);
    }
  }, []);

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (open) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body 스크롤 막기
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // 클린업: 모달 닫힐 때 원래대로
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // 원래 스크롤 위치로 복원
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;
  if (!portalElement) return null;

  return createPortal(
    <div className={modalOverlayStyle()} role="dialog" aria-label={ariaLabel} onClick={onClose}>
      <div className={clsx(modalContentStyle(), className)} onClick={e => e.stopPropagation()}>
        <div className={modalHeaderStyle()}>
          <IconButton icon="IC_X" variant="ghost" ariaLabel="모달 닫기" onClick={onClose} />
        </div>
        <div className={modalBodyStyle()}>{children}</div>
      </div>
    </div>,
    portalElement
  );
}
