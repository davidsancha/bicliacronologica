import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { BiblePage } from '../pages/BiblePage';
import { MediaPage } from '../pages/MediaPage';
import { LoginPage } from '../pages/LoginPage';
import { useAuth } from '../contexts/AuthContext';

export const AppRoutes: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<BiblePage />} />
                <Route path="/:type" element={<MediaPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </MainLayout>
    );
};
