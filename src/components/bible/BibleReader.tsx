import React, { useEffect, useState } from 'react';
import { useReading } from '../../contexts/ReadingContext';
import { fetchBibleText, parseReadingPlan } from '../../services/bibleService';
import { BIBLE_MAP, BOOK_OVERVIEWS } from '../../data/bibleData';
import { CircleAlert as AlertCircle, Video, CircleCheck as CheckCircle, Heart, Instagram } from 'lucide-react';
import { cn } from '../../utils/cn';
import { StoryMaker } from './StoryMaker';
import { DAILY_VIDEOS } from '../../data/mediaData';
import { InfographicTimeline } from './InfographicTimeline';
import { SpiritualJournal } from './SpiritualJournal';
import { motion, AnimatePresence } from 'framer-motion';

interface VerseItemProps {
    v: any;
    vIdx: number;
    cap: any;
    versaoAtual: string;
    favoritos: any[];
    toggleFavorito: (verse: any) => void;
    setStoryVerse: (verse: { verse: string; ref: string } | null) => void;
    activeVerse: string | null;
    setActiveVerse: (id: string | null) => void;
}

const VerseItem: React.FC<VerseItemProps> = ({
    v,
    vIdx,
    cap,
    versaoAtual,
    favoritos,
    toggleFavorito,
    setStoryVerse,
    activeVerse,
    setActiveVerse
}) => {
    const favId = `${cap.meta.sigla}:${cap.meta.cap}:${v.verse}:${versaoAtual}`;
    const isFav = favoritos.some(f =>
        f.book_id === cap.meta.sigla &&
        f.chapter === cap.meta.cap &&
        f.verse === v.verse &&
        f.translation === versaoAtual
    );
    const [lastTap, setLastTap] = useState(0);

    const handleGesture = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation(); // Prevent the global click listener from immediately closing it
        const now = Date.now();
        const delta = now - lastTap;

        if (delta > 0 && delta < 350) {
            setActiveVerse(prev => prev === favId ? null : favId);
            setLastTap(0);
        } else {
            setLastTap(now);
        }
    };

    return (
        <span
            key={vIdx}
            className={cn(
                "inline mr-2 group cursor-default transition-all px-1.5 py-0.5 rounded-lg relative select-none",
                isFav ? "bg-rose-100/30 text-rose-900 ring-1 ring-rose-200/50 shadow-sm" : "hover:bg-slate-100/30"
            )}
            onClick={handleGesture}
        >
            <sup className={cn(
                "font-sans font-black mr-1 text-[11px] transition-colors",
                isFav ? "text-rose-500" : "text-sky-300 group-hover:text-sky-400"
            )}>
                {v.verse}
            </sup>
            {v.text.trim()}

            <AnimatePresence>
                {activeVerse === favId && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                        className="absolute left-1/2 -bottom-14 -translate-x-1/2 flex items-center gap-4 bg-white border border-slate-200 p-2.5 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.12)] z-20 ring-1 ring-slate-100 whitespace-nowrap"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorito({
                                    id: favId,
                                    book_id: cap.meta.sigla,
                                    book_name: cap.bookName,
                                    chapter: cap.meta.cap,
                                    verse: v.verse,
                                    text: v.text.trim(),
                                    translation: versaoAtual
                                });
                            }}
                            className="hover:scale-110 active:scale-95 transition-all p-1.5"
                        >
                            <Heart className={cn("w-[19px] h-[19px]", isFav ? "fill-red-500 text-red-500" : "text-slate-400")} />
                        </button>
                        <div className="w-px h-5 bg-slate-100" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setStoryVerse({ verse: v.text.trim(), ref: `${cap.bookName} ${cap.meta.cap}:${v.verse}` });
                            }}
                            className="hover:scale-110 active:scale-95 transition-all p-1.5"
                        >
                            <Instagram className="w-[19px] h-[19px] text-slate-400 hover:text-sky-500" />
                        </button>
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
};

