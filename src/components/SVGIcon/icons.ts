import IC_X from '@/assets/icons/close.svg';
import IC_Edit from '@/assets/icons/edit.svg';
import IC_Google from '@/assets/icons/google.svg';
import IC_Home from '@/assets/icons/home.svg';
import IC_Info from '@/assets/icons/info.svg';
import IC_Kakao from '@/assets/icons/kakao.svg';
import IC_LeftArrow from '@/assets/icons/left_arrow.svg';
import IC_Logout from '@/assets/icons/logout.svg';
import IC_RighttArrow from '@/assets/icons/right_arrow.svg';

export const IconMap = {
  IC_X,
  IC_Logout,
  IC_Edit,
  IC_Kakao,
  IC_Google,
  IC_LeftArrow,
  IC_RighttArrow,
  IC_Home,
  IC_Info,
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
