'use client';

import Button, { ButtonProps } from '@/components/Button/Button';

interface AuthButtonsProps extends ButtonProps {
  onKakaoLogin: () => void;
  // onGoogleLogin: () => void;
}

export default function AuthButtons({ onKakaoLogin }: AuthButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        icon="IC_Kakao"
        variant="kakao"
        label="카카오톡으로 시작하기"
        radius="full"
        size="full"
        onClick={onKakaoLogin}
        className="hover:shadow-md"
      />
      {/* <Button
        icon="IC_Google"
        variant="google"
        label="구글로 시작하기"
        radius="full"
        size="full"
        onClick={onGoogleLogin}
        className="hover:shadow-md"
      /> */}
      <p className="mt-4 text-center text-xs text-gray-500">
        로그인 시 <span className="cursor-pointer underline">이용약관</span> 및{' '}
        <span className="cursor-pointer underline">개인정보처리방침</span>에 동의하게 됩니다
      </p>
    </div>
  );
}
