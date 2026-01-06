import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Image as ImageIcon, CheckCircle, Loader2, Camera, Upload, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const { profile, updateProfile, uploadAvatar } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Photo states
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [cropScale, setCropScale] = useState(1);
    const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                birth_date: profile.birth_date || '',
                avatar_url: profile.avatar_url || ''
            });
        }
    }, [profile, isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsCropping(true);
            setCropScale(1);
            setCropPosition({ x: 0, y: 0 });
        }
    };

    const generateCroppedImage = async () => {
        if (!previewUrl) return null;

        return new Promise<Blob>((resolve, reject) => {
            const img = new Image();
            img.src = previewUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = 400; // Output size
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject();

                // Calculate crop
                const minSide = Math.min(img.width, img.height);
                const baseScale = size / minSide;
                const finalScale = baseScale * cropScale;

                ctx.save();
                // Create circular clip
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                ctx.clip();

                // Draw image centered and transformed
                const drawWidth = img.width * finalScale;
                const drawHeight = img.height * finalScale;

                // Adjust position based on size and user drag
                // cropPosition is in pixels relative to the preview container
                const offsetX = (size - drawWidth) / 2 + (cropPosition.x * (size / 200));
                const offsetY = (size - drawHeight) / 2 + (cropPosition.y * (size / 200));

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                ctx.restore();

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject();
                }, 'image/jpeg', 0.9);
            };
        });
    };

    const handleSaveCrop = async () => {
        setLoading(true);
        try {
            const blob = await generateCroppedImage();
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
            const publicUrl = await uploadAvatar(file);
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
            setIsCropping(false);
            setPreviewUrl(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error saving cropped image:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                ...formData,
                full_name: `${formData.first_name} ${formData.last_name}`.trim()
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Editar Perfil</h2>
                                <p className="text-xs font-bold text-slate-400">Personalize sua experiência</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6 text-left">
                                {/* Avatar Preview & Upload */}
                                <div className="flex flex-col items-center gap-6 py-4">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all relative">
                                            {formData.avatar_url ? (
                                                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-300">
                                                    <User className="w-12 h-12 mb-1" />
                                                    <span className="text-[8px] font-black uppercase tracking-tighter">Sem Foto</span>
                                                </div>
                                            )}
                                        </div>

                                        <label className="absolute bottom-0 right-0 p-2.5 bg-sky-500 text-white rounded-full shadow-lg cursor-pointer hover:bg-sky-600 active:scale-90 transition-all border-4 border-white">
                                            <Camera className="w-4 h-4" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                                capture="user" // On mobile this suggests camera, but stays as file picker
                                            />
                                        </label>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                            className="text-xs font-black text-sky-500 uppercase tracking-widest hover:text-sky-600 transition-colors flex items-center gap-2"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            {formData.avatar_url ? 'Trocar Foto' : 'Inserir Foto de Perfil'}
                                        </button>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">PNG ou JPG até 5MB</p>
                                    </div>
                                </div>

                                {/* Cropping Overlay */}
                                <AnimatePresence>
                                    {isCropping && previewUrl && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-[210] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                                        >
                                            <div className="w-full max-w-sm flex flex-col items-center gap-8">
                                                <div className="text-center text-white">
                                                    <h3 className="text-lg font-black uppercase tracking-widest mb-1">Posicionar Foto</h3>
                                                    <p className="text-xs text-slate-400 font-medium">Arraste e ajuste o zoom para enquadrar</p>
                                                </div>

                                                {/* Crop Container */}
                                                <div className="relative w-64 h-64 rounded-full border-4 border-white/20 overflow-hidden bg-black/40 shadow-[0_0_0_100vmax_rgba(0,0,0,0.6)]">
                                                    <motion.div
                                                        drag
                                                        dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                                                        onDragEnd={(_, info) => {
                                                            setCropPosition(prev => ({
                                                                x: prev.x + info.offset.x,
                                                                y: prev.y + info.offset.y
                                                            }));
                                                        }}
                                                        style={{ x: cropPosition.x, y: cropPosition.y, scale: cropScale }}
                                                        className="w-full h-full cursor-move"
                                                    >
                                                        <img
                                                            src={previewUrl}
                                                            alt="Crop preview"
                                                            className="w-full h-full object-cover pointer-events-none select-none"
                                                            draggable={false}
                                                        />
                                                    </motion.div>
                                                </div>

                                                {/* Controls */}
                                                <div className="w-full space-y-6">
                                                    <div className="flex items-center gap-4 text-white">
                                                        <ZoomOut className="w-4 h-4 text-slate-400" />
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="3"
                                                            step="0.1"
                                                            value={cropScale}
                                                            onChange={(e) => setCropScale(parseFloat(e.target.value))}
                                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                                        />
                                                        <ZoomIn className="w-4 h-4 text-slate-400" />
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsCropping(false)}
                                                            className="flex-1 py-4 px-6 rounded-2xl bg-slate-800 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleSaveCrop}
                                                            disabled={loading}
                                                            className="flex-1 py-4 px-6 rounded-2xl bg-sky-500 text-white text-xs font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2"
                                                        >
                                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                                            Nome
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sky-500/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                                            Sobrenome
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sky-500/20 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                                        Data de Nascimento
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="date"
                                            required
                                            value={formData.birth_date}
                                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-sky-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <button
                                form="edit-profile-form"
                                disabled={loading || success}
                                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${success
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-slate-800'
                                    }`}
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : success ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Salvo com sucesso!
                                    </>
                                ) : (
                                    'Salvar Alterações'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
