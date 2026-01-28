// src/app/login/page.tsx
"use client";

import { useActionState } from "react"; // React 19 hook
import { login } from "./actions";
import { Loader2, Lock, Terminal, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-purple-500 selection:text-white">

            {/* Tło Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">

                {/* Header */}
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 shadow-2xl shadow-purple-900/10">
                        <Lock className="w-6 h-6 text-purple-500" />
                    </Link>
                    <h1 className="text-2xl font-serif font-bold text-white mb-2">System Access</h1>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                        /// RESTRICTED AREA: ADMIN ONLY
                    </p>
                </div>

                {/* Karta Logowania */}
                <div className="bg-black border border-zinc-800 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                    {/* Efekt skanowania na górze */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

                    <form action={formAction} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                Identifier (Email)
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="admin@wetalk.pl"
                                className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white text-sm font-mono focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                Security Key (Password)
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••••••"
                                className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white text-sm font-mono focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-700"
                            />
                        </div>

                        {state?.error && (
                            <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono">
                                /// ERROR: {state.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs h-12 hover:bg-purple-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-zinc-700 font-mono">
                        SECURE CONNECTION ESTABLISHED<br/>
                        IP: LOGGED
                    </p>
                </div>
            </div>
        </div>
    );
}