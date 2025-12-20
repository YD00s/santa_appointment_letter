'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import React from 'react';

import SVGIcon from '../SVGIcon/SVGIcon';
import { IconMapTypes, buttonSizeMap } from '../SVGIcon/icons';
import { style } from './IconButton.style';

export interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onClick'
> {
  className?: string;
  icon: IconMapTypes; // icon 타입을 .svg 파일로 강제
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'kakao';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      variant = 'primary',
      size = 'md',
      disabled = false,
      ariaLabel,
      href,
      onClick,
      ...rest
    },
    ref
  ) => {
    // STYLES
    const classes = style({ variant, size, disabled });

    if (href) {
      return (
        <Link
          href={href}
          className={clsx(classes, className)}
          aria-disabled={disabled}
          onClick={disabled ? e => e.preventDefault() : onClick}
          {...(rest as any)}
        >
          <SVGIcon icon={icon} size={buttonSizeMap[size]} className="shrink-0" aria-hidden="true" />
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={clsx(classes, className)}
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={onClick}
        {...rest}
      >
        <SVGIcon icon={icon} size={buttonSizeMap[size]} className="shrink-0" aria-hidden="true" />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
export default IconButton;
