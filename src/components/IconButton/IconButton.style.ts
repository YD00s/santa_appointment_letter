import { tv } from 'tailwind-variants';

export const style = tv({
  base: 'flex cursor-pointer items-center justify-center rounded-full transition-all duration-150',
  variants: {
    variant: {
      primary: 'bg-btn-primary text-btn-primary',
      secondary: 'bg-btn-secondary text-btn-secondary',
      tertiary: 'bg-btn-tertiary text-btn-tertiary',
      ghost: 'bg-btn-ghost text-btn-ghost',
      kakao: 'bg-btn-kakao text-btn-kakao',
    },
    size: {
      sm: 'h-8 w-8',
      md: 'h-9 w-9',
      lg: 'h-10 w-10',
    },
    disabled: {
      true: 'pointer-events-none cursor-not-allowed opacity-30',
      false: '',
    },
  },
});
