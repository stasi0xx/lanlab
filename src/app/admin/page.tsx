// src/app/admin/page.tsx
import { getAdminData } from "@/app/actions/admin-actions";
import { PromoManager } from "@/components/admin/PromoManager";
import { Terminal, ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    // 1. Sprawdzamy Auth (Double check na poziomie strony)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 2. Pobieramy dane
    const { codes, allSlots } = await getAdminData();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">

            {/* TŁO */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

            {/* NAVBAR ADMINA */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-zinc-400">
                        <Terminal className="w-4 h-4 text-purple-500" />
                        <span>ADMIN_CONSOLE_V1</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-600 hidden md:inline-block">
                            LOGGED AS: {user.email}
                        </span>
                        <form action="/auth/signout" method="post">
                            {/* Tutaj przydałby się prosty guzik wylogowania, ale to detal */}
                            <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1">
                                EXIT <LogOut className="w-3 h-3" />
                            </Link>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-2">Witaj, Administratorze.</h1>
                    <p className="text-zinc-500 max-w-2xl">
                        Masz pełną kontrolę nad systemem rezerwacji. Poniżej znajdziesz narzędzia do zarządzania kampaniami marketingowymi.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEWA KOLUMNA: KODY RABATOWE */}
                    <div className="lg:col-span-2">
                        <PromoManager codes={codes} slots={allSlots} />
                    </div>

                    {/* PRAWA KOLUMNA: STATYSTYKI / INFO (Placeholder na przyszłość) */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> System Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Database</span>
                                    <span className="text-green-500 font-mono">CONNECTED</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Auth Service</span>
                                    <span className="text-green-500 font-mono">SECURE</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Active Slots</span>
                                    <span className="text-white font-mono">{allSlots.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tu możesz dodać np. listę ostatnich rezerwacji w przyszłości */}
                    </div>

                </div>
            </main>
        </div>
    );
}