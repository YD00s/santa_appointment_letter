'use client';

import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'inline-flex items-center justify-between rounded-full border px-4 py-2 shadow-md transition-all duration-150 ease-out',
  variants: {
    variant: {
      success: 'bg-green50 border-green700',
      error: 'bg-red50 border-red500',
    },
    visible: {
      true: 'translate-y-0 opacity-100',
      false: 'translate-y-2 opacity-0',
    },
  },
});

export type ToastVariant = 'success' | 'error';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  message: React.ReactNode;
  duration?: number;
  variant?: ToastVariant;
  onClose: (id: string) => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { id, message, duration = 500, variant = 'success', className, onClose, ...rest },
  ref
) {
  const [visible, setVisible] = useState(false);
  // 등장
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  // 자동 닫기
  useEffect(() => {
    if (duration <= 0) return;

    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 100);
    }, duration);

    return () => clearTimeout(t);
  }, [duration, id, onClose]);

  const classes = style({ variant, visible });

  return (
    <div ref={ref} className={clsx(className, classes)} role="status" aria-live="polite" {...rest}>
      <div className="flex-1">{message}</div>
    </div>
  );
});

export default Toast;
