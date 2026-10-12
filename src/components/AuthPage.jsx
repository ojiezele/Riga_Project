import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';
import { authClient } from '../lib/auth-client.ts';

export default function AuthPage({ onLoginSuccess, onBackToLanding }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
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
                // Primary: Better Auth Client Sign In
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
                        plan: baRes.data.user.plan || 'WordPress Pro SaaS',
                        organizationId: baRes.data.user.organizationId,
                        workspace: `${baRes.data.user.name || 'Owner'}'s Workspace`,
                        token: baRes.data.token
                    });
                    return;
                }

                // If user exists in legacy records or needs auto-migration, hit seamless migration endpoint
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
                        plan: loginData.plan || 'WordPress Pro SaaS',
                        organizationId: loginData.organization?.id,
                        workspace: loginData.organization?.name || 'Main Workspace',
                        token: loginData.token
                    });
                    return;
                }

                setLoading(false);
                setError(baRes?.error?.message || loginData.message || 'Invalid email or password.');
            } else {
                // Primary: Better Auth Client Sign Up
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
                        plan: baRes.data.user.plan || 'WordPress Pro SaaS',
                        organizationId: baRes.data.user.organizationId,
                        workspace: `${baRes.data.user.name || name || 'Owner'}'s Workspace`,
                        token: baRes.data.token
                    });
                    return;
                }

                // Fallback direct Better Auth register endpoint
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
                        plan: regData.plan || 'WordPress Pro SaaS',
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <div className="flex justify-center mb-3">
                    <RigaLogo size="lg" />
                </div>
                <h2 className="text-center text-xl font-bold tracking-tight text-gray-900">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="mt-1 text-center text-xs text-gray-500">
                    Manage your hosted websites, custom domains, and visual builder projects.
                </p>

                {/* Better Auth & Neon Badge */}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 py-1 px-3 rounded-full mx-auto w-fit">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Better Auth & Neon DB Active</span>
                </div>
            </div>

            <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <div className="bg-white border border-gray-200 py-6 sm:py-8 px-4 sm:px-10 rounded-2xl shadow-xl">
                    {/* Mode Toggle Pills */}
                    <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200 mb-6">
                        <button 
                            type="button"
                            onClick={() => { setMode('login'); setError(''); }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        >
                            Login
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setMode('register'); setError(''); }}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'register' ? 'bg-black text-white shadow-2xs' : 'text-gray-600 hover:text-black'}`}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Rivera"
                                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ojiezele0@gmail.com"
                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 rounded-xl text-white bg-black hover:bg-neutral-800 text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                        >
                            {loading ? (
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Login with Better Auth' : 'Register with Better Auth'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
