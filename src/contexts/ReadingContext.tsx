import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { READING_PLAN_2026 } from '../data/readingPlan';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'jornada2026_final_react_v1';
const FAV_STORAGE_KEY = 'jornada2026_favoritos_v1';

import { Favorito } from '../types';

interface ReadingContextType {
    leiturasConcluidas: string[];
    toggleLeitura: (key: string) => void;
    getAtrasos: () => number;
    getPercentage: () => number;
    dataNavegacao: Date;
    setDataNavegacao: (date: Date) => void;
    versaoAtual: string;
    setVersaoAtual: (version: string) => void;
    currentKey: string;
    currentReadingRaw: string | undefined;
    syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
    favoritos: Favorito[];
    toggleFavorito: (fav: Omit<Favorito, 'date'>) => void;
    getStreak: () => number;
    getMedals: () => string[];
    journalEntries: Record<string, string>;
    saveJournalEntry: (key: string, content: string) => Promise<void>;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export function ReadingProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [leiturasConcluidas, setLeiturasConcluidas] = useState<string[]>([]);
    const [dataNavegacao, setDataNavegacao] = useState<Date>(new Date());
    const [versaoAtual, setVersaoAtual] = useState<string>('almeida');
    const [favoritos, setFavoritos] = useState<Favorito[]>([]);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('offline');
    const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});

    // Load initial data from LocalStorage only if no user, or as initial state
    useEffect(() => {
        // Always load favorites from local storage for now (not synced yet)
        const loadFavorites = () => {
            const savedFavs = localStorage.getItem(FAV_STORAGE_KEY);
            if (savedFavs) {
                try {
                    setFavoritos(JSON.parse(savedFavs));
                } catch (e) {
                    console.error("Error loading favorites", e);
                }
            }
        }
        loadFavorites();

        if (!user) {
            const loadInitialData = async () => {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    try {
                        setLeiturasConcluidas(JSON.parse(saved));
                    } catch (e) {
                        console.error("Error loading progress", e);
                    }
                }
            };
            loadInitialData();
        }
    }, [user]);

    // Fetch from Supabase when user logged in
    useEffect(() => {
        if (!user || !supabase) {
            setJournalEntries({});
            return;
        }

        // Reset navigation to today on login
        setDataNavegacao(new Date());

        const fetchData = async () => {
            setSyncStatus('syncing');
            try {
                // Fetch Reading Progress
                const { data: progressData, error: progressError } = await supabase
                    .from('reading_progress')
                    .select('reading_key')
                    .eq('user_id', user.id);

                if (progressError) throw progressError;

                if (progressData) {
                    const onlineReadings = progressData.map(p => p.reading_key);
                    setLeiturasConcluidas(onlineReadings);
                }

                // Fetch Favorites
                const { data: favData, error: favError } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('user_id', user.id);

                if (favError) throw favError;

                if (favData) {
                    const mappedFavs: Favorito[] = favData.map(f => ({
                        id: f.id,
                        book_id: f.book_id,
                        book_name: f.book_name,
                        chapter: f.chapter,
                        verse: f.verse,
                        text: f.text,
                        translation: f.translation,
                        date: f.created_at
                    }));
                    setFavoritos(mappedFavs);
                }

                // Fetch Journal Entries
                const { data: journalData, error: journalError } = await supabase
                    .from('journal_entries')
                    .select('reading_key, content')
                    .eq('user_id', user.id);

                if (journalError) throw journalError;

                if (journalData) {
                    const entries: Record<string, string> = {};
                    journalData.forEach(item => {
                        entries[item.reading_key] = item.content;
                    });
                    setJournalEntries(entries);
                }
                setSyncStatus('synced');
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setSyncStatus('error');
            }
        };

        fetchData();
    }, [user]);

    const toggleLeitura = useCallback(async (key: string) => {
        // Optimistic update
        const isConcluidoOriginal = leiturasConcluidas.includes(key);
        const nextState = isConcluidoOriginal
            ? leiturasConcluidas.filter(k => k !== key)
            : [...leiturasConcluidas, key];

        setLeiturasConcluidas(nextState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));

        if (user && supabase) {
            setSyncStatus('syncing');
            try {
                if (!isConcluidoOriginal) {
                    // Adding
                    const { error } = await supabase
                        .from('reading_progress')
                        .insert([
                            { user_id: user.id, reading_key: key }
                        ]);
                    if (error) throw error;
                } else {
                    // Removing
                    const { error } = await supabase
                        .from('reading_progress')
                        .delete()
                        .eq('user_id', user.id)
                        .eq('reading_key', key);
                    if (error) throw error;
                }
                setSyncStatus('synced');
            } catch (error) {
                console.error("Error syncing reading progress:", error);
                setSyncStatus('error');
            }
        }
    }, [leiturasConcluidas, user]);

    const toggleFavorito = useCallback(async (fav: Omit<Favorito, 'date'>) => {
        // Optimistic update
        const alreadyExists = favoritos.some(f => f.book_id === fav.book_id && f.chapter === fav.chapter && f.verse === fav.verse); // Check strictly by content if ID missing? 
        // Actually the input `fav` from BibleReader/Timeline usually has ID constructed from book/chap/verse if checking local state, 
        // but let's check properly. The input might not have the UUID from Supabase yet if it's new.

        let nextState = [...favoritos];
        const existingIndex = favoritos.findIndex(f => f.book_id === fav.book_id && f.chapter === fav.chapter && f.verse === fav.verse);

        if (existingIndex >= 0) {
            nextState.splice(existingIndex, 1);
        } else {
            nextState.push({ ...fav, id: crypto.randomUUID(), date: new Date().toISOString() }); // Temp ID for UI
        }

        setFavoritos(nextState);

        if (user && supabase) {
            setSyncStatus('syncing');
            try {
                if (existingIndex >= 0) {
                    // Removing
                    const itemToRemove = favoritos[existingIndex];
                    // Delete by composite unique key (user_id, book_id, chapter, verse) to be safe
                    const { error } = await supabase
                        .from('favorites')
                        .delete()
                        .eq('user_id', user.id)
                        .eq('book_id', fav.book_id)
                        .eq('chapter', fav.chapter)
                        .eq('verse', fav.verse);
                    if (error) throw error;
                } else {
                    // Insert
                    const { error } = await supabase
                        .from('favorites')
                        .insert([{
                            user_id: user.id,
                            book_id: fav.book_id,
                            book_name: fav.book_name,
                            chapter: fav.chapter,
                            verse: fav.verse,
                            text: fav.text,
                            translation: fav.translation
                        }]);
                    if (error) throw error;
                }
                setSyncStatus('synced');
            } catch (err) {
                console.error("Error syncing favorites:", err);
                setSyncStatus('error');
            }
        } else {
            // Local fallback
            localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(nextState));
        }
    }, [favoritos, user]);

    const getAtrasos = useCallback(() => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        let count = 0;

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

    const saveJournalEntry = async (key: string, content: string) => {
        if (!user) return;

        setSyncStatus('syncing');

        if (supabase) {
            const { error } = await supabase
                .from('journal_entries')
                .upsert({
                    user_id: user.id,
                    reading_key: key,
                    content: content,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id, reading_key' });

            if (error) {
                console.error("Error saving journal entry", error);
                setSyncStatus('error');
            } else {
                setJournalEntries(prev => ({ ...prev, [key]: content }));
                setSyncStatus('synced');
            }
        } else {
            // Offline fallback
            setJournalEntries(prev => ({ ...prev, [key]: content }));
            setSyncStatus('offline');
        }
    };

    const currentKey = String(dataNavegacao.getDate()).padStart(2, '0') + '/' + String(dataNavegacao.getMonth() + 1).padStart(2, '0');
    const currentReadingRaw = READING_PLAN_2026[currentKey];

    return (
        <ReadingContext.Provider value={{
            leiturasConcluidas,
            toggleLeitura,
            getAtrasos,
            getPercentage,
            dataNavegacao,
            setDataNavegacao,
            versaoAtual,
            setVersaoAtual,
            currentKey,
            currentReadingRaw,
            syncStatus,
            favoritos,
            toggleFavorito,
            getStreak: () => {
                let streak = 0;
                let date = new Date();
                date.setHours(0, 0, 0, 0);

                while (true) {
                    const d = String(date.getDate()).padStart(2, '0');
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const key = `${d}/${m}`;
                    if (leiturasConcluidas.includes(key)) {
                        streak++;
                        date.setDate(date.getDate() - 1);
                    } else {
                        // If it's today and not read yet, don't break the streak immediately
                        const todayKey = String(new Date().getDate()).padStart(2, '0') + '/' + String(new Date().getMonth() + 1).padStart(2, '0');
                        if (key === todayKey && streak === 0) {
                            // Check yesterday
                            date.setDate(date.getDate() - 1);
                            continue;
                        }
                        break;
                    }
                }
                return streak;
            },
            getMedals: () => {
                const medals = [];
                // Pentateuco
                const pentateuco = ['01/01', '02/01', '03/01', '04/01', '05/01']; // Simplified for now, real check would involve readingPlan entries
                const hasPentateuco = pentateuco.every(k => leiturasConcluidas.includes(k));
                if (hasPentateuco) medals.push('pentateuco');

                if (leiturasConcluidas.length >= 30) medals.push('30dias');
                if (leiturasConcluidas.length >= 1) medals.push('primeira');

                return medals;
            },
            journalEntries,
            saveJournalEntry
        }}>
            {children}
        </ReadingContext.Provider>
    );
}

export function useReading() {
    const context = useContext(ReadingContext);
    if (context === undefined) {
        throw new Error('useReading must be used within a ReadingProvider');
    }
    return context;
}
