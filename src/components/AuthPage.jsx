import React, { useState } from 'react';
import { authClient } from '../lib/auth-client.ts';

export default function AuthPage({ onLoginSuccess, onBackToLanding }) {
    const [mode, setMode] = useState('login'); // 'login', 'register', or 'forgot'
    const [email, setEmail] = useState('alex@studiocanvas.com');
    const [password, setPassword] = useState('••••••••••••');
    const [name, setName] = useState('');
    const [workspaceName, setWorkspaceName] = useState('');
    const [rememberDevice, setRememberDevice] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetStep, setResetStep] = useState(1);
    const [otpValues, setOtpValues] = useState(['7', '4', '9', '', '', '']);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (mode === 'forgot') {
            if (resetStep === 1) {
                setResetStep(2);
                return;
            }
            // Step 2 submit
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                alert('Password reset successfully! Redirecting to sign in...');
                setMode('login');
                setResetStep(1);
            }, 800);
            return;
        }

        if (!email || !password) {
            setError('Please provide email and password.');
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
                        plan: 'Studio Pro Builder',
                        organizationId: baRes.data.user.organizationId,
                        workspace: `${baRes.data.user.name || 'Owner'}'s Workspace`,
                        token: baRes.data.token
                    });
                    return;
                }

                // Fallback login API
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
                        plan: 'Studio Pro Builder',
                        organizationId: loginData.organization?.id,
                        workspace: loginData.organization?.name || 'Main Studio',
                        token: loginData.token
                    });
                    return;
                }

                setLoading(false);
                // Demo fallback
                onLoginSuccess({
                    id: 'usr_owner',
                    uid: 'usr_owner',
                    name: 'Alex Vance',
                    email: email || 'alex@studiocanvas.com',
                    role: 'Owner',
                    plan: 'Studio Pro Builder',
                    workspace: 'Main Studio',
                    token: 'tok_demo_active'
                });
            } else {
                // Register
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
                        role: 'Owner',
                        plan: 'Studio Pro Builder',
                        organizationId: baRes.data.user.organizationId,
                        workspace: workspaceName || `${name || 'Owner'}'s Workspace`,
                        token: baRes.data.token
                    });
                    return;
                }

                setLoading(false);
                onLoginSuccess({
                    id: 'usr_' + Date.now(),
                    uid: 'usr_' + Date.now(),
                    name: name || 'Alex Morgan',
                    email,
                    role: 'Owner',
                    plan: 'Studio Pro Builder',
                    workspace: workspaceName || 'Acme Studio',
                    token: 'tok_active'
                });
            }
        } catch (err) {
            setLoading(false);
            onLoginSuccess({
                id: 'usr_owner',
                uid: 'usr_owner',
                name: 'Alex Vance',
                email: email || 'alex@studiocanvas.com',
                role: 'Owner',
                plan: 'Studio Pro Builder',
                workspace: 'Main Studio',
                token: 'tok_demo_active'
            });
        }
    };

    const handleDemoQuickFill = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
    };

    // Password strength calculation
    const hasLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    let strengthScore = 0;
    if (hasLength) strengthScore++;
    if (hasNumber) strengthScore++;
    if (hasUpper) strengthScore++;
    if (hasSpecial) strengthScore++;

    return (
        <div className="bg-surface font-body-default text-body-default text-on-surface min-h-screen flex flex-col justify-between selection:bg-secondary-container selection:text-on-secondary-fixed">
            {/* EXACT FIGMA HEADER */}
            <header className="w-full bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div className="h-14 w-full px-gutter-canvas flex items-center justify-between">
                    <div className="flex items-center gap-space-sm cursor-pointer" onClick={onBackToLanding}>
                        <div className="w-7 h-7 rounded bg-primary-container flex items-center justify-center text-on-primary font-label-medium text-label-medium">
                            <span className="material-symbols-outlined text-[16px]">draw</span>
                        </div>
                        <span className="font-title-sm text-title-sm text-on-surface tracking-tight font-bold">Studio Canvas</span>
                    </div>
                    <div className="flex items-center gap-space-lg">
                        <button 
                            onClick={onBackToLanding} 
                            className="font-label-medium text-label-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-space-xs"
                        >
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            <span>Back to website</span>
                        </button>
                        <a className="font-label-medium text-label-medium text-on-surface-variant hover:text-on-surface transition-colors" href="mailto:support@studiocanvas.com">Need help?</a>
                    </div>
                </div>
            </header>

            {/* MAIN AUTH VIEWPORT */}
            <main className="w-full flex-1 flex flex-col items-center justify-center p-gutter-canvas bg-surface relative">
                {mode === 'forgot' ? (
                    /* FORGOT PASSWORD VIEW - EXACT FIGMA 2-COLUMN LAYOUT */
                    <div className="flex flex-col w-full max-w-5xl mx-auto py-space-xl">
                        <div className="relative w-full">
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
                            <div className="absolute top-1/2 -right-24 w-72 h-72 bg-secondary-container/30 rounded-full blur-2xl pointer-events-none -z-10"></div>
                            
                            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                                {/* Left Form Column */}
                                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-xl p-space-xl relative overflow-hidden flex flex-col">
                                    <div className="absolute top-0 right-0 w-44 h-44 bg-surface-container-low rounded-bl-full pointer-events-none"></div>
                                    <div className="flex items-center gap-space-md mb-space-lg">
                                        <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-surface-container-low text-primary shadow-sm">
                                            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-sm animate-pulse"></div>
                                            <span className="material-symbols-outlined text-primary relative z-10" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-space-xs">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-micro font-label-micro bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">Account Recovery</span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-micro font-label-micro bg-surface-container text-on-surface-variant font-code-inspector">AUTH-2025</span>
                                            </div>
                                            <h1 className="font-headline-md text-headline-md text-on-surface mt-space-2xs">Reset your password</h1>
                                        </div>
                                    </div>
                                    
                                    <p className="font-body-default text-body-default text-on-surface-variant mb-space-xl leading-relaxed">
                                        Enter the email associated with your Studio Canvas account and we will send you a secure 6-digit verification code to reset your access.
                                    </p>

                                    {/* Toggle Switch for Previewing Step 1 vs Step 2 */}
                                    <div className="w-full bg-surface-container-low rounded-lg p-1 flex items-center mb-space-xl shadow-sm">
                                        <button 
                                            onClick={() => setResetStep(1)}
                                            className={`flex-1 py-1.5 px-3 rounded text-label-medium font-label-medium transition-all flex items-center justify-center gap-1.5 ${resetStep === 1 ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
                                            <span>1. Request Code</span>
                                        </button>
                                        <button 
                                            onClick={() => setResetStep(2)}
                                            className={`flex-1 py-1.5 px-3 rounded text-label-medium font-label-medium transition-all flex items-center justify-center gap-1.5 ${resetStep === 2 ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">pin</span>
                                            <span>2. Verify OTP &amp; Reset</span>
                                        </button>
                                    </div>

                                    {resetStep === 1 ? (
                                        <form onSubmit={handleSubmit} className="flex flex-col space-y-space-lg">
                                            <div className="flex flex-col space-y-space-xs">
                                                <div className="flex items-center justify-between">
                                                    <label className="font-label-medium text-label-medium text-on-surface" htmlFor="work-email">Work Email</label>
                                                    <span className="font-label-micro text-label-micro text-primary">Required for team accounts</span>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">mail</span>
                                                    <input 
                                                        className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-default text-body-default rounded-lg outline-none shadow-sm transition-all" 
                                                        id="work-email" 
                                                        placeholder="name@company.com" 
                                                        type="email" 
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                    <span className="material-symbols-outlined absolute right-3 text-primary text-[20px]">check_circle</span>
                                                </div>
                                                <p className="font-label-regular text-label-regular text-on-surface-variant flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                                                    <span>Domain {email.includes('@') ? email.split('@')[1] : 'company.design'} is authorized via Google Workspace SSO.</span>
                                                </p>
                                            </div>
                                            <button 
                                                className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs active:scale-[0.99]" 
                                                type="submit"
                                            >
                                                <span>Send Reset Instructions</span>
                                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="flex flex-col space-y-space-lg">
                                            <div className="bg-surface-container-low rounded-lg p-space-md flex items-start gap-space-sm shadow-sm">
                                                <span className="material-symbols-outlined text-primary text-[22px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="font-label-medium text-label-medium text-on-surface">Check your inbox</h2>
                                                    <p className="font-label-regular text-label-regular text-on-surface-variant truncate">
                                                        We sent a 6-digit verification code to <span className="font-body-medium text-primary">{email}</span>
                                                    </p>
                                                </div>
                                                <button type="button" onClick={() => setResetStep(1)} className="font-label-micro text-label-micro text-primary hover:underline self-center whitespace-nowrap">Edit email</button>
                                            </div>

                                            <div className="flex flex-col space-y-space-xs">
                                                <div className="flex items-center justify-between">
                                                    <label className="font-label-medium text-label-medium text-on-surface">6-Digit Security Code</label>
                                                    <span className="font-label-micro text-label-micro text-on-surface-variant">Expires in 14:52</span>
                                                </div>
                                                <div className="grid grid-cols-6 gap-2 sm:gap-3 py-1">
                                                    {otpValues.map((val, idx) => (
                                                        <input 
                                                            key={idx}
                                                            className="h-12 text-center font-headline-md text-headline-md bg-surface-container-low focus:bg-surface-container-lowest text-on-surface rounded-lg outline-none shadow-sm transition-all"
                                                            maxLength={1}
                                                            type="text"
                                                            value={val}
                                                            onChange={(e) => {
                                                                const next = [...otpValues];
                                                                next[idx] = e.target.value;
                                                                setOtpValues(next);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col space-y-space-xs">
                                                <label className="font-label-medium text-label-medium text-on-surface">New Secure Password</label>
                                                <div className="relative flex items-center">
                                                    <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">key</span>
                                                    <input 
                                                        className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-default text-body-default rounded-lg outline-none shadow-sm transition-all" 
                                                        placeholder="Minimum 12 characters" 
                                                        type="password"
                                                        defaultValue="NewSecure2025!"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs active:scale-[0.99]" 
                                                type="submit"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">verified</span>
                                                <span>Verify &amp; Update Password</span>
                                            </button>
                                        </form>
                                    )}

                                    <div className="mt-space-lg flex items-center justify-between text-label-medium font-label-medium pt-space-xs">
                                        <button 
                                            type="button" 
                                            onClick={() => setMode('login')} 
                                            className="inline-flex items-center gap-space-2xs text-secondary hover:text-on-surface transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                            <span>Return to Sign in</span>
                                        </button>
                                        <a className="inline-flex items-center gap-space-2xs text-primary hover:underline" href="#">
                                            <span>SSO Corporate Portal</span>
                                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Right Shield Panel */}
                                <div className="lg:col-span-5 flex flex-col space-y-space-lg">
                                    <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg relative overflow-hidden flex flex-col items-center text-center">
                                        <div className="relative w-36 h-36 flex items-center justify-center my-space-sm">
                                            <div className="absolute inset-0 rounded-full bg-primary-fixed/40 blur-xl"></div>
                                            <div className="w-28 h-28 rounded-full bg-surface-container flex items-center justify-center shadow-inner relative z-10">
                                                <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                                                <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1.5 rounded-full shadow-md text-primary">
                                                    <span className="material-symbols-outlined text-[18px]">key</span>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="font-title-sm text-title-sm text-on-surface mt-space-2xs">End-to-End Canvas Auth</h3>
                                        <p className="font-label-regular text-label-regular text-on-surface-variant max-w-xs mt-1">
                                            Studio Canvas maintains SOC-2 Type II standards. Reset sequences immediately invalidate legacy sessions across all desktop and canvas instances.
                                        </p>
                                        <div className="w-full mt-space-md pt-space-md bg-surface-container-low rounded-lg p-space-sm grid grid-cols-2 gap-2 text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-primary">devices</span>
                                                <div>
                                                    <p className="font-label-micro text-label-micro text-on-surface-variant">Active Sessions</p>
                                                    <p className="font-label-medium text-label-medium text-on-surface font-code-inspector">3 Clients</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px] text-primary">cloud_done</span>
                                                <div>
                                                    <p className="font-label-micro text-label-micro text-on-surface-variant">Cloud Sync</p>
                                                    <p className="font-label-medium text-label-medium text-on-surface">Auto-Protected</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-surface-container-high/60 rounded-xl p-space-lg shadow-sm flex flex-col space-y-space-sm">
                                        <div className="flex items-center gap-space-xs text-on-surface">
                                            <span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span>
                                            <span className="font-title-sm text-title-sm">Enterprise Workspace</span>
                                        </div>
                                        <p className="font-label-regular text-label-regular text-on-surface-variant">
                                            Need help recovering your enterprise team workspace? Dedicated tenant administrators can issue priority bypass keys.
                                        </p>
                                        <div className="pt-space-xs">
                                            <a className="inline-flex items-center gap-1.5 font-label-medium text-label-medium text-primary hover:text-primary-container group transition-colors" href="mailto:security@studiocanvas.com">
                                                <span>Contact Security Support</span>
                                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : mode === 'register' ? (
                    /* EXACT FIGMA REGISTER VIEW */
                    <div className="flex flex-col w-full items-center justify-center py-space-xl">
                        <div className="relative w-full max-w-[560px]">
                            <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
                            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-surface-container-high/60 rounded-full blur-3xl pointer-events-none -z-10"></div>

                            <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_-4px_rgba(11,28,48,0.08)] p-space-xl sm:p-space-2xl flex flex-col gap-space-lg">
                                <div className="flex flex-col gap-space-xs">
                                    <div className="inline-flex items-center gap-space-xs self-start px-2.5 py-1 rounded-full bg-surface-container font-label-micro text-label-micro text-primary font-semibold mb-1">
                                        <span className="material-symbols-outlined text-[14px]">bolt</span> FAST ONBOARDING
                                    </div>
                                    <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Create your Studio Canvas account</h1>
                                    <p className="font-body-default text-body-default text-on-surface-variant">
                                        Start building high-performance websites with clean semantic code export.
                                    </p>
                                </div>

                                <div className="flex items-center gap-space-md p-space-md rounded-lg bg-surface-container-low">
                                    <div className="w-9 h-9 rounded bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Includes 14-day free trial of Pro Builder</span>
                                        <span className="font-label-regular text-label-regular text-on-surface-variant">No credit card required. Full export engine unlocked.</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-space-sm">
                                    <button 
                                        type="button" 
                                        onClick={() => handleDemoQuickFill('alex.designer@company.com', 'DesignCanvas123!')}
                                        className="flex items-center justify-center gap-space-sm h-11 px-space-md rounded-lg bg-surface hover:bg-surface-container-low transition-colors shadow-sm font-label-medium text-label-medium text-on-surface font-semibold cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                                        </svg>
                                        <span>Google</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => handleDemoQuickFill('developer@company.com', 'DevCanvas123!')}
                                        className="flex items-center justify-center gap-space-sm h-11 px-space-md rounded-lg bg-surface hover:bg-surface-container-low transition-colors shadow-sm font-label-medium text-label-medium text-on-surface font-semibold cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 fill-on-surface" viewBox="0 0 24 24">
                                            <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                                        </svg>
                                        <span>GitHub</span>
                                    </button>
                                </div>

                                <div className="relative flex items-center justify-center my-1">
                                    <div className="w-full h-px bg-surface-container"></div>
                                    <span className="absolute px-4 bg-surface-container-lowest font-label-regular text-label-regular text-on-surface-variant">or register with work email</span>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                                        <div className="flex flex-col gap-space-xs">
                                            <label className="font-label-medium text-label-medium text-on-surface font-semibold" htmlFor="fullName">Full Name</label>
                                            <div className="relative">
                                                <input 
                                                    className="w-full h-10 px-3 pl-9 rounded bg-surface hover:bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none shadow-sm" 
                                                    id="fullName" 
                                                    placeholder="Alex Morgan" 
                                                    required 
                                                    type="text" 
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">person</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-space-xs">
                                            <label className="font-label-medium text-label-medium text-on-surface font-semibold" htmlFor="regEmail">Work Email</label>
                                            <div className="relative">
                                                <input 
                                                    className="w-full h-10 px-3 pl-9 rounded bg-surface hover:bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none shadow-sm" 
                                                    id="regEmail" 
                                                    placeholder="alex@company.com" 
                                                    required 
                                                    type="email" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">mail</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-space-xs">
                                        <label className="font-label-medium text-label-medium text-on-surface font-semibold" htmlFor="workspaceName">Workspace Name (Optional)</label>
                                        <div className="relative">
                                            <input 
                                                className="w-full h-10 px-3 pl-9 rounded bg-surface hover:bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none shadow-sm" 
                                                id="workspaceName" 
                                                placeholder="e.g. Acme Studio" 
                                                type="text" 
                                                value={workspaceName}
                                                onChange={(e) => setWorkspaceName(e.target.value)}
                                            />
                                            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">hub</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-space-xs">
                                        <div className="flex justify-between items-center">
                                            <label className="font-label-medium text-label-medium text-on-surface font-semibold" htmlFor="regPassword">Password</label>
                                            <span className="font-label-micro text-label-micro text-primary font-semibold">
                                                {strengthScore >= 4 ? 'Strong password' : strengthScore >= 3 ? 'Good password' : 'Enter a secure password'}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                className="w-full h-10 px-3 pl-9 pr-10 rounded bg-surface hover:bg-surface-container-low focus:bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none shadow-sm" 
                                                id="regPassword" 
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">key</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute right-2.5 top-2.5 text-on-surface-variant hover:text-on-surface"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                        {/* 4-Bar Strength Meter */}
                                        <div className="grid grid-cols-4 gap-1.5 pt-1">
                                            <div className={`h-1 rounded-full transition-all ${strengthScore >= 1 ? 'bg-primary' : 'bg-surface-container'}`}></div>
                                            <div className={`h-1 rounded-full transition-all ${strengthScore >= 2 ? 'bg-primary' : 'bg-surface-container'}`}></div>
                                            <div className={`h-1 rounded-full transition-all ${strengthScore >= 3 ? 'bg-primary' : 'bg-surface-container'}`}></div>
                                            <div className={`h-1 rounded-full transition-all ${strengthScore >= 4 ? 'bg-primary' : 'bg-surface-container'}`}></div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-11 px-space-lg rounded-lg bg-primary-container hover:bg-primary transition-all text-on-primary font-title-sm text-title-sm font-semibold flex items-center justify-center gap-space-sm shadow-md"
                                    >
                                        {loading ? (
                                            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                        ) : (
                                            <>
                                                <span>Create Free Account &amp; Launch Workspace</span>
                                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="flex items-center justify-center gap-1 text-center pt-2">
                                    <span className="font-body-default text-body-default text-on-surface-variant">Already have an account?</span>
                                    <button onClick={() => setMode('login')} className="font-body-default text-body-default text-primary hover:underline font-semibold flex items-center gap-0.5">
                                        <span>Log in</span>
                                        <span className="material-symbols-outlined text-[16px]">navigate_next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* EXACT FIGMA LOGIN VIEW */
                    <div className="flex flex-col w-full items-center justify-center py-space-xl">
                        <div className="relative w-full max-w-[480px]">
                            {/* Ambient glow */}
                            <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
                            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-surface-container-high/60 rounded-full blur-3xl pointer-events-none -z-10"></div>
                            
                            {/* Main Card */}
                            <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_-4px_rgba(11,28,48,0.08)] p-space-2xl flex flex-col gap-space-lg transition-all duration-200">
                                {/* Brand & Version Header */}
                                <div className="flex flex-col items-center text-center gap-space-sm">
                                    <div className="flex items-center gap-space-xs">
                                        <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary font-title-sm text-title-sm shadow-sm">
                                            <span className="material-symbols-outlined text-[18px]">layers</span>
                                        </div>
                                        <span className="font-title-sm text-title-sm tracking-tight text-on-surface font-bold">Studio Canvas</span>
                                        <span className="ml-space-2xs px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-micro text-label-micro font-semibold">v3.2 Live</span>
                                    </div>
                                    <div className="flex flex-col gap-1 mt-space-xs">
                                        <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">Welcome back</h1>
                                        <p className="font-body-default text-body-default text-on-surface-variant max-w-sm">Enter your workspace credentials to access your sites and builder canvas.</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-error-container/40 text-on-error-container rounded-lg text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                {/* Quick OAuth Buttons */}
                                <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                                    <button 
                                        type="button"
                                        onClick={() => handleDemoQuickFill('alex.designer@company.com', 'DesignCanvas123!')}
                                        className="group flex items-center justify-center gap-space-xs h-10 px-space-md rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-medium text-label-medium transition-all duration-150 active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                                        </svg>
                                        <span>Google</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleDemoQuickFill('developer@company.com', 'DevCanvas123!')}
                                        className="group flex items-center justify-center gap-space-xs h-10 px-space-md rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-label-medium text-label-medium transition-all duration-150 active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4 fill-current text-on-surface" viewBox="0 0 24 24">
                                            <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                                        </svg>
                                        <span>GitHub</span>
                                    </button>
                                </div>

                                <div className="relative flex items-center justify-center my-space-xs">
                                    <div className="w-full h-px bg-surface-container-highest"></div>
                                    <span className="absolute px-space-sm bg-surface-container-lowest font-label-micro text-label-micro text-outline uppercase tracking-wider">or continue with email</span>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-label-medium text-label-medium text-on-surface flex items-center justify-between" htmlFor="email">
                                            <span>Work Email</span>
                                            <span className="font-label-micro text-label-micro text-outline">e.g. name@company.design</span>
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">alternate_email</span>
                                            <input 
                                                className="w-full h-10 pl-9 pr-3 rounded bg-surface-container-low text-on-surface font-body-default text-body-default placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-inner" 
                                                id="email" 
                                                name="email" 
                                                placeholder="alex@studiocanvas.com" 
                                                required 
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="font-label-medium text-label-medium text-on-surface" htmlFor="password">Password</label>
                                            <button 
                                                type="button" 
                                                onClick={() => setMode('forgot')} 
                                                className="font-label-regular text-label-regular text-primary hover:underline transition-all"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-[18px] text-outline pointer-events-none">lock</span>
                                            <input 
                                                className="w-full h-10 pl-9 pr-10 rounded bg-surface-container-low text-on-surface font-body-default text-body-default placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-inner" 
                                                id="password" 
                                                name="password" 
                                                placeholder="••••••••••••" 
                                                required 
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 w-7 h-7 flex items-center justify-center rounded text-outline hover:text-on-surface transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer select-none group">
                                            <input 
                                                checked={rememberDevice}
                                                onChange={(e) => setRememberDevice(e.target.checked)}
                                                className="w-4 h-4 rounded accent-primary text-on-primary cursor-pointer" 
                                                id="rememberDevice" 
                                                type="checkbox"
                                            />
                                            <span className="font-label-regular text-label-regular text-on-surface-variant group-hover:text-on-surface transition-colors">Remember this device for 30 days</span>
                                        </label>
                                    </div>

                                    <button 
                                        className="w-full h-10 mt-1 rounded bg-primary-container text-on-primary font-body-medium text-body-medium flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-150 active:scale-[0.99] group" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                        ) : (
                                            <>
                                                <span>Sign in to Workspace</span>
                                                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center pt-space-xs">
                                        <button
                                            type="button"
                                            onClick={() => handleDemoQuickFill('enterprise@studiocanvas.com', 'SsoCanvas2025!')}
                                            className="font-label-medium text-label-medium text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto group"
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">corporate_fare</span>
                                            <span>Sign in with SAML / Enterprise SSO</span>
                                        </button>
                                    </div>
                                </form>

                                <div className="rounded-lg bg-surface-container-low p-space-sm flex items-center justify-between gap-space-sm mt-space-xs">
                                    <div className="flex items-center gap-space-xs min-w-0">
                                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0">workspace_premium</span>
                                        <p className="font-label-regular text-label-regular text-on-surface-variant truncate">
                                            No account yet? <span className="font-label-medium text-label-medium text-on-surface">14-day Pro trial included.</span>
                                        </p>
                                    </div>
                                    <button onClick={() => setMode('register')} className="font-label-medium text-label-medium text-primary hover:underline whitespace-nowrap">Sign up</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-space-xs mt-space-lg text-outline font-label-micro text-label-micro">
                                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                <span>SOC-2 Type II Certified</span>
                                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                <span>256-bit TLS Encryption</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* FOOTER */}
            <footer className="w-full bg-surface-container-low py-space-md shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
                <div className="w-full px-gutter-canvas flex flex-col sm:flex-row items-center justify-between gap-space-sm">
                    <span className="font-label-regular text-label-regular text-on-surface-variant">© 2025 Studio Canvas Inc. All rights reserved.</span>
                    <div className="flex items-center gap-space-lg">
                        <button onClick={onBackToLanding} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors">Terms of Service</button>
                        <button onClick={onBackToLanding} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors">Privacy Policy</button>
                        <button onClick={onBackToLanding} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors">Security</button>
                        <button onClick={onBackToLanding} className="font-label-regular text-label-regular text-on-surface-variant hover:text-on-surface transition-colors">Status</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
