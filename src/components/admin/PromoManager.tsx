"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { createPromoCode, deletePromoCode } from "@/app/actions/admin-actions";
import { Loader2, Plus, Trash2, Tag, Ticket, Calendar } from "lucide-react";

type PromoCode = {
    id: string;
    code: string;
    discount: number;
    usageLimit: number | null;
    usedCount: number | null;
    specificSlotId: string | null;
    slot?: { startTime: Date } | null;
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
        if (!confirm("Usunąć ten kod?")) return;
        await deletePromoCode(id);
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-primary" /> Kody Rabatowe
                </h3>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Dodaj
                </button>
            </div>

            <div className="divide-y divide-slate-100">
                {codes.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">Brak kodów</div>}

                {codes.map((code) => {
                    const linkedSlot = code.slot || slots.find(s => s.id === code.specificSlotId);

                    return (
                        <div key={code.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-base font-bold text-slate-900 tracking-wider">{code.code}</span>
                                    <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-xs font-bold">-{code.discount}%</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><Ticket className="w-3 h-3" /> {code.usedCount}/{code.usageLimit}</span>

                                    {linkedSlot ? (
                                        <span className="flex items-center gap-1 text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(linkedSlot.startTime), "d MMM HH:mm", { locale: pl })}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Globalny</span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => handleDelete(code.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    );
                })}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Nowy Kod</h3>
                        <form action={handleSubmit} className="space-y-4">
                            <input name="code" required placeholder="KOD (np. LATO)" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="discount" type="number" required placeholder="Rabat %" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary" />
                                <input name="usageLimit" type="number" defaultValue={100} placeholder="Limit" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Powiąż z wydarzeniem</label>
                                <select name="specificSlotId" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary appearance-none">
                                    <option value="GLOBAL">Brak (Kod Globalny)</option>
                                    <optgroup label="Dostępne Terminy">
                                        {slots.map(slot => (
                                            <option key={slot.id} value={slot.id}>
                                                {format(new Date(slot.startTime), "d MMM, HH:mm", { locale: pl })}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-500 hover:text-slate-900">Anuluj</button>
                                <button type="submit" disabled={isPending} className="flex-1 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark flex items-center justify-center gap-2">
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
