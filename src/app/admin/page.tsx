// src/app/admin/page.tsx
import { getAdminData } from "@/app/actions/admin-actions";
import { PromoManager } from "@/components/admin/PromoManager";
import { SlotManager } from "@/components/admin/SlotManager"; // <--- NOWY IMPORT
import { Terminal, ShieldCheck, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { codes, allSlots } = await getAdminData();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-zinc-400">
                        <Terminal className="w-4 h-4 text-purple-500" />
                        <span>ADMIN_CONSOLE_V1</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-600 hidden md:inline-block">LOGGED: {user.email}</span>
                        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1">EXIT <LogOut className="w-3 h-3" /></Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="mb-12 flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">Panel Główny</h1>
                        <p className="text-zinc-500">Zarządzanie dostępnością i promocjami.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEWA KOLUMNA: MANAGERY */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 1. Zarządzanie Terminami */}
                        <SlotManager slots={allSlots} />

                        {/* 2. Zarządzanie Kodami */}
                        <PromoManager codes={codes} slots={allSlots} />
                    </div>

                    {/* PRAWA KOLUMNA: STATUS */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> System Status
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm p-3 bg-black/40 rounded-lg border border-zinc-800/50">
                                    <span className="text-zinc-400">Aktywne Terminy</span>
                                    <span className="text-white font-mono font-bold text-lg">{allSlots.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-3 bg-black/40 rounded-lg border border-zinc-800/50">
                                    <span className="text-zinc-400">Aktywne Kody</span>
                                    <span className="text-purple-400 font-mono font-bold text-lg">{codes.length}</span>
                                </div>

                                <div className="pt-4 border-t border-zinc-800 mt-4">
                                    <p className="text-[10px] text-zinc-600 font-mono text-center">
                                        DATABASE CONNECTION: STABLE<br/>
                                        AUTH SECURE: TRUE
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}