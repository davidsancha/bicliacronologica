import React, { useState } from 'react';
import { BookOpen, Video, Heart, MessageSquare, Search, Mic, Music, MapPin, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileMenu } from './ProfileMenu';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolsNavigationProps {
    onEditProfile?: () => void;
    onOpenFavorites?: () => void;
}

export const ToolsNavigation: React.FC<ToolsNavigationProps> = ({ onEditProfile, onOpenFavorites }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, isProfileComplete } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide/Show on scroll logic
    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Scrolling down
            } else {
                setIsVisible(true); // Scrolling up
            }
            setLastScrollY(currentScrollY);
        };

        const handleBibleScroll = (e: any) => {
            const currentScrollY = e.detail.scrollTop;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('bible-scroll' as any, handleBibleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('bible-scroll' as any, handleBibleScroll);
        };
    }, [lastScrollY]);

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
        { type: '/', label: 'Texto', icon: <BookOpen size={24} /> },
        { type: '/pregacao', label: 'Pregações', icon: <Mic size={24} /> },
        { type: '/comentario', label: 'Comentários', icon: <MessageSquare size={24} /> },
        { type: '/louvor', label: 'Louvores', icon: <Music size={24} /> },
        { type: 'perfil', label: 'Perfil', isProfile: true },
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
            <motion.nav
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : 120 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden fixed bottom-6 left-6 right-6 bg-gradient-to-br from-sky-50 to-white/95 backdrop-blur-md border border-sky-100 px-2 py-4 flex items-center justify-around z-[60] shadow-[0_20px_50px_rgba(148,163,184,0.25)] rounded-[2.5rem] safe-area-bottom transition-all"
            >
                {bottomNavItems.map((item) => {
                    const isActive = location.pathname === item.type;

                    if (item.isProfile) {
                        return (
                            <div key="perfil" className="relative flex-1 flex flex-col items-center">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 w-full px-1 py-1 rounded-xl transition-all duration-300",
                                        isProfileOpen ? 'text-rose-500' : 'text-slate-400 active:scale-95'
                                    )}
                                >
                                    <div className={cn(
                                        "w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black transition-all overflow-hidden border-2",
                                        isProfileOpen || isActive ? 'border-rose-500 bg-white text-rose-500 shadow-lg shadow-rose-500/10 scale-110' : 'border-sky-100 bg-white text-slate-400 shadow-sm'
                                    )}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            firstName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    {!isProfileComplete && (
                                        <span className="absolute top-0 right-[20%] w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full animate-bounce shadow-sm" />
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
                                "flex flex-col items-center justify-center flex-1 py-1 transition-all duration-300 relative",
                                isActive ? 'text-rose-500' : 'text-slate-400 active:scale-90 shadow-none'
                            )}
                        >
                            <div className={cn("transition-transform duration-300", isActive ? 'scale-110' : '')}>
                                {React.cloneElement(item.icon as React.ReactElement, {
                                    strokeWidth: isActive ? 3 : 2,
                                    fill: 'none'
                                })}
                            </div>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabMobile"
                                    className="absolute -bottom-1 w-1 h-1 bg-rose-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </motion.nav>
        </>
    );
};

