import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReadingProvider } from './contexts/ReadingContext';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ReadingProvider>
                    <AppRoutes />
                </ReadingProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
