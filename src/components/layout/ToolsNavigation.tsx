import React, { useState } from 'react';
import { BookOpen, Video, Heart, MessageSquare, Search, Mic, Music, MapPin, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileMenu } from './ProfileMenu';

interface ToolsNavigationProps {
    onEditProfile?: () => void;
    onOpenFavorites?: () => void;
}

export const ToolsNavigation: React.FC<ToolsNavigationProps> = ({ onEditProfile, onOpenFavorites }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, isProfileComplete } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';
    const avatarUrl = profile?.avatar_url;

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
        { type: 'perfil', label: 'Guias', isProfile: true },
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
            <nav className="lg:hidden fixed bottom-1 left-4 right-4 bg-white/98 backdrop-blur-2xl border border-slate-200 px-2 py-2 flex items-center justify-around z-40 shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-[2rem] pb-2 safe-area-bottom">
                {bottomNavItems.map((item) => {
                    const isActive = location.pathname === item.type;

                    if (item.isProfile) {
                        return (
                            <div key="perfil" className="relative flex-1 flex flex-col items-center">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 w-full px-1 py-1 rounded-xl transition-all duration-300",
                                        isProfileOpen ? 'text-sky-500' : 'text-slate-400 active:scale-95'
                                    )}
                                >
                                    <div className={cn(
                                        "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all overflow-hidden border-2",
                                        isProfileOpen || isActive ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-110' : 'border-slate-100 bg-slate-100 text-slate-400'
                                    )}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            firstName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase tracking-wider transition-all",
                                        isProfileOpen || isActive ? 'opacity-100' : 'opacity-70 font-medium'
                                    )}>
                                        {item.label}
                                    </span>
                                    {!isProfileComplete && (
                                        <span className="absolute top-0 right-[25%] w-2 h-2 bg-amber-500 border-2 border-white rounded-full animate-bounce" />
                                    )}
                                </button>
                                <ProfileMenu
                                    isOpen={isProfileOpen}
                                    onClose={() => setIsProfileOpen(false)}
                                    onOpenFavorites={() => onOpenFavorites?.()}
                                    onEditProfile={onEditProfile}
                                    anchor="bottom"
                                />
                            </div>
                        );
                    }

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
                        </button>
                    );
                })}
            </nav>
        </>
    );
};

