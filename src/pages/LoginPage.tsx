import React, { useState, useEffect } from 'react';
import { BookOpen, LogIn, UserPlus, Loader2, Check, X, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';
import { cn } from '../utils/cn';

export const LoginPage: React.FC = () => {
    const { signInWithPassword, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Password Validation State
    const [pwdRequirements, setPwdRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        match: false
    });

    useEffect(() => {
        setPwdRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            match: password === confirmPassword && password !== ''
        });
    }, [password, confirmPassword]);

    const isPasswordValid = Object.values(pwdRequirements).every(Boolean);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isSignUp) {
                if (!isPasswordValid) {
                    throw new Error("A senha não atende a todos os requisitos.");
                }
                await signUp(email, password, firstName, lastName);
                setSuccessMessage("Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro antes de entrar.");
                setIsSignUp(false); // Switch to login view
            } else {
                await signInWithPassword(email, password);
                // If successful, the AuthContext state change triggers re-render/redirect in AppRoutes
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            if (err.message.includes('already registered')) {
                setError('Este e-mail já está cadastrado. Tente fazer login ou recupere sua senha.');
            } else if (err.message.includes('Invalid login credentials')) {
                setError('E-mail ou senha incorretos.');
            } else {
                setError(err.message || 'Ocorreu um erro. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-sky-100 p-4 rounded-3xl mb-4">
                        <BookOpen className="w-10 h-10 text-sky-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Jornada 2026</h1>
                    <p className="text-slate-500 mt-2 font-medium">Sua jornada bíblica cronológica</p>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-medium border border-emerald-100 flex items-start gap-3">
                        <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>{successMessage}</div>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {isSignUp && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                                    placeholder="João"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Sobrenome</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                                    placeholder="Silva"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirmar Senha</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={cn(
                                        "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-medium",
                                        confirmPassword && !pwdRequirements.match && "border-red-300 focus:ring-red-200"
                                    )}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-2">
                                <p className="font-bold text-slate-500 mb-2 text-xs uppercase tracking-widest">Requisitos da Senha:</p>
                                <PasswordRequirement met={pwdRequirements.length} text="Mínimo de 8 caracteres" />
                                <PasswordRequirement met={pwdRequirements.uppercase} text="Uma letra maiúscula" />
                                <PasswordRequirement met={pwdRequirements.lowercase} text="Uma letra minúscula" />
                                <PasswordRequirement met={pwdRequirements.number} text="Um número" />
                                <PasswordRequirement met={pwdRequirements.special} text="Um caractere especial (!@#$)" />
                                <PasswordRequirement met={pwdRequirements.match} text="Senhas coincidem" />
                            </div>
                        </>
                    )}

                    {!isSignUp && (
                        <div className="text-right">
                            <a href="#" className="text-xs font-bold text-slate-400 hover:text-sky-500 transition-colors">
                                Esqueceu a senha?
                            </a>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (isSignUp && !isPasswordValid)}
                        className={cn(
                            "w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group",
                            loading || (isSignUp && !isPasswordValid)
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20"
                        )}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            isSignUp ? <><UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Criar Conta</> : <><LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" /> Entrar</>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                            setSuccessMessage(null);
                        }}
                        className="text-sm font-bold text-sky-500 hover:text-sky-600 transition-colors"
                    >
                        {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={cn("flex items-center gap-2 transition-colors duration-300", met ? "text-emerald-600" : "text-slate-400")}>
        {met ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
        <span className={cn("font-medium", met && "line-through opacity-70")}>{text}</span>
    </div>
);
