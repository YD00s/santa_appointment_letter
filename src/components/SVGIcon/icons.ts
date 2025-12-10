import IC_X from '@/assets/icons/close.svg';
import IC_Google from '@/assets/icons/google.svg';
import IC_Kakao from '@/assets/icons/kakao.svg';

export const IconMap = {
  IC_X,
  IC_Kakao,
  IC_Google,
} as const;
export type IconMapTypes = keyof typeof IconMap;

export const IconSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
} as const;

export type IconSizeTypes = keyof typeof IconSizes;

export const buttonSizeMap = {
  sm: 'sm',
  md: 'lg',
  lg: 'xl',
  full: 'md',
} as const;
