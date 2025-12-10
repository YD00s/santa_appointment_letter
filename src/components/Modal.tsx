'use client';
import clsx from 'clsx';
import { PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg',
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
