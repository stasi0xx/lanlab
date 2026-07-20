import { getAdminData } from "@/app/actions/admin-actions";
import { getKubaAdminData } from "@/app/actions/kuba-actions";
import { PromoManager } from "@/components/admin/PromoManager";
import { SlotManager } from "@/components/admin/SlotManager";
import { KubaKnowledgeManager } from "@/components/admin/KubaKnowledgeManager";
import { ShieldCheck, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const [{ codes, allSlots }, kuba] = await Promise.all([
        getAdminData(),
        getKubaAdminData(),
    ]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-primary text-white font-display font-bold text-xs">L</span>
                        <span className="font-display font-bold text-sm tracking-tight text-slate-900">Panel LANLAB</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 hidden md:inline-block">{user.email}</span>
                        <Link href="/" className="text-xs font-bold text-slate-500 hover:text-brand-primary flex items-center gap-1">
                            Wyjdź <LogOut className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10 max-w-6xl">
                <div className="mb-10 flex items-center gap-4">
                    <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Panel Główny</h1>
                        <p className="text-slate-500 text-sm">Terminy, kody rabatowe i wiedza KUBY.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-8">
                        <SlotManager slots={allSlots} />
                        <PromoManager codes={codes} slots={allSlots} />
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-slate-200 bg-white sticky top-24">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-brand-primary" /> Status systemu
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500">Aktywne terminy</span>
                                    <span className="text-slate-900 font-bold text-lg">{allSlots.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500">Aktywne kody</span>
                                    <span className="text-brand-primary font-bold text-lg">{codes.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="text-slate-500">Pytania FAQ</span>
                                    <span className="text-slate-900 font-bold text-lg">{kuba.faqs.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <KubaKnowledgeManager knowledge={kuba.knowledge} faqs={kuba.faqs} news={kuba.news} />
            </main>
        </div>
    );
}
