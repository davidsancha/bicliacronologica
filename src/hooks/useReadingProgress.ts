
import { useState, useEffect, useCallback } from 'react';
import { READING_PLAN_2026 } from '../constants';

const STORAGE_KEY = 'jornada2026_final_react_v1';

export function useReadingProgress() {
  const [leiturasConcluidas, setLeiturasConcluidas] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLeiturasConcluidas(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading progress", e);
      }
    }
  }, []);

  const toggleLeitura = useCallback((key: string) => {
    setLeiturasConcluidas(prev => {
      const isConcluido = prev.includes(key);
      const next = isConcluido ? prev.filter(k => k !== key) : [...prev, key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getAtrasos = useCallback(() => {
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    let count = 0;
    
    // Iterate through year until yesterday
    const iter = new Date(hoje.getFullYear(), 0, 1);
    while (iter < hoje) {
      const d = String(iter.getDate()).padStart(2, '0');
      const m = String(iter.getMonth() + 1).padStart(2, '0');
      const key = `${d}/${m}`;
      
      if (READING_PLAN_2026[key] && !leiturasConcluidas.includes(key)) {
        count++;
      }
      iter.setDate(iter.getDate() + 1);
    }
    return count;
  }, [leiturasConcluidas]);

  const getPercentage = useCallback(() => {
    const total = 365;
    const lidos = leiturasConcluidas.length;
    return Math.round((lidos / total) * 100);
  }, [leiturasConcluidas]);

  return {
    leiturasConcluidas,
    toggleLeitura,
    getAtrasos,
    getPercentage
  };
}
