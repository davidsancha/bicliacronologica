import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: any | null;
    isProfileComplete: boolean;
    loading: boolean;
    showWelcomeModal: boolean;
    setShowWelcomeModal: (show: boolean) => void;
    signIn: (email: string) => Promise<void>; // Magic Link
    signInWithPassword: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: any) => Promise<void>;
    uploadAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const isProfileComplete = !!(
        profile?.first_name &&
        profile?.last_name &&
        profile?.birth_date &&
        profile?.avatar_url
    );

    useEffect(() => {
        if (!supabase) {
            console.warn("Supabase client is not initialized. Check your environment variables.");
            setLoading(false);
            return;
        }

        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            }
            if (data) {
                setProfile(data);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string) => {
        if (!supabase) throw new Error("Supabase not configured");
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });
        if (error) throw error;
    };

    const signInWithPassword = async (email: string, password: string) => {
        if (!supabase) throw new Error("Supabase not configured");
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        if (!supabase) throw new Error("Supabase not configured");
        const fullName = `${firstName} ${lastName}`.trim();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) throw error;

        // Manually create profile if trigger fails or just to be safe/immediate
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert([
                    {
                        id: data.user.id,
                        full_name: fullName,
                        first_name: firstName,
                        last_name: lastName,
                        updated_at: new Date().toISOString(),
                    },
                ]).select();

            if (!profileError) {
                setShowWelcomeModal(true);
            } else {
                console.log("Profile upsert result:", profileError);
                // Even if profile exists, we show welcome modal for new sign ups
                setShowWelcomeModal(true);
            }
        }
    };

    const updateProfile = async (updates: any) => {
        if (!user || !supabase) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;

            // Refresh profile
            await fetchProfile(user.id);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const uploadAvatar = async (file: File) => {
        if (!user || !supabase) throw new Error("Not authenticated");

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            await updateProfile({ avatar_url: publicUrl });
            return publicUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    };

    const signOut = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setSession(null);
        setProfile(null);
        localStorage.removeItem('jornada_offline_user'); // Clean up old mock data if present
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            isProfileComplete,
            loading,
            showWelcomeModal,
            setShowWelcomeModal,
            signIn,
            signInWithPassword,
            signUp,
            signOut,
            updateProfile,
            uploadAvatar
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
