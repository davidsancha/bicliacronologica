import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Heart, AlertCircle, LogOut, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useReading } from '../../contexts/ReadingContext';

interface ProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenFavorites: () => void;
    anchor?: 'top' | 'bottom';
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, onOpenFavorites, anchor = 'top' }) => {
    const { user, profile, signOut } = useAuth();
    const { favoritos } = useReading();

    const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';
    const fullName = profile?.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || firstName;
    const avatarUrl = profile?.avatar_url;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: anchor === 'top' ? 10 : -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: anchor === 'top' ? 10 : -10 }}
                    className={`absolute right-0 ${anchor === 'top' ? 'top-full pt-2' : 'bottom-full pb-2'} w-72 z-[100] pointer-events-auto`}
                >
                    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
                        {/* Header do Perfil */}
                        <div className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100 relative text-left">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-sky-500/30 overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                                    ) : (
                                        firstName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-base font-black text-slate-900 truncate">{fullName}</p>
                                    <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Sincronização Ativada</span>
                            </div>
                        </div>

                        {/* Menu de Opções */}
                        <div className="p-2">
                            <div className="px-3 py-2 text-left">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Configurações</p>
                            </div>
                            <button className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    Editar Perfil
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </button>
                            <button
                                onClick={() => {
                                    onOpenFavorites();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                        <Heart className="w-4 h-4" />
                                    </div>
                                    Versículos Favoritos
                                </div>
                                <div className="flex items-center gap-2">
                                    {favoritos.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{favoritos.length}</span>}
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                </div>
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                        <AlertCircle className="w-4 h-4" />
                                    </div>
                                    Outros Perfis / Contas
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </button>
                        </div>

                        <div className="px-2 pb-2 text-left">
                            <div className="h-px bg-slate-100 my-2 mx-2" />
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                            >
                                <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                Desconectar Sessão
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
