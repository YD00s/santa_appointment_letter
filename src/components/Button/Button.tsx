'use client';

import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { IconMapTypes, buttonSizeMap } from '@/components/SVGIcon/icons';
import { clsx } from 'clsx';
import Link from 'next/link';
import React from 'react';

import { style } from './Button.style';

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled' | 'onClick'
> {
  className?: string;
  icon?: IconMapTypes;
  label?: string;
  variant?: 'primary' | 'secondary' | 'kakao' | 'google';
  radius?: 'md' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      icon,
      label,
      variant = 'primary',
      radius = 'md',
      size = 'md',
      disabled = false,
      onClick,
      href,
      ...rest
    },
    ref
  ) => {
    const classes = style({
      variant,
      radius,
      size,
      disabled,
    });

    const content = (
      <div className="flex items-center gap-x-1">
        {icon && <SVGIcon icon={icon} size={buttonSizeMap[size]} />}
        <span className={icon ? 'pr-1' : ''}>{label}</span>
      </div>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={clsx(classes, className)}
          aria-disabled={disabled}
          onClick={disabled ? e => e.preventDefault() : onClick}
          {...(rest as any)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={clsx(classes, className)}
        disabled={disabled}
        aria-disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
