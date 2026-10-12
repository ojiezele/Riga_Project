import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';
import { authClient } from '../lib/auth-client.ts';

export default function AuthPage({ onLoginSuccess, onBackToLanding }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please provide both email and password.');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                const baRes = await authClient.signIn.email({
                    email,
                    password,
                });

                if (baRes?.data?.user) {
                    setLoading(false);
                    onLoginSuccess({
                        id: baRes.data.user.id,
                        uid: baRes.data.user.id,
                        name: baRes.data.user.name || email.split('@')[0],
                        email: baRes.data.user.email || email,
                        role: baRes.data.user.role || 'Owner',
                        plan: baRes.data.user.plan && !baRes.data.user.plan.includes('WordPress') ? baRes.data.user.plan : 'Riga Enterprise Pro',
                        organizationId: baRes.data.user.organizationId,
                        workspace: `${baRes.data.user.name || 'Owner'}'s Workspace`,
                        token: baRes.data.token
                    });
                    return;
                }

                const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const loginData = await loginRes.json();
                
                if (loginRes.ok && loginData.success) {
                    setLoading(false);
                    onLoginSuccess({
                        id: loginData._id || loginData.uid,
                        uid: loginData.uid || loginData._id,
                        name: loginData.name || email.split('@')[0],
                        email: loginData.email || email,
                        role: loginData.role || 'Owner',
                        plan: loginData.plan && !loginData.plan.includes('WordPress') ? loginData.plan : 'Riga Enterprise Pro',
                        organizationId: loginData.organization?.id,
                        workspace: loginData.organization?.name || 'Main Workspace',
                        token: loginData.token
                    });
                    return;
                }

                setLoading(false);
                setError(baRes?.error?.message || loginData.message || 'Invalid email or password.');
            } else {
                const baRes = await authClient.signUp.email({
                    email,
                    password,
                    name: name || email.split('@')[0],
                });

                if (baRes?.data?.user) {
                    setLoading(false);
                    onLoginSuccess({
                        id: baRes.data.user.id,
                        uid: baRes.data.user.id,
                        name: baRes.data.user.name || name || email.split('@')[0],
                        email: baRes.data.user.email || email,
                        role: baRes.data.user.role || 'Owner',
                        plan: 'Riga Enterprise Pro',
                        organizationId: baRes.data.user.organizationId,
                        workspace: `${baRes.data.user.name || name || 'Owner'}'s Workspace`,
                        token: baRes.data.token
                    });
                    return;
                }

                const regRes = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name || email.split('@')[0], email, password })
                });
                const regData = await regRes.json();

                if (regRes.ok && regData.success) {
                    setLoading(false);
                    onLoginSuccess({
                        id: regData._id || regData.uid,
                        uid: regData.uid || regData._id,
                        name: regData.name || name,
                        email: regData.email || email,
                        role: regData.role || 'Owner',
                        plan: 'Riga Enterprise Pro',
                        organizationId: regData.organizationId,
                        workspace: regData.workspace || 'Main Workspace',
                        token: regData.token
                    });
                    return;
                }

                setLoading(false);
                setError(baRes?.error?.message || regData.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Authentication error. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-black selection:text-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <button 
                    onClick={onBackToLanding}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black mb-6 transition-colors bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Home</span>
                </button>

                <div className="flex justify-center mb-4">
                    <RigaLogo size="lg" />
                </div>
                <h2 className="text-center text-2xl font-extrabold text-gray-950 tracking-tight">
                    {mode === 'login' ? 'Welcome back to Riga' : 'Create your Enterprise Account'}
                </h2>
                <p className="mt-2 text-center text-xs text-gray-500">
                    {mode === 'login' ? 'Enter your credentials to access your workspace' : 'Deploy high-speed multi-tenant sites instantly'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-gray-200/80 sm:px-10">
                    {error && (
                        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text" 
                                        required 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane@company.com"
                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create Account'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <button
                            onClick={() => {
                                setMode(mode === 'login' ? 'register' : 'login');
                                setError('');
                            }}
                            className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                        >
                            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center text-[11px] text-gray-400 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Better Auth RBAC Secured · Neon Postgres Multi-Tenant Isolation</span>
                </div>
            </div>
        </div>
    );
}
