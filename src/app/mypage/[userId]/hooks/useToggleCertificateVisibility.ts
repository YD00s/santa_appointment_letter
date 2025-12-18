// hooks/useToggleCertificateVisibility.ts
import { useState } from 'react';

export function useToggleCertificateVisibility() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleVisibility = async (
    certificateId: string,
    isHidden: boolean,
    ownerId: string
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('/api/certificates', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: certificateId,
          isHidden,
          ownerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '임명장 상태 변경에 실패했습니다.');
      }

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Toggle visibility error:', err);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    toggleVisibility,
    isUpdating,
    error,
  };
}
