// src/components/admin/PromoManager.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { createPromoCode, deletePromoCode } from "@/app/actions/admin-actions";
import { Loader2, Plus, Trash2, Tag, Ticket, Calendar } from "lucide-react";

// Typy dopasowane do Twojego schema i tego co zwraca getAdminData
type PromoCode = {
    id: string;
    code: string;
    discount: number;
    usageLimit: number | null;
    usedCount: number | null;
    specificSlotId: string | null; // <-- Twoja nazwa pola
    slot?: { startTime: Date } | null; // Relacja z Drizzle (opcjonalna)
};

type Slot = {
    id: string;
    startTime: Date;
};

export function PromoManager({ codes, slots }: { codes: PromoCode[], slots: Slot[] }) {
    const [isPending, setIsPending] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        await createPromoCode(formData);
        setIsPending(false);
        setIsModalOpen(false);
    }

    async function handleDelete(id: string) {
        if(!confirm("Usunąć ten kod?")) return;
        await deletePromoCode(id);
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                <h3 className="text-xl font-serif text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-500" /> Kody Rabatowe
                </h3>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-400 transition-colors">
                    <Plus className="w-4 h-4" /> Dodaj
                </button>
            </div>

            <div className="divide-y divide-zinc-800">
                {codes.length === 0 && <div className="p-8 text-center text-zinc-600">Brak kodów</div>}

                {codes.map((code) => {
                    // Próbujemy pobrać slot z relacji (code.slot) LUB szukamy go ręcznie w tablicy slots
                    const linkedSlot = code.slot || slots.find(s => s.id === code.specificSlotId);

                    return (
                        <div key={code.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-lg font-bold text-white tracking-wider">{code.code}</span>
                                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">-{code.discount}%</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <span className="flex items-center gap-1"><Ticket className="w-3 h-3" /> {code.usedCount}/{code.usageLimit}</span>

                                    {linkedSlot ? (
                                        <span className="flex items-center gap-1 text-cyan-500 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(linkedSlot.startTime), "d MMM HH:mm", {locale: pl})}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Globalny</span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => handleDelete(code.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <h3 className="text-xl font-bold text-white mb-6">Nowy Kod</h3>
                        <form action={handleSubmit} className="space-y-4">
                            <input name="code" required placeholder="KOD (np. LATO)" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="discount" type="number" required placeholder="Rabat %" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                                <input name="usageLimit" type="number" defaultValue={100} placeholder="Limit" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Powiąż z wydarzeniem</label>
                                <select name="specificSlotId" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-purple-500 appearance-none">
                                    <option value="GLOBAL">Brak (Kod Globalny)</option>
                                    <optgroup label="Dostępne Terminy">
                                        {slots.map(slot => (
                                            <option key={slot.id} value={slot.id}>
                                                📅 {format(new Date(slot.startTime), "d MMM, HH:mm", {locale: pl})}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-zinc-400 hover:text-white">Anuluj</button>
                                <button type="submit" disabled={isPending} className="flex-1 bg-white text-black font-bold rounded-lg hover:bg-purple-400 flex items-center justify-center gap-2">
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Utwórz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}