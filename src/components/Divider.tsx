'use client';

import clsx from 'clsx';
import React, { CSSProperties, HTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

const style = tv({
  base: 'block rounded-full transition-colors duration-150',
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
  },
});

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { className, width = 1, orientation = 'horizontal', color = 'bg-gray100', ...props },
  ref
) {
  // 두께 동적 스타일링 적용
  const thickness = Math.max(0, Number.isFinite(width) ? width : 1);
  const dynamicStyle: CSSProperties =
    orientation === 'horizontal' ? { height: `${thickness}px` } : { width: `${thickness}px` };

  const classes = style({ orientation });

  return (
    <div
      ref={ref}
      className={clsx(classes, color, className)}
      style={dynamicStyle}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
});

export default Divider;
