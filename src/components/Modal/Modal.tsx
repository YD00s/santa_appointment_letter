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
