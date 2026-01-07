import React, { useRef, useEffect } from 'react';
import { BookOpen, X, CircleCheck as CheckCircle, Clock, LogOut, Award, Zap, Flame } from 'lucide-react';
import { useReading } from '../../contexts/ReadingContext';
import { useAuth } from '../../contexts/AuthContext';
import { READING_PLAN_2026 } from '../../data/readingPlan';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [isDesktop, setIsDesktop] = React.useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const { user, profile, signOut } = useAuth();
    const {
        leiturasConcluidas,
        dataNavegacao,
        setDataNavegacao,
        getAtrasos,
        getPercentage,
        currentKey,
        getStreak,
        getMedals
    } = useReading();

    const streak = getStreak();
    const medalsCount = getMedals().length;

    const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Viajante';

    const daysListRef = useRef<HTMLDivElement>(null);
    const atrasos = getAtrasos();
    const percentage = getPercentage();

    const progressColorClass = atrasos > 0 ? 'text-red-500' : 'text-emerald-500';
    const progressBarClass = atrasos > 0 ? 'bg-red-500' : 'bg-emerald-500';

    useEffect(() => {
        if (daysListRef.current) {
            const activeElement = daysListRef.current.querySelector('.active-day-item');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentKey, isOpen]);

    return (
        <>
            {/* Backdrop (Mobile Only) */}
            <AnimatePresence>
                {isOpen && !isDesktop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Panel */}
            <AnimatePresence mode="wait">
                {(isOpen || isDesktop) && (
                    <motion.aside
                        initial={isDesktop ? false : { x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed lg:static inset-y-0 left-0 w-[300px] flex flex-col z-[60] transition-colors",
                            isDesktop
                                ? "bg-white border-r border-slate-200 lg:shadow-none"
                                : "bg-gradient-to-br from-sky-100 to-sky-50 border-r border-sky-200 shadow-2xl",
                            !isOpen && !isDesktop ? "hidden" : "flex"
                        )}
                    >
                        {/* Header Section */}
                        <div className="px-6 pt-3 pb-2 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-1.5">
                                <motion.div
                                    className="flex items-center gap-4 text-sky-50"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="bg-sky-50 p-3 rounded-[1.25rem] shadow-sm border border-sky-100 flex items-center justify-center">
                                        <BookOpen className="w-7 h-7 text-sky-500" />
                                    </div>
                                    <div className="flex flex-col -space-y-1">
                                        <span className="font-black text-3xl tracking-tighter leading-none text-slate-900">Jornada</span>
                                        <span className="text-[13px] font-black text-sky-400 uppercase tracking-[0.2em]">Bíblica 2026</span>
                                    </div>
                                </motion.div>
                                <motion.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="lg:hidden p-2.5 bg-slate-50 text-slate-400 rounded-xl border border-slate-100"
                                    onClick={onClose}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Gamification Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    className="bg-orange-50/50 border border-orange-100 rounded-2xl p-2 flex flex-col items-center gap-1"
                                >
                                    <Flame className="w-5 h-5 text-orange-500 fill-current" />
                                    <span className="text-[14px] font-black text-orange-600 leading-none">{streak} {streak === 1 ? 'Dia' : 'Dias'}</span>
                                    <span className="text-[8px] font-bold text-orange-400 uppercase tracking-widest">Consecutivos</span>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    className="bg-purple-50/50 border border-purple-100 rounded-2xl p-2 flex flex-col items-center gap-1"
                                >
                                    <Award className="w-5 h-5 text-purple-500" />
                                    <span className="text-[14px] font-black text-purple-600 leading-none">{medalsCount}/12</span>
                                    <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">Medalhas</span>
                                </motion.div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                                    <span className={cn(atrasos > 0 ? "text-red-500" : "text-emerald-500", "flex items-center gap-1.5")}>
                                        <div className={cn("w-2 h-2 rounded-full animate-pulse", atrasos > 0 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]")} />
                                        {atrasos > 0 ? 'EM ATRASO' : 'EM DIA'}
                                    </span>
                                    <span className={progressColorClass}>{percentage}% CONCLUÍDO</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={cn("h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)]", progressBarClass)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reading List */}
                        <div className="flex-1 overflow-y-auto px-4 pt-1 pb-1 space-y-1 no-scrollbar" ref={daysListRef}>
                            {Object.entries(READING_PLAN_2026).map(([key, ref], index) => {
                                const isActive = key === currentKey;
                                const isRead = leiturasConcluidas.includes(key);
                                const dateObj = new Date(2026, parseInt(key.split('/')[1]) - 1, parseInt(key.split('/')[0]));
                                const isLate = !isRead && dateObj.getTime() < new Date().setHours(0, 0, 0, 0);

                                return (
                                    <motion.button
                                        key={key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.01 }}
                                        onClick={() => { setDataNavegacao(dateObj); if (!isDesktop) onClose(); }}
                                        whileHover={{ scale: 1.01, x: 2 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3.5 py-0.5 rounded-xl text-left transition-all border",
                                            isActive
                                                ? 'bg-sky-50 text-sky-600 border-sky-100 shadow-sm active-day-item ring-1 ring-sky-200/50'
                                                : isLate
                                                    ? 'bg-red-100/40 text-red-700 border-red-100/50 hover:bg-red-100/60 shadow-sm'
                                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100 text-slate-600 shadow-sm'
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex flex-col items-center justify-center transition-colors shadow-sm",
                                                isActive ? "bg-sky-500 text-white" : isRead ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"
                                            )}>
                                                <span className="text-[10px] font-black leading-none">{key.split('/')[0]}</span>
                                                <span className="text-[7px] font-bold uppercase opacity-80">{['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'][parseInt(key.split('/')[1]) - 1]}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-[12.5px] font-bold tracking-tight leading-none",
                                                    isRead ? 'line-through opacity-40' : ''
                                                )}>{ref}</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                                                    {isRead ? 'Concluído' : isLate ? 'Pendente' : 'Para ler'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {isRead ? (
                                                <div className="bg-emerald-500 p-1 rounded-full shadow-lg shadow-emerald-500/20">
                                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            ) : isLate ? (
                                                <div className="w-4 h-4 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-red-400" />
                                                </div>
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-100" />
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Footer Section */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#fef2f2' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-4 px-4 py-2.5 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-100 group"
                            >
                                <div className="p-1.5 bg-white rounded-xl shadow-sm border border-slate-200 group-hover:border-red-200 group-hover:text-red-500 group-hover:scale-110 transition-all">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Encerrar</span>
                                    <span className="text-[9px] font-bold opacity-60">Sair da sua conta</span>
                                </div>
                            </motion.button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};
