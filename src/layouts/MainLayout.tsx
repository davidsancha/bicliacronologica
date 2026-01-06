import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToolsNavigation } from '../components/layout/ToolsNavigation';
import { useReading } from '../contexts/ReadingContext';
import { AlertTriangle } from 'lucide-react';
import { READING_PLAN_2026 } from '../data/readingPlan';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { getAtrasos, leiturasConcluidas, setDataNavegacao } = useReading();
    const atrasos = getAtrasos();

    const handleIrParaAtraso = () => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const iter = new Date(hoje.getFullYear(), 0, 1);
        while (iter < hoje) {
            const d = String(iter.getDate()).padStart(2, '0');
            const m = String(iter.getMonth() + 1).padStart(2, '0');
            const key = `${d}/${m}`;
            if (READING_PLAN_2026[key] && !leiturasConcluidas.includes(key)) {
                setDataNavegacao(new Date(iter));
                return;
            }
            iter.setDate(iter.getDate() + 1);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-700">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 relative">
                {atrasos > 0 && (
                    <div
                        onClick={handleIrParaAtraso}
                        className="bg-red-600 px-4 py-2 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300 z-30 cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                    >
                        <AlertTriangle className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="text-[13px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                            Há {atrasos} {atrasos === 1 ? 'dia' : 'dias'} pendentes. Clique para ler.
                        </span>
                    </div>
                )}

                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="flex-1 flex overflow-hidden">
                    <ToolsNavigation />
                    <div className="flex-1 overflow-hidden relative">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
