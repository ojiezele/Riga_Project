import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import RigaLogo from './RigaLogo.jsx';

export default function AuthPage({ onLoginSuccess, onBackToLanding }) {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please provide both email and password.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            const userObj = {
                name: name || (email.split('@')[0]),
                email: email,
                role: 'Owner',
                plan: 'WordPress Pro SaaS'
            };
            onLoginSuccess(userObj);
        }, 600);
    };

    const handleQuickLogin = (demoRole) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (demoRole === 'Owner') {
                onLoginSuccess({
                    name: 'Ojiezele',
                    email: 'ojiezele0@gmail.com',
                    role: 'Owner',
                    plan: 'WordPress Pro SaaS'
                });
            } else {
                onLoginSuccess({
                    name: 'Sarah Jenkins',
                    email: 'sarah@riga.site',
                    role: 'Editor',
                    plan: 'Team Member'
                });
            }
        }, 400);
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
                            className="w-full py-2.5 px-4 rounded-xl text-white bg-black hover:bg-neutral-800 text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Login' : 'Register'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Logins for Fast Access */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center text-xs text-gray-500 mb-3 font-medium">Quick Demo:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('Owner')}
                                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors"
                            >
                                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-gray-800 flex-shrink-0" />
                                    <span>Owner</span>
                                </div>
                                <div className="text-[11px] text-gray-500 truncate mt-0.5">ojiezele0@gmail.com</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin('Editor')}
                                className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors"
                            >
                                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-gray-800 flex-shrink-0" />
                                    <span>Editor</span>
                                </div>
                                <div className="text-[11px] text-gray-500 truncate mt-0.5">sarah@riga.site</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
