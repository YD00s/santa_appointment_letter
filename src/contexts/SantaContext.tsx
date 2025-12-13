'use client';
import { SantaId } from '@/lib/constants/santaData';
import { ReactNode, createContext, useContext, useState } from 'react';

type SantaResult = {
  santaId: SantaId;
  title: string;
  description: string;
  santaScores: Record<SantaId, number>;
};

type SantaContextType = {
  result: SantaResult | null;
  setResult: (result: SantaResult) => void;
  answers: Record<number, number>;
  setAnswers: (answers: Record<number, number>) => void;
};

const SantaContext = createContext<SantaContextType | undefined>(undefined);

export function SantaProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<SantaResult | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <SantaContext.Provider value={{ result, setResult, answers, setAnswers }}>
      {children}
    </SantaContext.Provider>
  );
}

export function useSanta() {
  const context = useContext(SantaContext);
  if (!context) {
    throw new Error('useSanta must be used within SantaProvider');
  }
  return context;
}
