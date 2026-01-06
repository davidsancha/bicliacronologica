import React from 'react';
import { BookOpen, Video, Heart, MessageSquare, Search, Mic, Music, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const ToolsNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { type: '/', label: 'Ler Texto', icon: <BookOpen />, category: 'Leitura & Vídeo' },
        { type: '/video', label: 'Vídeos Apoio', icon: <Video />, category: 'Leitura & Vídeo' },
        { type: '/devocional', label: 'Devocionais', icon: <Heart />, category: 'Aprofundamento' },
        { type: '/comentario', label: 'Comentários', icon: <MessageSquare />, category: 'Aprofundamento' },
        { type: '/pesquisa', label: 'Pesquisa', icon: <Search />, category: 'Aprofundamento' },
        { type: '/pregacao', label: 'Pregações', icon: <Mic />, category: 'Multimídia' },
        { type: '/louvor', label: 'Louvores', icon: <Music />, category: 'Multimídia' },
        { type: '/mapa', label: 'Mapas', icon: <MapPin />, category: 'Multimídia' },
    ];

    const bottomNavItems = [
        { type: '/', label: 'Texto', icon: <BookOpen size={20} /> },
        { type: '/pregacao', label: 'Pregações', icon: <Mic size={20} /> },
        { type: '/comentario', label: 'Comentários', icon: <MessageSquare size={20} /> },
        { type: '/louvor', label: 'Louvores', icon: <Music size={20} /> },
        { type: '/mapa', label: 'Mapas', icon: <MapPin size={20} /> },
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-col w-[200px] border-r border-slate-100 bg-white/50 backdrop-blur-sm p-4 overflow-y-auto">
                {['Leitura & Vídeo', 'Aprofundamento', 'Multimídia'].map(cat => (
                    <div key={cat} className="mb-6">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-3 ml-2">{cat}</span>
                        <div className="space-y-1">
                            {navItems.filter(i => i.category === cat).map(item => {
                                const isActive = location.pathname === item.type;
                                return (
                                    <button
                                        key={item.type}
                                        onClick={() => navigate(item.type)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                            isActive ? 'bg-white shadow-sm ring-1 ring-slate-200 text-sky-500' : 'text-slate-500 hover:text-slate-800 hover:translate-x-1'
                                        )}
                                    >
                                        <span className={isActive ? 'text-sky-400' : 'text-slate-400'}>
                                            {React.cloneElement(item.icon as React.ReactElement, { size: 18 })}
                                        </span>
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-2 py-2 flex items-center justify-around z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                {bottomNavItems.map((item) => {
                    const isActive = location.pathname === item.type;
                    return (
                        <button
                            key={item.type}
                            onClick={() => navigate(item.type)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1.5 flex-1 px-1 py-1 rounded-xl transition-all duration-300",
                                isActive ? 'text-sky-500' : 'text-slate-400 active:scale-95'
                            )}
                        >
                            <div className={cn("transition-transform duration-300", isActive ? 'scale-110' : '')}>
                                {React.cloneElement(item.icon as React.ReactElement, {
                                    strokeWidth: isActive ? 2.5 : 2,
                                    className: isActive ? 'drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]' : ''
                                })}
                            </div>
                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-wider transition-all",
                                isActive ? 'opacity-100' : 'opacity-70 font-medium'
                            )}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 w-8 h-1 bg-sky-500 rounded-full animate-in fade-in slide-in-from-top-1 duration-300" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </>
    );
};
