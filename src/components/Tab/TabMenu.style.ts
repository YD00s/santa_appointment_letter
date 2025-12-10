import { tv } from 'tailwind-variants';

export const tabMenuStyle = tv({
  base: 'flex gap-13 px-6',
});

export const menuGroupStyle = tv({
  base: 'group z-1 flex flex-col items-center gap-3',
  variants: {
    active: {
      true: 'child:divider-active',
      false: 'child:divider-inactive',
    },
  },
});

export const textStyle = tv({
  base: 'text-gray500 hover:text-gray700 focus:text-gray900 cursor-pointer px-1 text-[20px] duration-150',
});

export const tabMenuDividerStyle = tv({
  base: `transition-opacity duration-200`,
  variants: {
    active: {
      true: 'opacity-100',
      false: 'group-hover-within:opacity-50 opacity-0 group-focus-within:opacity-100',
    },
  },
});
