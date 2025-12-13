'use client';

import IconButton from '@/components/IconButton/IconButton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastProvider';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const { setAuthStatus } = useAuthContext();
  const { show } = useToast();
  return (
    <IconButton
      icon="IC_Logout"
      variant="secondary"
      ariaLabel="로그아웃"
      onClick={async e => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          setAuthStatus(false);
          router.push('/');
        } catch {
          show('⚠️ 로그아웃에 실패했습니다.', 'error');
        }

        (e.currentTarget as HTMLButtonElement | null)?.blur();
      }}
    />
  );
}
