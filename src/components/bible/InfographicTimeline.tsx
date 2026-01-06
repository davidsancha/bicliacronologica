import React, { useRef, useEffect, useState } from 'react';
import { BIBLICAL_TIMELINE, KINGS_DATA, PROPHETS_DATA, EMPIRES_DATA } from '../../data/timelineData';
import { cn } from '../../utils/cn';
import { ChevronDown, ChevronUp, History } from 'lucide-react';

interface InfographicTimelineProps {
    currentDay: string; // "DD/MM"
}

export const InfographicTimeline: React.FC<InfographicTimelineProps> = ({ currentDay }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const isDayInRange = (day: string, start: string, end: string) => {
        const [d, m] = day.split('/').map(Number);
        const [sd, sm] = start.split('/').map(Number);
        const [ed, em] = end.split('/').map(Number);
        const current = m * 100 + d;
        const s = sm * 100 + sd;
        const e = em * 100 + ed;
        return current >= s && current <= e;
    };

    const currentEra = BIBLICAL_TIMELINE.find(era => isDayInRange(currentDay, era.startDay, era.endDay));

    // Scaling Constants
    const getX = (yearBC: number) => {
        const normalized = Math.max(-1000, Math.min(4000, yearBC));
        return (4000 - normalized) * 5;
    };

    // Constants for Rail Heights
    const Y_MAIN = 500;
    const Y_NORTH = 350;
    const Y_SOUTH = 650;
    const SPLIT_YEAR = 931;
    const MERGE_YEAR = 586;
    const ISRAEL_END_YEAR = 722;

    const UI_Y = {
        DISPENSATIONS: 40,
        EMPIRES: 120,
        KINGS_NORTH: Y_NORTH,
        KINGS_SOUTH: Y_SOUTH,
        KINGS_UNITED: Y_MAIN,
    };

    useEffect(() => {
        if (scrollRef.current && currentEra && isExpanded) {
            const yearNum = currentEra.yearBC;
            const targetX = getX(yearNum);
            const containerWidth = scrollRef.current.offsetWidth;
            const scrollLeft = targetX - (containerWidth / 2);
            scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [currentEra, isExpanded]);

    return (
        <div className={cn(
            "w-full bg-white border-b border-slate-200 transition-all duration-500 ease-in-out relative overflow-hidden",
            isExpanded ? "h-auto" : "h-[70px]"
        )}>
            {/* COLLAPSED SUMMARY VIEW */}
            {!isExpanded && (
                <div
                    className="absolute inset-0 flex items-center justify-between px-6 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors z-10"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm">
                            <History size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cronologia Bíblica</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[16px] font-black text-slate-800 tracking-tight">
                                    {currentEra?.title}
                                </span>
                                <span className="text-[12px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                                    {currentEra?.year}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end mr-4">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Dispensação</span>
                            <span className="text-[11px] font-bold text-slate-700">{currentEra?.dispensation}</span>
                        </div>
                        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-[12px] font-black text-slate-600 hover:text-sky-600 transition-colors">
                            VER DETALHES
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* EXPANDED CONTENT HEADER (Floating Toggle) */}
            {isExpanded && (
                <button
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-4 right-6 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-xl text-slate-600 hover:text-red-500 transition-all hover:scale-110"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            {/* DETAILED CONTENT */}
            <div className={cn(
                "w-full bg-[#f8f9fa] transition-opacity duration-500",
                isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                {/* Dispensations Header (Full-Width Bars) */}
                <div className="absolute top-0 left-0 w-full h-[60px] flex overflow-hidden z-20 pointer-events-none border-b border-slate-200 bg-white shadow-sm">
                    <div className="relative min-w-[25000px] h-full">
                        {BIBLICAL_TIMELINE.map((era, i) => {
                            const nextEra = BIBLICAL_TIMELINE[i + 1];
                            const startX = getX(era.yearBC);
                            const endX = nextEra ? getX(nextEra.yearBC) : getX(-1000);
                            const width = Math.abs(endX - startX);

                            return (
                                <div
                                    key={era.id}
                                    className="absolute h-full flex items-center justify-center border-r border-white/20 px-2 transition-all overflow-hidden"
                                    style={{
                                        left: startX,
                                        width: width,
                                        backgroundColor: era.bgColor || '#94a3b8'
                                    }}
                                >
                                    <span className="text-white text-[12px] font-black uppercase tracking-widest whitespace-nowrap drop-shadow-md">
                                        {era.dispensation}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="overflow-x-auto no-scrollbar pb-16 px-[5vw] pt-[80px] scroll-smooth"
                >
                    <div className="relative min-w-[25000px] h-[1000px] font-sans">
                        {/* SVG METRO LINES */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                            <rect x={getX(4000)} y={Y_MAIN - 15} width={getX(SPLIT_YEAR) - getX(4000)} height="30" fill="#94a3b8" rx="15" />
                            <path d={`M ${getX(SPLIT_YEAR)} ${Y_MAIN} C ${getX(928)} ${Y_MAIN}, ${getX(925)} ${Y_NORTH}, ${getX(920)} ${Y_NORTH} L ${getX(ISRAEL_END_YEAR)} ${Y_NORTH}`} fill="none" stroke="#2563eb" strokeWidth="26" strokeLinecap="round" />
                            <path d={`M ${getX(SPLIT_YEAR)} ${Y_MAIN} C ${getX(928)} ${Y_MAIN}, ${getX(925)} ${Y_SOUTH}, ${getX(920)} ${Y_SOUTH} L ${getX(MERGE_YEAR)} ${Y_SOUTH}`} fill="none" stroke="#d97706" strokeWidth="26" strokeLinecap="round" />
                            <path d={`M ${getX(MERGE_YEAR)} ${Y_SOUTH} C ${getX(580)} ${Y_SOUTH}, ${getX(570)} ${Y_MAIN}, ${getX(560)} ${Y_MAIN} L 25000 ${Y_MAIN}`} fill="none" stroke="#64748b" strokeWidth="30" strokeLinecap="round" />

                            <line x1={getX(4000)} y1="100" x2={getX(-1000)} y2="100" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                            {Array.from({ length: 101 }).map((_, i) => {
                                const year = 4000 - (i * 50);
                                const x = getX(year);
                                return (
                                    <g key={i}>
                                        <line x1={x} y1="90" x2={x} y2="110" stroke="#cbd5e1" strokeWidth="2" />
                                        <text x={x} y="80" textAnchor="middle" className="fill-slate-400 text-[10px] font-bold tracking-tighter">{year < 0 ? Math.abs(year) + ' d.C.' : year + ' a.C.'}</text>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* KING NAMES INSIDE RAILS */}
                        {KINGS_DATA.united.map(king => (
                            <div key={king.id} className="absolute flex items-center justify-center transform -translate-y-1/2 overflow-hidden pointer-events-none" style={{ left: getX(king.startYearBC), top: Y_MAIN, width: Math.abs(getX(king.endYearBC) - getX(king.startYearBC)), height: '30px' }}>
                                <span className="text-white text-[11px] font-black uppercase whitespace-nowrap overflow-hidden text-ellipsis px-2">{king.name}</span>
                            </div>
                        ))}
                        {KINGS_DATA.north.map(king => (
                            <div key={king.id} className="absolute flex items-center justify-center transform -translate-y-1/2 pointer-events-none border-l border-white/20" style={{ left: getX(king.startYearBC), top: Y_NORTH, width: Math.abs(getX(king.endYearBC) - getX(king.startYearBC)), height: '26px' }}>
                                <span className="text-white text-[10px] font-black uppercase whitespace-nowrap overflow-hidden text-ellipsis px-1">{king.name}</span>
                            </div>
                        ))}
                        {KINGS_DATA.south.map(king => (
                            <div key={king.id} className="absolute flex items-center justify-center transform -translate-y-1/2 pointer-events-none border-l border-white/20" style={{ left: getX(king.startYearBC), top: Y_SOUTH, width: Math.abs(getX(king.endYearBC) - getX(king.startYearBC)), height: '26px' }}>
                                <span className="text-white text-[10px] font-black uppercase whitespace-nowrap overflow-hidden text-ellipsis px-1">{king.name}</span>
                            </div>
                        ))}

                        {/* PROPHETS */}
                        {PROPHETS_DATA.map((p, i) => {
                            const isNorth = p.location === 'North' || (p.location === 'Both' && p.startYearBC > 586);
                            const level = i % 3;
                            const cardY = isNorth ? (Y_NORTH - 50 - level * 160) : (Y_SOUTH + 50 + level * 160);
                            return (
                                <div key={p.id} className="absolute flex flex-col items-center group/prophet z-10" style={{ left: getX((p.startYearBC + p.endYearBC) / 2), top: cardY + 'px', transform: isNorth ? 'translate(-50%, -100%)' : 'translate(-50%, 0)' }}>
                                    <div className="flex flex-col items-center text-center max-w-[240px] transition-transform group-hover/prophet:scale-105">
                                        <div className={cn("flex items-center gap-2 mb-2 p-1 rounded-xl shadow-lg border-2", isNorth ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200")}>
                                            <div className="w-10 h-10 rounded-full bg-white shadow-inner flex items-center justify-center border border-slate-200"><span>📜</span></div>
                                            <div className="bg-white px-3 py-1 rounded-lg border border-slate-300"><span className="text-[14px] font-black text-slate-900 uppercase">{p.name}</span></div>
                                        </div>
                                        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-2xl relative">
                                            <p className="text-[10px] font-black text-slate-800 mb-1 uppercase tracking-tighter leading-tight">{p.summary?.split('.')[0]}.</p>
                                            <p className="text-[9px] text-slate-600 leading-relaxed font-medium">{p.summary}</p>
                                            <div className="mt-2 flex items-center justify-between text-[8px] font-black text-slate-400 border-t border-slate-100 pt-1"><span>{p.years}</span><span>{p.period}</span></div>
                                            <div className={cn("absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45", isNorth ? "-bottom-1.5" : "-top-1.5 rotate-[225deg]")} />
                                        </div>
                                    </div>
                                    <div className={cn("w-px border-l-2 border-dashed border-slate-300 absolute", isNorth ? "top-0 mt-0" : "bottom-0 mb-0")} style={{ height: Math.abs(cardY - (isNorth ? Y_NORTH : Y_SOUTH)) - 20, [isNorth ? 'top' : 'bottom']: '2px' }}>
                                        <div className={cn("absolute w-2 h-2 border-r-2 border-b-2 border-slate-300 transform rotate-45", isNorth ? "bottom-0 -translate-x-1/2" : "top-0 rotate-[225deg] -translate-x-1/2")} />
                                    </div>
                                </div>
                            );
                        })}

                        {/* EVENTS */}
                        <div className="absolute" style={{ left: getX(722), top: Y_NORTH, transform: 'translate(-50%, -50%)' }}><span className="text-4xl animate-pulse">💥</span></div>
                        <div className="absolute" style={{ left: getX(586), top: Y_SOUTH, transform: 'translate(-50%, -50%)' }}><span className="text-4xl animate-pulse">💥</span></div>

                        {/* EMPIRES */}
                        {EMPIRES_DATA.map(emp => (
                            <div key={emp.id} className="absolute flex items-center gap-3 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/80 shadow-lg" style={{ left: getX(emp.startYearBC), top: UI_Y.EMPIRES }}>
                                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-2xl border border-slate-100">{emp.id === 'egypt' ? '🏛️' : emp.id === 'assyria' ? '👺' : emp.id === 'babylonia' ? '🏰' : emp.id === 'persia' ? '🦁' : emp.id === 'rome' ? '🏟️' : '🌍'}</div>
                                <div className="flex flex-col"><span className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{emp.name}</span><span className="text-[9px] font-bold text-slate-500 opacity-80">{emp.ruler}</span></div>
                            </div>
                        ))}

                        {/* CURRENT POSITION */}
                        {currentEra && (
                            <div className="absolute z-50 transition-all duration-1000 ease-in-out" style={{ left: getX(currentEra.yearBC), top: '0', height: '100%' }}>
                                <div className="h-full w-[4px] bg-red-600/20 relative">
                                    <div className="absolute top-[60px] left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full shadow-2xl z-50 animate-bounce">
                                        <span className="text-[11px] font-black uppercase">HISTÓRIA ATUAL</span>
                                    </div>
                                    <div className="h-full w-px border-l-2 border-dashed border-red-600/40" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
