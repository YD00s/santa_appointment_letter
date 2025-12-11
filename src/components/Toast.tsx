'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';
import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'inline-flex items-center justify-between rounded-full px-4 py-2 shadow-md',
  variants: {
    variant: {
      success: 'bg-white',
      error: 'bg-red50',
    },
  }
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
  { id, message, duration = 3000, variant = 'success', className, onClose, ...rest },
  ref
) {
  // 자동 닫기
  useEffect(() => {
    if (duration > 0) {
      const t = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(t);
    }
  }, [duration, id, onClose]);

  const classes = style({ variant });

  return (
    <div ref={ref} className={clsx(className, classes)} role="status" aria-live="polite" {...rest}>
      <div className="flex-1">{message}</div>
    </div>
  );
});

export default Toast;
