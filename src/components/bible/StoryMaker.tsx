import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { X, Instagram, Sparkles, Quote, Loader2, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StoryMakerProps {
    verse: string;
    reference: string;
    onClose: () => void;
}

interface StoryBackground {
    id: string;
    url?: string;
    className?: string;
    label: string;
    textColor: 'light' | 'dark';
}

const BACKGROUNDS: StoryBackground[] = [
    { id: 'beige', url: '/assets/stories/bg-beige.png', label: 'Minimalista', textColor: 'dark' },
    { id: 'nature', url: '/assets/stories/bg-nature.png', label: 'Natureza', textColor: 'dark' },
    { id: 'ethereal', url: '/assets/stories/bg-abstract.png', label: 'Etéreo', textColor: 'dark' },
    { id: 'ocean', url: '/assets/stories/bg-ocean.png', label: 'Oceano', textColor: 'light' },
    { id: 'mountain', url: '/assets/stories/bg-mountain.png', label: 'Montanha', textColor: 'light' },
    { id: 'forest', url: '/assets/stories/bg-forest.png', label: 'Floresta', textColor: 'light' },
    { id: 'sunset', url: '/assets/stories/bg-sunset.png', label: 'Poente', textColor: 'light' },
    { id: 'cosmos', url: '/assets/stories/bg-stars.png', label: 'Cósmico', textColor: 'light' },
    { id: 'coffee', url: '/assets/stories/bg-coffee.png', label: 'Conforto', textColor: 'light' },
    { id: 'parchment', url: '/assets/stories/bg-vintage.png', label: 'História', textColor: 'dark' },
    { id: 'marble', url: '/assets/stories/bg-marble.png', label: 'Pureza', textColor: 'dark' },
    { id: 'watercolor', url: '/assets/stories/bg-watercolor.png', label: 'Artesanal', textColor: 'dark' },
    { id: 'linen', url: '/assets/stories/bg-linen.png', label: 'Sutileza', textColor: 'dark' },
    { id: 'lavender', url: '/assets/stories/bg-lavender.png', label: 'Lavanda', textColor: 'light' },
];

export const StoryMaker: React.FC<StoryMakerProps> = ({ verse, reference, onClose }) => {
    const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
    const [showGreeting, setShowGreeting] = useState(true);
    const storyRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    // Calculate optimal font size based on verse length
    const getFontSize = (text: string) => {
        const length = text.length;
        if (length > 400) return 'text-lg';
        if (length > 250) return 'text-xl';
        if (length > 150) return 'text-2xl';
        return 'text-3xl';
    };

    const handleShare = async () => {
        if (!storyRef.current) return;
        setLoading(true);
        try {
            const dataUrl = await toPng(storyRef.current, {
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
            });

            if (navigator.share && navigator.canShare) {
                try {
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], 'story.png', { type: 'image/png' });

                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: 'Instagram Story'
                        });
                        return;
                    }
                } catch (shareError) {
                    console.log('Share error or cancelled:', shareError);
                }
            }

            const link = document.createElement('a');
            link.download = `jornada-story-${reference.replace(/\s/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Erros ao gerar imagem:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-white w-full max-w-5xl h-full lg:h-[90vh] max-h-[920px] lg:rounded-[3rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in slide-in-from-bottom-10 lg:zoom-in-95 duration-300">
                {/* Preview Area - Fixed height on mobile for visibility */}
                <div className="bg-slate-200/50 flex items-center justify-center h-[38vh] lg:h-auto lg:flex-1 shrink-0 relative overflow-hidden">
                    <div className="relative group/preview scale-[0.38] xs:scale-[0.42] sm:scale-[0.5] lg:scale-[0.8] xl:scale-85 origin-center transition-transform duration-500">
                        {/* Aspect Ratio Container for Export */}
                        <div
                            ref={storyRef}
                            className={cn(
                                "relative w-[405px] h-[720px] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center",
                                selectedBg.className || ""
                            )}
                            style={selectedBg.url ? { backgroundImage: `url(${selectedBg.url})` } : {}}
                        >
                            {/* Content Wrapper */}
                            <div className="relative z-10 w-full h-full flex flex-col items-center px-8 py-14">
                                {/* Top Section: Greeting - Positioned higher */}
                                <div className="h-16 flex items-center justify-center mt-2">
                                    {showGreeting && (
                                        <h4 className={cn(
                                            "font-serif italic text-4xl tracking-tight drop-shadow-md animate-in fade-in slide-in-from-top-4 duration-1000",
                                            selectedBg.textColor === 'light' ? "text-white" : "text-slate-800"
                                        )}>Bom dia</h4>
                                    )}
                                </div>

                                {/* Middle Section: Verse Area - Larger and centered */}
                                <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
                                    <div className={cn(
                                        "p-10 rounded-[2.5rem] w-full flex flex-col items-center justify-center text-center transition-all duration-500 min-h-[400px]",
                                        selectedBg.textColor === 'light' ? "bg-black/5 backdrop-blur-[2px]" : "bg-white/5 backdrop-blur-[2px]"
                                    )}>
                                        <Quote className={cn(
                                            "w-10 h-10 mb-8",
                                            selectedBg.textColor === 'light' ? "text-white/20" : "text-slate-800/10"
                                        )} />
                                        <p className={cn(
                                            "font-serif leading-relaxed font-medium tracking-tight drop-shadow-lg",
                                            getFontSize(verse),
                                            selectedBg.textColor === 'light' ? "text-white" : "text-slate-800"
                                        )}>
                                            "{verse}"
                                        </p>
                                        <div className={cn(
                                            "h-0.5 w-16 shadow-sm mt-10 rounded-full",
                                            selectedBg.textColor === 'light' ? "bg-white/40" : "bg-slate-800/20"
                                        )} />
                                        <p className={cn(
                                            "font-sans text-[11px] font-black uppercase tracking-[0.4em] mt-8 drop-shadow-sm opacity-80",
                                            selectedBg.textColor === 'light' ? "text-white" : "text-slate-800"
                                        )}>
                                            {reference}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Section: Branding */}
                                <div className="h-12 mt-6 flex items-end justify-center">
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-lg",
                                        selectedBg.textColor === 'light' ? "text-white" : "text-slate-800"
                                    )}>
                                        @jornada_biblica_2026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Area - Scrollable and clearly defined */}
                <div className="w-full lg:w-[400px] bg-white p-4 lg:p-10 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col overflow-hidden h-[62vh] lg:h-full lg:max-h-none">
                    <div className="flex items-center justify-between mb-4 lg:mb-8">
                        <div>
                            <h3 className="text-base lg:text-2xl font-black text-slate-900 flex items-center gap-2 lg:gap-3">
                                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 fill-current" /> Share Story
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-2 lg:p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-300 hover:text-slate-600">
                            <X className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 mb-4 lg:mb-6">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Escolha o Tema</p>
                            <div className="grid grid-cols-4 xs:grid-cols-5 lg:grid-cols-2 gap-2 lg:gap-4 pb-2 lg:pb-0">
                                {BACKGROUNDS.map((bg) => (
                                    <button
                                        key={bg.id}
                                        onClick={() => setSelectedBg(bg)}
                                        className={cn(
                                            "group relative aspect-[3/4] w-full rounded-lg lg:rounded-2xl overflow-hidden border transition-all p-0.5",
                                            selectedBg.id === bg.id ? "border-sky-500 ring-2 ring-sky-500/20 scale-105" : "border-slate-100 hover:border-slate-300"
                                        )}
                                    >
                                        <div
                                            className={cn("w-full h-full rounded-[4px] lg:rounded-xl bg-cover bg-center shadow-inner", bg.className)}
                                            style={bg.url ? { backgroundImage: `url(${bg.url})` } : {}}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent hidden lg:block">
                                            <p className="text-[8px] lg:text-[9px] font-black text-white text-center uppercase tracking-widest leading-none">
                                                {bg.label}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fixed Footer: Actions */}
                        <div className="flex-none pt-2 lg:pt-4 border-t border-slate-50 space-y-4">
                            <button
                                onClick={() => setShowGreeting(!showGreeting)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2 lg:py-3 rounded-2xl border-2 transition-all group",
                                    showGreeting ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-slate-100 text-slate-500"
                                )}
                            >
                                <div className="flex items-center gap-2.5 font-bold text-[9px] lg:text-[10px] uppercase tracking-wider">
                                    <div className={cn("p-1 rounded-lg transition-colors", showGreeting ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400")}>
                                        <Zap className="w-3 h-3 fill-current" />
                                    </div>
                                    Bom Dia
                                </div>
                                <div className={cn("w-7 h-4 rounded-full relative transition-all", showGreeting ? "bg-emerald-500" : "bg-slate-200")}>
                                    <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", showGreeting ? "left-3.5" : "left-0.5")} />
                                </div>
                            </button>

                            <button
                                onClick={handleShare}
                                disabled={loading}
                                className="w-full py-4 lg:py-6 bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white rounded-2xl lg:rounded-[2rem] font-black text-base lg:text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(244,63,94,0.3)] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Instagram className="w-6 h-6" />}
                                Compartilhar no Instagram
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