export const BibleReader: React.FC = () => {
    const {
        currentReadingRaw,
        versaoAtual,
        currentKey,
        toggleLeitura,
        leiturasConcluidas,
        favoritos,
        toggleFavorito,
        journalEntries,
        saveJournalEntry
    } = useReading();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bibleContent, setBibleContent] = useState<any[]>([]);
    const [storyVerse, setStoryVerse] = useState<{ verse: string; ref: string } | null>(null);
    const [activeVerse, setActiveVerse] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = () => setActiveVerse(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        if (currentReadingRaw) {
            loadBibleText();
        }
    }, [currentReadingRaw, versaoAtual]);

    async function loadBibleText(retries = 5) {
        setLoading(true);
        setError(null);
        try {
            const queries = parseReadingPlan(currentReadingRaw || "");
            const promises = queries.map(async (q) => {
                const bookName = BIBLE_MAP[q.sigla]?.name || q.sigla;

                let attempt = 0;
                while (attempt < retries) {
                    try {
                        const data = await fetchBibleText(`${bookName} ${q.cap}`, versaoAtual);
                        return { ...data, meta: q, bookName };
                    } catch (e: any) {
                        attempt++;
                        console.error(`Attempt ${attempt} failed for ${bookName} ${q.cap}:`, e.message);
                        if (attempt === retries) throw e;
                        await new Promise(r => setTimeout(r, 800 * attempt));
                    }
                }
            });
            const results = await Promise.all(promises);
            setBibleContent(results);
        } catch (e: any) {
            setError(e.message || "Erro ao carregar o texto bíblico. Verifique sua conexão ou tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-400 rounded-full animate-spin mb-4"></div>
            <p className="font-medium animate-pulse">Sintonizando Escrituras...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-100 mb-4 bg-red-500 rounded-full p-2" />
            <p className="text-slate-800 font-bold text-lg mb-2">Ops! Algo deu errado.</p>
            <p className="text-slate-500 max-w-xs mb-6">{error}</p>
            <button onClick={loadBibleText} className="px-6 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">Tentar Novamente</button>
        </div>
    );

    const isConcluido = leiturasConcluidas.includes(currentKey);

    return (
        <div
            className="h-full scroll-smooth overflow-y-auto pb-40 lg:pb-32"
            onScroll={(e) => {
                const target = e.currentTarget;
                window.dispatchEvent(new CustomEvent('bible-scroll', {
                    detail: { scrollTop: target.scrollTop }
                }));
            }}
        >
            <InfographicTimeline currentDay={currentKey} />
            <div className="pt-8 px-6 md:px-12">
                <div className="max-w-3xl mx-auto">
                    {bibleContent.map((cap, idx) => {
                        const isNewBook = cap.meta.cap === 1;
                        const bookInfo = isNewBook ? (BOOK_OVERVIEWS[cap.meta.sigla] || BOOK_OVERVIEWS['Default']) : null;

                        const bookNameText = cap.bookName;
                        let specialPart = bookNameText.charAt(0);
                        let restOfName = bookNameText.slice(1);

                        if (/^[1-3]\s+[A-Za-zÀ-ÿ]/.test(bookNameText)) {
                            specialPart = bookNameText.slice(0, 3);
                            restOfName = bookNameText.slice(3);
                        }

                        const isFirstChapter = idx === 0;

                        return (
                            <div key={idx} className={`mb-2 ${isFirstChapter ? 'mt-2' : 'mt-8'}`}>
                                {bookInfo && (
                                    <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 border border-sky-200 rounded-[2.5rem] p-8 md:p-10 mb-12 shadow-sm mt-4 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                                        <div className="relative z-10">
                                            <h2 className="font-serif text-4xl text-sky-900 mb-2">{bookInfo.title}</h2>
                                            <p className="text-sky-800/70 mb-8 text-base italic leading-relaxed">{bookInfo.desc}</p>
                                            {bookInfo.videoId && (
                                                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-10 bg-black ring-8 ring-white/50">
                                                    <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${bookInfo.videoId}`} frameBorder="0" allowFullScreen></iframe>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                                <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-sky-100 shadow-sm">
                                                    <span className="block text-[10px] uppercase font-black text-sky-600 mb-1.5 tracking-[0.15em]">Tema Principal</span>
                                                    <span className="text-slate-800 text-sm font-bold leading-tight">{bookInfo.theme}</span>
                                                </div>
                                                <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-sky-100 shadow-sm">
                                                    <span className="block text-[10px] uppercase font-black text-sky-600 mb-1.5 tracking-[0.15em]">Versículo Chave</span>
                                                    <span className="text-slate-800 text-sm italic leading-tight font-medium">"{bookInfo.key}"</span>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <span className="w-6 h-0.5 bg-sky-400 rounded-full" /> Contexto Histórico
                                                    </h4>
                                                    <p className="text-slate-700 text-[15px] leading-relaxed pl-8">{bookInfo.context}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-sky-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <span className="w-6 h-0.5 bg-sky-400 rounded-full" /> Cristo em {bookInfo.title}
                                                    </h4>
                                                    <p className="text-slate-700 text-[15px] leading-relaxed pl-8">{bookInfo.christ}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={`flex justify-between items-end border-b-2 border-slate-100 pb-2 mb-6 gap-2`}>
                                    <h3 className="flex items-baseline gap-1.5 text-slate-800 overflow-visible">
                                        {isFirstChapter ? (
                                            <>
                                                <span className="font-manuscript text-7xl text-sky-500 leading-[0.8] select-none inline-block px-1 overflow-visible whitespace-nowrap">{specialPart}</span>
                                                <span className="font-serif text-4xl font-black tracking-tight text-slate-900">{restOfName} {cap.meta.cap}</span>
                                            </>
                                        ) : (
                                            <span className="font-serif text-2xl font-black tracking-tight text-slate-700">{cap.bookName} {cap.meta.cap}</span>
                                        )}
                                    </h3>
                                    {isFirstChapter && (
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1.5">
                                            {versaoAtual === 'almeida' ? 'Almeida' : 'KJV'}
                                        </div>
                                    )}
                                </div>

                                <div className="font-serif text-xl leading-[1.8] text-slate-700 space-y-4 text-justify">
                                    {cap.verses.map((v: any, vIdx: number) => (
                                        <VerseItem
                                            key={vIdx}
                                            v={v}
                                            vIdx={vIdx}
                                            cap={cap}
                                            versaoAtual={versaoAtual}
                                            favoritos={favoritos}
                                            toggleFavorito={toggleFavorito}
                                            setStoryVerse={setStoryVerse}
                                            activeVerse={activeVerse}
                                            setActiveVerse={setActiveVerse}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <div className="mt-20 flex flex-col items-center">
                        <button
                            onClick={() => toggleLeitura(currentKey)}
                            className={`group relative flex items-center justify-center gap-4 px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl overflow-hidden ${isConcluido ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-100' : 'bg-sky-500 text-white hover:bg-sky-600 hover:scale-105 active:scale-95 shadow-sky-500/30'}`}
                        >
                            <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${isConcluido ? 'bg-emerald-500 border-emerald-200 text-white' : 'border-white/30 group-hover:border-white text-transparent'}`}>
                                {isConcluido && <CheckCircle className="w-5 h-5 fill-current" />}
                            </div>
                            {isConcluido ? 'Leitura Concluída!' : 'Concluir Leitura de Hoje'}
                            {!isConcluido && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </button>
                        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {isConcluido ? 'Você completou este desafio!' : 'Sincronizado automaticamente com sua conta'}
                        </p>
                    </div>

                    <SpiritualJournal
                        currentKey={currentKey}
                        initialValue={journalEntries[currentKey] || ""}
                        onSave={(note) => saveJournalEntry(currentKey, note)}
                    />

                    <div className="mt-24 pt-16 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <h4 className="flex items-center gap-3 text-2xl font-black text-slate-900">
                                <Video className="w-7 h-7 text-red-500" /> Aprofundamento
                            </h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Conteúdo Extra</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {(DAILY_VIDEOS[currentKey] || []).map((v, i) => (
                                <div key={i} className="bg-white border-2 border-slate-50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                                    <div className="aspect-video bg-slate-900 relative">
                                        <iframe className="w-full h-full relative z-10" src={`https://www.youtube.com/embed/${v.id}`} frameBorder="0" allowFullScreen></iframe>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                    <div className="p-6">
                                        <h5 className="font-black text-base text-slate-900 line-clamp-2 mb-2 leading-tight group-hover:text-red-600 transition-colors">{v.title}</h5>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                                                {v.channel.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{v.channel}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!DAILY_VIDEOS[currentKey] || DAILY_VIDEOS[currentKey].length === 0) && (
                                <div className="col-span-full py-12 px-8 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                                    <p className="text-slate-400 font-bold italic tracking-wide">Sem vídeos extras recomendados para este trecho cronológico.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {storyVerse && (
                    <StoryMaker
                        verse={storyVerse.verse}
                        reference={storyVerse.ref}
                        onClose={() => setStoryVerse(null)}
                    />
                )}
            </div>
        </div>
    );
};
