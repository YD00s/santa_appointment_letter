import { useState } from 'react';

export function useDeleteCertificate() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCertificate = async (certificateId: string, ownerId: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/certificates?id=${certificateId}&ownerId=${ownerId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '임명장 삭제에 실패했습니다.');
      }

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Delete certificate error:', err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteCertificate,
    isDeleting,
    error,
  };
}
