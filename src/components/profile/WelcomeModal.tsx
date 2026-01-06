import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCompleteProfile: () => void;
    userName: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onCompleteProfile, userName }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Top Decoration */}
                        <div className="h-32 bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                            </div>
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-inner">
                                <PartyPopper className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">
                                Bem-vindo, {userName}!
                            </h2>
                            <p className="text-slate-500 font-medium mb-8">
                                Estamos muito felizes em ter você conosco nesta jornada de leitura bíblica. Vamos começar?
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={onCompleteProfile}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                                >
                                    Completar meu perfil
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-[0.98]"
                                >
                                    Agora não, quero começar a ler
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
