import React from 'react';
import { useLocation } from 'react-router-dom';
import { useReading } from '../contexts/ReadingContext';
import { BIBLE_MAP } from '../data/bibleData';
import { parseReadingPlan } from '../services/bibleService';
import { PRIORITY_CHANNELS, PASTORS, DAILY_WORSHIP } from '../data/mediaData';
import { Video, Heart, Mic, MessageSquare } from 'lucide-react';

export const MediaPage: React.FC = () => {
    const { currentReadingRaw, currentKey } = useReading();
    const location = useLocation();
    const type = location.pathname.substring(1); // video, devocional, etc.

    const currentQueries = parseReadingPlan(currentReadingRaw || "");
    const firstRef = currentQueries[0];
    const bookName = firstRef ? (BIBLE_MAP[firstRef.sigla]?.name || firstRef.sigla) : "";

    if (type === 'comentario') {
        return (
            <div className="bg-[#fdfbf7] p-8 md:p-12 h-full overflow-y-auto pb-32 lg:pb-12">
                <div className="max-w-2xl mx-auto space-y-12 text-center">
                    <h2 className="font-serif text-3xl text-slate-900 mb-2">Comentários Clássicos</h2>
                    <div className="relative bg-white border border-stone-200 p-8 shadow-sm text-left">
                        <h4 className="font-bold text-slate-800 border-b pb-4 mb-4">Matthew Henry</h4>
                        <p className="font-serif text-slate-700 italic">"Ao lermos {bookName} {firstRef?.cap}, observamos a providência divina."</p>
                    </div>
                    <a href={`https://www.google.com/search?q=Comentario+Matthew+Henry+${bookName}+${firstRef?.cap}`} target="_blank" rel="noreferrer" className="font-bold text-amber-800 underline">Ler no Google ↗</a>
                </div>
            </div>
        );
    }

    if (type === 'louvor') {
        const worships = DAILY_WORSHIP[currentKey] || [];
        return (
            <div className="p-8 h-full overflow-y-auto space-y-12 pb-32 lg:pb-12 text-center">
                {worships.map((s, i) => (
                    <div key={i} className="max-w-xl mx-auto bg-white border rounded-2xl overflow-hidden shadow-sm">
                        <iframe className="w-full aspect-video" src={`https://www.youtube.com/embed/${s.id}`} frameBorder="0" allowFullScreen></iframe>
                        <div className="p-6 text-center"><h4 className="font-bold text-slate-800">{s.title}</h4><p className="text-sky-500">{s.artist}</p></div>
                    </div>
                ))}
                {worships.length === 0 && (
                    <div className="mt-12 text-slate-400">Nenhum louvor específico para hoje.</div>
                )}
            </div>
        );
    }

    if (type === 'video' || type === 'devocional' || type === 'pregacao') {
        const keyword = type === 'devocional' ? 'Devocional' : type === 'pregacao' ? 'Pregação' : '';
        const list = type === 'pregacao' ? PASTORS : PRIORITY_CHANNELS.map(c => c.name);

        return (
            <div className="p-8 h-full overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 content-start pb-32 lg:pb-8">
                {list.map((name, i) => (
                    <a key={i} href={`https://www.youtube.com/results?search_query=${keyword}+${name}+${bookName}+${firstRef?.cap}`} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-sky-50 text-sky-400 rounded-full flex items-center justify-center">
                            {type === 'devocional' ? <Heart /> : type === 'pregacao' ? <Mic /> : <Video />}
                        </div>
                        <div><h4 className="font-bold text-slate-800">{name}</h4><p className="text-sm text-slate-500 mt-1">{keyword} sobre {bookName}</p></div>
                    </a>
                ))}
            </div>
        );
    }

    // Fallback for search and map
    let searchUrl = `https://www.google.com/search?igu=1&q=Estudo+${bookName}+${firstRef?.cap}`;
    if (type === 'pesquisa') searchUrl = `https://www.google.com/search?igu=1&q=Estudo+teologico+${bookName}+${firstRef?.cap}`;
    if (type === 'mapa') searchUrl = `https://www.google.com/search?igu=1&tbm=isch&q=Mapa+Bíblico+${bookName}+${firstRef?.cap}`;

    return <div className="w-full h-full pb-32 lg:pb-0"><iframe src={searchUrl} className="w-full h-full border-none"></iframe></div>;
};
