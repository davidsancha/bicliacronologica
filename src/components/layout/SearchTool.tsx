import React, { useState, useMemo } from 'react';
import { Search, X, Book, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BIBLE_MAP } from '../../data/bibleData';
import { cn } from '../../utils/cn';

interface SearchToolProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (bookSigla: string, chapter: number) => void;
}

export const SearchTool: React.FC<SearchToolProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<'all' | 'old' | 'new'>('all');

    const searchResults = useMemo(() => {
        if (query.length < 3) return [];

        const lowered = query.toLowerCase();
        const results: any[] = [];

        // Search in BIBLE_MAP (Books and potentially themes)
        Object.entries(BIBLE_MAP).forEach(([sigla, book]) => {
            const matchesName = book.name.toLowerCase().includes(lowered);
            const matchesSigla = sigla.toLowerCase() === lowered;

            if (matchesName || matchesSigla) {
                results.push({
                    type: 'book',
                    id: sigla,
                    title: book.name,
                    subtitle: `${(book as any).chapters || '?'} capítulos`,
                    sigla: sigla
                });
            }
        });

        // Add some "Thematic" suggestions for demo (real would use a bigger index)
        const themes = [
            { theme: 'Amor', ref: '1 Coríntios 13', sigla: '1CO', cap: 13 },
            { theme: 'Fé', ref: 'Hebreus 11', sigla: 'HEB', cap: 11 },
            { theme: 'Criação', ref: 'Gênesis 1', sigla: 'GN', cap: 1 },
            { theme: 'Salvação', ref: 'João 3', sigla: 'JO', cap: 3 },
            { theme: 'Paz', ref: 'Filipenses 4', sigla: 'FP', cap: 4 },
        ];

        themes.forEach(t => {
            if (t.theme.toLowerCase().includes(lowered)) {
                results.push({
                    type: 'theme',
                    id: `theme-${t.theme}`,
                    title: t.theme,
                    subtitle: t.ref,
                    sigla: t.sigla,
                    cap: t.cap
                });
            }
        });

        return results.slice(0, 10);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Search Bar Container */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative flex items-center">
                                <Search className="absolute left-6 w-6 h-6 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Pesquisar por livro, tema ou versículo..."
                                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 pl-16 pr-20 text-xl font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:border-sky-500 transition-all shadow-inner"
                                />
                                <div className="absolute right-4 flex items-center gap-2">
                                    {query && (
                                        <button
                                            onClick={() => setQuery("")}
                                            className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                    <kbd className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black border border-slate-200 uppercase">ESC</kbd>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                            {query.length < 3 ? (
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                                        <Sparkles className="w-10 h-10 text-sky-200" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 mb-2">O que você procura?</h4>
                                    <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">Digite o nome de um livro ou um tema (ex: Amor, Fé, Paz) para começar a busca.</p>

                                    <div className="mt-10 flex flex-wrap justify-center gap-3">
                                        {['Salmos', 'Jesus', 'Gênesis', 'Parábolas', 'Sabedoria'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setQuery(t)}
                                                className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 transition-all"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 space-y-2">
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultados Encontrados</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-sky-500 uppercase cursor-pointer hover:opacity-70"><Filter size={12} /> Filtros</span>
                                                </div>
                                            </div>
                                            {searchResults.map((res) => (
                                                <motion.button
                                                    key={res.id}
                                                    whileHover={{ x: 8, backgroundColor: '#f8fafc' }}
                                                    onClick={() => {
                                                        onNavigate(res.sigla, res.cap || 1);
                                                        onClose();
                                                    }}
                                                    className="w-full flex items-center justify-between p-5 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all text-left"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                                                            res.type === 'book' ? "bg-sky-500 text-white" : "bg-amber-500 text-white"
                                                        )}>
                                                            {res.type === 'book' ? <Book size={24} /> : <Sparkles size={24} />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-black text-slate-800 tracking-tight">{res.title}</span>
                                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{res.subtitle}</span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-slate-200" />
                                                </motion.button>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-12 text-center text-slate-400 font-bold italic">
                                            Nenhum resultado encontrado para "{query}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Global Footer */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Busca Inteligente — Jornada Bíblica 2026</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
