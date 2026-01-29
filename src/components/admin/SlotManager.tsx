"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { createAdminSlot, deleteSlot } from "@/app/actions/admin-actions";
import { Loader2, Plus, Trash2, Calendar, Clock, Users, Eye, Mail, Phone, Ticket, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Rozszerzone typy o rezerwacje i kody
type Booking = {
    id: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    promoCode?: {
        code: string;
        discount: number;
    } | null;
};

type Slot = {
    id: string;
    startTime: Date;
    maxCapacity: number;
    currentBookings: number;
    bookings?: Booking[]; // Tablica rezerwacji
};

export function SlotManager({ slots }: { slots: Slot[] }) {
    const [isPending, setIsPending] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Stan dla modalu szczegółów (trzyma wybrany slot lub null)
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const res = await createAdminSlot(formData);
        setIsPending(false);
        if (res.success) {
            setIsAddModalOpen(false);
        } else {
            alert(res.message);
        }
    }

    async function handleDelete(id: string) {
        if(!confirm("Usunąć ten termin?")) return;
        await deleteSlot(id);
    }

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden mb-8">
            {/* HEADER */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                <div>
                    <h3 className="text-xl font-serif text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-cyan-500" />
                        Harmonogram Sesji
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1">Kliknij "oko", aby zobaczyć listę obecności</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-400 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Dodaj Termin
                </button>
            </div>

            {/* LISTA SLOTÓW */}
            <div className="divide-y divide-zinc-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                {slots.length === 0 && (
                    <div className="p-8 text-center text-zinc-600 font-mono text-sm">Brak zaplanowanych terminów</div>
                )}

                {slots.map((slot) => {
                    const occupancy = (slot.currentBookings / slot.maxCapacity) * 100;
                    const isFull = slot.currentBookings >= slot.maxCapacity;

                    return (
                        <div key={slot.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-6">
                                {/* DATA */}
                                <div className="text-center min-w-[60px]">
                                    <div className="text-xs font-bold text-zinc-500 uppercase">
                                        {format(new Date(slot.startTime), "MMM", { locale: pl })}
                                    </div>
                                    <div className="text-xl font-bold text-white leading-none">
                                        {format(new Date(slot.startTime), "dd")}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-white font-mono text-lg">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        {format(new Date(slot.startTime), "HH:mm")}
                                    </div>

                                    {/* PASEK ZAJĘTOŚCI */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all", isFull ? "bg-red-500" : "bg-cyan-500")}
                                                style={{ width: `${occupancy}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {slot.currentBookings}/{slot.maxCapacity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* GUZIK SZCZEGÓŁÓW (OKO) */}
                                <button
                                    onClick={() => setSelectedSlot(slot)}
                                    className="p-2 bg-zinc-800 text-cyan-500 rounded-lg hover:bg-cyan-900/50 transition-colors"
                                    title="Zobacz listę uczestników"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => handleDelete(slot.id)}
                                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Usuń termin"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MODAL 1: DODAWANIE SLOTU --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                        <h3 className="text-xl font-bold text-white mb-6">Dodaj Nowy Termin</h3>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Data</label>
                                <input name="date" type="date" required className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500 [color-scheme:dark]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Godzina</label>
                                    <input name="time" type="time" required className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500 [color-scheme:dark]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Miejsca</label>
                                    <input name="capacity" type="number" defaultValue={4} min={1} className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-zinc-400 hover:text-white transition-colors">Anuluj</button>
                                <button type="submit" disabled={isPending} className="flex-1 bg-white text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2">
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Dodaj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: SZCZEGÓŁY REZERWACJI --- */}
            {selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                        {/* Header Modala */}
                        <div className="p-6 border-b border-zinc-800 bg-black/50 flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-serif text-white mb-1">Lista Uczestników</h3>
                                <p className="text-zinc-500 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(selectedSlot.startTime), "d MMMM yyyy, HH:mm", { locale: pl })}
                                </p>
                            </div>
                            <button onClick={() => setSelectedSlot(null)} className="p-2 text-zinc-500 hover:text-white bg-zinc-800/50 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Modala */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            {!selectedSlot.bookings || selectedSlot.bookings.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                                    <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500">Brak zapisanych osób na ten termin.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedSlot.bookings.map((booking) => (
                                        <div key={booking.id} className="p-4 bg-black border border-zinc-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">

                                            {/* Dane Osobowe */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                                    {booking.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{booking.userName}</p>
                                                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {booking.userEmail}</span>
                                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.userPhone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info o Kodzie */}
                                            {booking.promoCode ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-900/50 rounded text-green-400 text-xs font-mono">
                                                    <Ticket className="w-3 h-3" />
                                                    {booking.promoCode.code} (-{booking.promoCode.discount}%)
                                                </div>
                                            ) : (
                                                <div className="text-xs text-zinc-700 font-mono px-3 py-1.5 border border-transparent">
                                                    BEZ KODU
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}