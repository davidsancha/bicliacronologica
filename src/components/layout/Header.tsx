import React, { useState, useEffect } from 'react';
import { Menu, CircleCheck as CheckCircle, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Zap, Loader2, Cloud, CloudOff, CircleAlert as AlertCircle, Search as SearchIcon, Heart } from 'lucide-react';
import { useReading } from '../../contexts/ReadingContext';
import { StoryMaker } from '../bible/StoryMaker';
import { SearchTool } from './SearchTool';
import { useAuth } from '../../contexts/AuthContext';
import { BIBLE_MAP } from '../../data/bibleData';
import { READING_PLAN_2026 } from '../../data/readingPlan';
import { parseReadingPlan } from '../../services/bibleService';
import { Favorito } from '../../types';
import { ProfileMenu } from './ProfileMenu';

interface HeaderProps {
    onMenuClick: () => void;
    onEditProfile?: () => void;
    isFavoritesOpen?: boolean;
    setIsFavoritesOpen?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
    onMenuClick,
    onEditProfile,
    isFavoritesOpen,
    setIsFavoritesOpen
}) => {
    const { user, profile, isProfileComplete } = useAuth();
    const {
        dataNavegacao,
        setDataNavegacao,
        currentKey,
        currentReadingRaw,
        leiturasConcluidas,
        toggleLeitura,
        versaoAtual,
        setVersaoAtual,
        syncStatus,
        favoritos,
        toggleFavorito
    } = useReading();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [storyVerse, setStoryVerse] = useState<{ verse: string; ref: string } | null>(null);

    const handleGoToFavorite = (fav: Favorito) => {
        const dayEntries = Object.entries(READING_PLAN_2026);
        for (const [key, plan] of dayEntries) {
            const queries = parseReadingPlan(plan);
            const found = queries.some(q => q.sigla === fav.book_id && q.cap === fav.chapter);
            if (found) {
                const [d, m] = key.split('/').map(Number);
                const targetDate = new Date(2026, m - 1, d);
                setDataNavegacao(targetDate);
                setIsFavoritesOpen?.(false);
                setIsProfileOpen(false);
                return;
            }
        }
    };

    const [dayPart, setDayPart] = useState('');
    const [monthPart, setMonthPart] = useState('');
    const [yearPart, setYearPart] = useState('');

    useEffect(() => {
        if (!isNaN(dataNavegacao.getTime())) {
            const d = String(dataNavegacao.getDate()).padStart(2, '0');
            const m = String(dataNavegacao.getMonth() + 1).padStart(2, '0');
            const y = String(dataNavegacao.getFullYear());

            const activeEl = document.activeElement;
            const activeClass = activeEl?.className;
            const isSafe = typeof activeClass === 'string';

            if (dayPart !== d && (!isSafe || !activeClass.includes('day-input'))) setDayPart(d);
            if (monthPart !== m && (!isSafe || !activeClass.includes('month-input'))) setMonthPart(m);
            if (yearPart !== y && (!isSafe || !activeClass.includes('year-input'))) setYearPart(y);
        }
    }, [dataNavegacao]);

    const currentReadingFull = React.useMemo(() => {
        if (!currentReadingRaw) return "Sem Leitura";
        return currentReadingRaw.split(';').map(part => {
            const p = part.trim();
            const espacoIdx = p.indexOf(' ');
            if (espacoIdx === -1) return p;
            const sigla = p.substring(0, espacoIdx);
            const resto = p.substring(espacoIdx);
            if (BIBLE_MAP[sigla]) return BIBLE_MAP[sigla].name + resto;
            return p;
        }).join('; ');
    }, [currentReadingRaw]);

    const formattedWeekday = React.useMemo(() => {
        const wd = dataNavegacao.toLocaleDateString('pt-BR', { weekday: 'long' });
        const day = dataNavegacao.getDate();
        return (wd.charAt(0).toUpperCase() + wd.slice(1)) + ", " + String(day).padStart(2, '0');
    }, [dataNavegacao]);

    const formattedDateFull = React.useMemo(() => {
        const day = dataNavegacao.toLocaleDateString('pt-BR', { day: '2-digit' });
        const month = dataNavegacao.toLocaleDateString('pt-BR', { month: 'long' });
        return `${day} de ${month}`;
    }, [dataNavegacao]);

    const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';
    const avatarUrl = profile?.avatar_url;

    const handleMudarDia = (delta: number) => {
        const next = new Date(dataNavegacao);
        next.setDate(next.getDate() + delta);
        setDataNavegacao(next);
    };

    const updateDateFromParts = (d: string, m: string, y: string) => {
        const day = parseInt(d);
        const month = parseInt(m);
        const year = parseInt(y);
        if (!isNaN(day) && day > 0 && day <= 31 && !isNaN(month) && month > 0 && month <= 12 && !isNaN(year) && year >= 2000 && year <= 2100) {
            const newDate = new Date(year, month - 1, day);
            if (!isNaN(newDate.getTime()) && newDate.getDate() === day) setDataNavegacao(newDate);
        }
    };

    const handleSegmentChange = (part: 'day' | 'month' | 'year', value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (part === 'day') {
            const v = cleaned.slice(0, 2);
            setDayPart(v);
            if (v.length > 0) updateDateFromParts(v, monthPart, yearPart);
        } else if (part === 'month') {
            const v = cleaned.slice(0, 2);
            setMonthPart(v);
            if (v.length > 0) updateDateFromParts(dayPart, v, yearPart);
        } else {
            const v = cleaned.slice(0, 4);
            setYearPart(v);
            if (v.length === 4) updateDateFromParts(dayPart, monthPart, v);
        }
    };

    const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) {
            const [year, month, day] = val.split('-').map(Number);
            setDataNavegacao(new Date(year, month - 1, day));
        }
    };

    const SyncIcon = () => {
        switch (syncStatus) {
            case 'syncing': return <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />;
            case 'synced': return <Cloud className="w-3.5 h-3.5 text-emerald-400 hover:text-emerald-500 transition-colors" />;
            case 'error': return <AlertCircle className="w-3.5 h-3.5 text-red-400" title="Erro na sincronização" />;
            case 'offline': return <CloudOff className="w-3.5 h-3.5 text-slate-300" title="Modo Offline" />;
            default: return null;
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-2 lg:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-4 z-[50] shadow-sm sticky top-0">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 min-w-0 w-full lg:w-auto">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <button className="lg:hidden p-2 -ml-2 text-slate-400" onClick={onMenuClick}><Menu className="w-6 h-6" /></button>
                    <div className="hidden sm:block border-r border-slate-100 pr-4 lg:pr-6 mr-2 text-left shrink-0">
                        <div className="text-xs font-bold text-slate-800 mb-0.5">{formattedWeekday}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                            {formattedDateFull}
                            <SyncIcon />
                        </div>
                    </div>
                    <h1 className="text-lg md:text-2xl font-bold text-slate-900 truncate flex-1">{currentReadingFull}</h1>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <button
                        onClick={() => toggleLeitura(currentKey)}
                        className={`flex items-center justify-center gap-2 px-4 py-1.5 lg:py-2.5 rounded-xl font-bold text-xs transition-all flex-1 lg:flex-none ${leiturasConcluidas.includes(currentKey) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm' : 'bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100'}`}
                    >
                        {leiturasConcluidas.includes(currentKey) ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                        {leiturasConcluidas.includes(currentKey) ? 'Concluída' : 'Marcar Lido'}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 flex-wrap lg:flex-nowrap justify-between lg:justify-end w-full lg:w-auto overflow-x-auto lg:overflow-visible no-scrollbar pb-1 lg:pb-0">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 flex items-center justify-center min-w-[70px]">
                    <select className="bg-transparent text-[10px] md:text-xs font-bold text-sky-500 focus:outline-none cursor-pointer text-center w-full" value={versaoAtual} onChange={(e) => setVersaoAtual(e.target.value)}>
                        <option value="almeida">JFA</option><option value="kjv">KJV</option>
                    </select>
                </div>

                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-sm min-w-max">
                    <button onClick={() => handleMudarDia(-1)} className="p-1.5 text-slate-400 hover:text-sky-500 rounded-lg transition-all"><ChevronLeft className="w-4 h-4" /></button>
                    <div className="flex items-center gap-0 px-1 select-none grow justify-center">
                        <input type="text" value={dayPart} onFocus={(e) => e.target.select()} onChange={(e) => handleSegmentChange('day', e.target.value)} className="day-input bg-transparent text-[10px] md:text-xs font-bold text-slate-700 w-[2.2ch] text-center outline-none" />
                        <span className="text-slate-300 font-bold mx-0.5">/</span>
                        <input type="text" value={monthPart} onFocus={(e) => e.target.select()} onChange={(e) => handleSegmentChange('month', e.target.value)} className="month-input bg-transparent text-[10px] md:text-xs font-bold text-slate-700 w-[2.2ch] text-center outline-none" />
                        <span className="text-slate-300 font-bold mx-0.5">/</span>
                        <input type="text" value={yearPart} onFocus={(e) => e.target.select()} onChange={(e) => handleSegmentChange('year', e.target.value)} className="year-input bg-transparent text-[10px] md:text-xs font-bold text-slate-700 w-[4.2ch] text-center outline-none" />
                    </div>
                    <button onClick={() => handleMudarDia(1)} className="p-1.5 text-slate-400 hover:text-sky-500 rounded-lg transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="relative shrink-0">
                        <button type="button" className="flex items-center justify-center p-2 bg-white border border-slate-200 text-slate-400 hover:text-sky-500 rounded-xl shadow-sm"><CalendarIcon className="w-4 h-4" /></button>
                        <input type="date" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" onChange={handlePickerChange} />
                    </div>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center justify-center p-2 bg-white border border-slate-200 text-slate-400 hover:text-sky-500 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                        <SearchIcon className="w-4 h-4" />
                    </button>

                    <button onClick={() => setDataNavegacao(new Date())} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-amber-300 text-amber-500 rounded-xl text-[10px] md:text-xs font-bold hover:bg-amber-50 transition-colors shadow-sm shrink-0">
                        <Zap className="w-3.5 h-3.5 fill-current" /> <span className="hidden sm:inline">Hoje</span>
                    </button>
                </div>

                <div
                    className="relative shrink-0 ml-1 hidden lg:block"
                    onMouseLeave={() => setIsProfileOpen(false)}
                >
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 p-1 lg:p-1 lg:pr-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group relative"
                    >
                        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                            ) : (
                                firstName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 hidden lg:inline">{firstName}</span>

                        {!isProfileComplete && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-white rounded-full animate-bounce" />
                        )}
                    </button>

                    <ProfileMenu
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                        onOpenFavorites={() => setIsFavoritesOpen?.(true)}
                        onEditProfile={onEditProfile}
                    />
                </div>
            </div>

            {/* Favorites Modal */}
            {
                isFavoritesOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFavoritesOpen(false)} />
                        <div className="relative bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <div className="p-2.5 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                                            <Heart className="w-6 h-6 fill-current" />
                                        </div>
                                        Seus Favoritos
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{favoritos.length} Versículos Guardados</p>
                                </div>
                                <button
                                    onClick={() => setIsFavoritesOpen?.(false)}
                                    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    <Zap className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                                {favoritos.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Heart className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-800 mb-2">Ainda não há favoritos</h4>
                                        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">Clique em um versículo enquanto estiver lendo para guardá-lo aqui permanentemente.</p>
                                    </div>
                                ) : (
                                    favoritos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((fav) => (
                                        <div key={fav.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-sky-100 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest rounded-full">{fav.translation}</span>
                                                    <h5 className="font-serif text-lg font-black text-slate-900">{fav.book_name} {fav.chapter}:{fav.verse}</h5>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => setStoryVerse({ verse: fav.text, ref: `${fav.book_name} ${fav.chapter}:${fav.verse}` })}
                                                        className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"
                                                        title="Compartilhar no Story"
                                                    >
                                                        <SearchIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleFavorito(fav)}
                                                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Remover dos favoritos"
                                                    >
                                                        <Heart className="w-4 h-4 fill-current" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="font-serif text-base leading-relaxed text-slate-600 italic">"{fav.text}"</p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Adicionado em {new Date(fav.date).toLocaleDateString('pt-BR')}</span>
                                                <button
                                                    onClick={() => handleGoToFavorite(fav)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600 flex items-center gap-1 opacity-100 transition-all"
                                                >
                                                    Ir para o capítulo <ChevronRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {
                storyVerse && (
                    <StoryMaker
                        verse={storyVerse.verse}
                        reference={storyVerse.ref}
                        onClose={() => setStoryVerse(null)}
                    />
                )
            }

            <SearchTool
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onNavigate={(sigla, cap) => {
                    const dayEntries = Object.entries(READING_PLAN_2026);
                    for (const [key, plan] of dayEntries) {
                        const queries = parseReadingPlan(plan);
                        const found = queries.some(q => q.sigla === sigla && q.cap === cap);
                        if (found) {
                            const [d, m] = key.split('/').map(Number);
                            const targetDate = new Date(2026, m - 1, d);
                            setDataNavegacao(targetDate);
                            return;
                        }
                    }
                }}
            />
        </header >
    );
};

