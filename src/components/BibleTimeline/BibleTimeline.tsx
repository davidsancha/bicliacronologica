
import React, { useMemo } from 'react';
import { BIBLICAL_TIMELINE, KINGS_DATABASE } from '../../data/timelineData';
import { ReadingQuery } from '../../types';

interface BibleTimelineProps {
  currentQueries: ReadingQuery[];
}

const BibleTimeline: React.FC<BibleTimelineProps> = ({ currentQueries }) => {
  const activeEraIndex = useMemo(() => {
    if (!currentQueries.length) return -1;
    const firstBook = currentQueries[0].sigla;
    const firstCap = currentQueries[0].cap;
    const fullRef = `${firstBook} ${firstCap}`;

    return BIBLICAL_TIMELINE.findIndex(era =>
      era.books.some(b => fullRef.startsWith(b) || firstBook === b)
    );
  }, [currentQueries]);

  const era = useMemo(() => activeEraIndex !== -1 ? BIBLICAL_TIMELINE[activeEraIndex] : null, [activeEraIndex]);

  const contextData = useMemo(() => {
    if (!era) return null;
    const first = currentQueries[0];
    const fullRef = `${first.sigla} ${first.cap}`;

    let data = {
      dispensation: era.dispensation,
      empire: "Egito",
      prophet: "Moisés",
      ruler: "Faraó",
      isDivided: era.id === 'divided_kingdom',
      isUnited: era.id === 'united_kingdom',
      color: "#94a3b8" // Default slate
    };

    const colorMap: Record<string, string> = {
      creation: "#10b981",
      patriarchs: "#f59e0b",
      exodus: "#3b82f6",
      conquest: "#ef4444",
      judges: "#8b5cf6",
      united_kingdom: "#facc15",
      divided_kingdom: "#f97316",
      exile: "#64748b",
      return: "#06b6d4",
      silence: "#cbd5e1",
      christ: "#0ea5e9",
      church: "#f43f5e",
      consummation: "#7c3aed"
    };

    data.color = colorMap[era.id] || "#94a3b8";

    if (era.id === 'united_kingdom') {
      data.empire = "Israelita";
      data.prophet = "Samuel / Natã";
      const king = KINGS_DATABASE.united.find(k => k.books.some(b => fullRef.startsWith(b)));
      data.ruler = king ? `Rei ${king.name}` : "Saul / Davi / Salomão";
    } else if (era.id === 'divided_kingdom') {
      data.empire = "Assíria / Babilônia";
      data.prophet = "Elias / Eliseu / Isaías";
      const match = KINGS_DATABASE.divided.find(k => fullRef.startsWith(k.ref));
      data.ruler = match ? `${match.north} (N) / ${match.south} (S)` : "Norte e Sul";
    } else if (era.id.includes('christ') || era.id.includes('church')) {
      data.empire = "Império Romano";
      data.prophet = "João Batista / Apóstolos";
      data.ruler = "Herodes / César";
    } else if (era.id === 'creation') {
      data.empire = "Pré-Impérios";
      data.prophet = "Adão / Enoque / Noé";
      data.ruler = "Patriarcas Primitivos";
    }

    return data;
  }, [era, currentQueries]);

  const dispensationFullText = useMemo(() => {
    if (!contextData) return "";
    const name = contextData.dispensation;
    const prefix = name === "Reino" ? "do" : "da";
    return `Dispensação ${prefix} ${name}`;
  }, [contextData]);

  if (!era || !contextData) return null;

  return (
    <div className="w-full mb-12 select-none animate-in fade-in zoom-in duration-500">
      <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-between">

        <div className="max-w-2xl mx-auto w-full flex flex-col justify-between h-full relative z-10">

          {/* Linha 1: Dispensação (Estilo suave e em linha única) */}
          <div className="flex flex-col items-center">
            <div className="bg-slate-100/60 text-slate-600 px-8 py-2 rounded-full border border-slate-200/50">
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                {dispensationFullText}
              </span>
            </div>
          </div>

          {/* Linha 2: Império Dominante */}
          <div className="text-center py-6 relative">
            <div className="h-[1px] w-full bg-slate-100 absolute top-1/2 left-0 -z-10" />
            <div className="bg-white inline-block px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Império:</span>
              <span className="text-[12px] font-bold text-slate-500 uppercase italic tracking-wider">
                {contextData.empire}
              </span>
            </div>
          </div>

          {/* O GRÁFICO CENTRAL (Estilo Marcador conforme esboço) */}
          <div className="relative py-8 flex items-center justify-center">
            <svg viewBox="0 0 400 120" className="w-full max-w-[450px] overflow-visible drop-shadow-sm">
              <defs>
                <filter id="marker-texture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
                <linearGradient id="eraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={contextData.color} stopOpacity="0.8" />
                  <stop offset="50%" stopColor={contextData.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={contextData.color} stopOpacity="0.8" />
                </linearGradient>
              </defs>

              <line x1="0" y1="60" x2="400" y2="60" stroke="#f8fafc" strokeWidth="24" strokeLinecap="round" />

              {!contextData.isDivided ? (
                <>
                  <line
                    x1="20" y1="60" x2="380" y2="60"
                    stroke="url(#eraGradient)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    filter="url(#marker-texture)"
                    className="transition-all duration-700 ease-in-out"
                  />
                  {contextData.isUnited && (
                    <text x="200" y="64" textAnchor="middle" className="text-[9px] font-black uppercase fill-white/90 pointer-events-none tracking-widest">Reino Unido</text>
                  )}
                </>
              ) : (
                <>
                  <line x1="0" y1="60" x2="80" y2="60" stroke="#facc15" strokeWidth="22" strokeLinecap="round" filter="url(#marker-texture)" />
                  <path
                    d="M 80 60 L 130 30 L 400 30"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="18"
                    strokeLinecap="round"
                    filter="url(#marker-texture)"
                  />
                  <path
                    d="M 80 60 L 130 90 L 400 90"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="18"
                    strokeLinecap="round"
                    filter="url(#marker-texture)"
                  />
                  <text x="260" y="24" textAnchor="middle" className="text-[10px] font-black uppercase fill-amber-700 tracking-widest">Reino do Norte</text>
                  <text x="260" y="104" textAnchor="middle" className="text-[10px] font-black uppercase fill-cyan-700 tracking-widest">Reino do Sul</text>
                  <text x="45" y="64" textAnchor="middle" className="text-[7px] font-black uppercase fill-amber-900/40">YAC-YDC</text>
                </>
              )}

              <circle
                cx="200"
                cy={contextData.isDivided ? 30 : 60}
                r="11"
                className="fill-white stroke-slate-900 stroke-[5px] shadow-2xl transition-all duration-500"
              />
              <circle
                cx="200"
                cy={contextData.isDivided ? 30 : 60}
                r="4"
                className="fill-sky-500 animate-pulse"
              />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-200 shadow-xl flex flex-col items-center min-w-[150px]">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter text-center leading-tight">
                  {era.title}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                  {era.year}
                </span>
              </div>
            </div>
          </div>

          {/* Linha 3: Profeta e Governante (Footer horizontal claro) */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 bg-sky-50/50 rounded-2xl p-4 border border-sky-100 flex flex-col items-center">
              <span className="text-[9px] font-black text-sky-400 uppercase mb-2 tracking-[0.2em]">Profeta</span>
              <span className="text-[12px] font-black text-sky-800 uppercase text-center">{contextData.prophet}</span>
            </div>
            <div className="flex-1 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col items-center shadow-lg">
              <span className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Governante</span>
              <span className="text-[12px] font-black text-white uppercase text-center">{contextData.ruler}</span>
            </div>
          </div>

        </div>

        {/* Detalhe estético de fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
      </div>
    </div>
  );
};

export default BibleTimeline;
