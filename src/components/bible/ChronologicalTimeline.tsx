import React, { useRef, useEffect } from 'react';
import { BIBLICAL_TIMELINE } from '../../data/timelineData';
import { cn } from '../../utils/cn';

interface ChronologicalTimelineProps {
    currentDay: string; // "DD/MM"
}

export const ChronologicalTimeline: React.FC<ChronologicalTimelineProps> = ({ currentDay }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const isDayInRange = (day: string, start: string, end: string) => {
        const [d, m] = day.split('/').map(Number);
        const [sd, sm] = start.split('/').map(Number);
        const [ed, em] = end.split('/').map(Number);

        const current = m * 100 + d;
        const s = sm * 100 + sd;
        const e = em * 100 + ed;

        return current >= s && current <= e;
    };

    const isDayPast = (day: string, end: string) => {
        const [d, m] = day.split('/').map(Number);
        const [ed, em] = end.split('/').map(Number);
        const current = m * 100 + d;
        const e = em * 100 + ed;
        return current > e;
    };

    const currentEraIndex = BIBLICAL_TIMELINE.findIndex(era => isDayInRange(currentDay, era.startDay, era.endDay));

    useEffect(() => {
        if (scrollRef.current && currentEraIndex !== -1) {
            const activeElement = scrollRef.current.children[currentEraIndex] as HTMLElement;
            if (activeElement) {
                const scrollLeft = activeElement.offsetLeft - scrollRef.current.offsetWidth / 2 + activeElement.offsetWidth / 2;
                scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [currentEraIndex]);

    const colorMap: Record<string, { bg: string, text: string, ring: string, line: string }> = {
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-100', line: 'bg-emerald-500' },
        amber: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-100', line: 'bg-amber-500' },
        blue: { bg: 'bg-blue-500', text: 'text-blue-600', ring: 'ring-blue-100', line: 'bg-blue-500' },
        rose: { bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-100', line: 'bg-rose-500' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-600', ring: 'ring-purple-100', line: 'bg-purple-500' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', ring: 'ring-yellow-100', line: 'bg-yellow-500' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-100', line: 'bg-orange-500' },
        slate: { bg: 'bg-slate-500', text: 'text-slate-600', ring: 'ring-slate-100', line: 'bg-slate-500' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', ring: 'ring-cyan-100', line: 'bg-cyan-500' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', ring: 'ring-indigo-100', line: 'bg-indigo-500' },
        sky: { bg: 'bg-sky-500', text: 'text-sky-600', ring: 'ring-sky-100', line: 'bg-sky-500' },
        red: { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-100', line: 'bg-red-500' },
        violet: { bg: 'bg-violet-600', text: 'text-violet-700', ring: 'ring-violet-100', line: 'bg-violet-600' },
    };

    return (
        <div className="w-full bg-white/40 backdrop-blur-sm border-b border-slate-100 py-6 overflow-hidden select-none">
            <div className="max-w-7xl mx-auto px-6">
                <div
                    ref={scrollRef}
                    className="flex items-start gap-12 overflow-x-auto no-scrollbar pb-2 relative"
                >
                    {BIBLICAL_TIMELINE.map((era, index) => {
                        const isActive = isDayInRange(currentDay, era.startDay, era.endDay);
                        const isPast = isDayPast(currentDay, era.endDay);
                        const colors = colorMap[era.color] || colorMap.slate;

                        return (
                            <div
                                key={era.id}
                                className={cn(
                                    "flex flex-col items-center min-w-[140px] transition-all duration-500",
                                    isActive ? "scale-110 opacity-100" : "scale-100 opacity-60 grayscale-[0.5]",
                                    isPast && !isActive && "opacity-90 grayscale-0"
                                )}
                            >
                                {/* Period Circle */}
                                <div className="relative mb-4">
                                    {/* Connection Line */}
                                    {index < BIBLICAL_TIMELINE.length - 1 && (
                                        <div className={cn(
                                            "absolute top-1/2 left-full w-12 h-0.5 mt-[-1px]",
                                            isPast ? colors.line : "bg-slate-200"
                                        )} />
                                    )}

                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-lg",
                                        isActive ? cn(colors.bg, "text-white ring-4", colors.ring, "shadow-2xl translate-y-[-4px]") :
                                            isPast ? cn(colors.bg, "text-white shadow-md") :
                                                "bg-slate-100 text-slate-400 shadow-none border border-slate-200"
                                    )}>
                                        {era.icon}
                                    </div>

                                    {/* Active Pulse */}
                                    {isActive && (
                                        <div className={cn(
                                            "absolute inset-0 rounded-2xl animate-ping opacity-20",
                                            colors.bg
                                        )} />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <p className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.2em] mb-1 transition-colors",
                                        isActive ? colors.text : isPast ? "text-slate-500" : "text-slate-400"
                                    )}>
                                        {era.year}
                                    </p>
                                    <h5 className={cn(
                                        "text-xs font-black transition-colors whitespace-nowrap",
                                        isActive ? "text-slate-900" : "text-slate-500"
                                    )}>
                                        {era.title}
                                    </h5>
                                    {isActive && (
                                        <p className="text-[9px] font-medium text-slate-400 mt-1 max-w-[120px] leading-tight animate-in fade-in slide-in-from-top-1 duration-500">
                                            {era.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
