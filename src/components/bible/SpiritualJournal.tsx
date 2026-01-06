import React, { useState, useEffect } from 'react';
import { PenTool, Save, CheckCircle, Sparkles, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SpiritualJournalProps {
    currentKey: string;
    onSave: (note: string) => void;
    initialValue?: string;
}

export const SpiritualJournal: React.FC<SpiritualJournalProps> = ({ currentKey, onSave, initialValue = "" }) => {
    const [note, setNote] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setNote(initialValue);
    }, [initialValue, currentKey]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(note);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save journal:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-20 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="bg-white px-6 py-2 rounded-full border border-slate-100 shadow-xl flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-sky-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Diário Espiritual</span>
                </div>
            </div>

            <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote className="w-24 h-24 text-slate-900" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="w-16 h-16 bg-sky-50 rounded-3xl flex items-center justify-center mb-4 border border-sky-100 shadow-inner">
                            <Sparkles className="w-8 h-8 text-sky-500 animate-pulse" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">O que Deus falou com você hoje?</h4>
                        <p className="text-sm font-medium text-slate-400 max-w-sm">Use este espaço para registrar suas reflexões, orações ou o que mais te marcou nesta leitura.</p>
                    </div>

                    <div className="relative">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Escreva sua reflexão aqui..."
                            className="w-full min-h-[220px] bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] p-8 text-lg font-serif text-slate-700 leading-relaxed focus:outline-none focus:border-sky-200 focus:bg-white transition-all placeholder:text-slate-300 resize-none"
                        />

                        <div className="absolute bottom-6 right-6 flex items-center gap-3">
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Nota Salva!
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={isSaving || !note.trim()}
                                className={cn(
                                    "flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg",
                                    isSaving || !note.trim()
                                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                        : "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-500/20"
                                )}
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {isSaving ? 'Salvando...' : 'Salvar Reflexão'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
