'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Toast from '@/components/Toast';
import { createPortal } from 'react-dom';

interface ToastItem {
  id: string;
  message: React.ReactNode;
  variant: 'success' | 'error';
  duration: number;
}

interface ToastContextType {
  show: (message: React.ReactNode, variant?: 'success' | 'error', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(()=>{
    setMounted(true);
  },[]);

  const show = useCallback((message: React.ReactNode, variant: 'success' | 'error' = 'success', duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, variant, duration }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
    {mounted&& createPortal(
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9999 flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={remove} />
        ))}
      </div>,document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
