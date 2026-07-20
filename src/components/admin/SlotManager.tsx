"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { createAdminSlot, deleteSlot } from "@/app/actions/admin-actions";
import { Loader2, Plus, Trash2, Calendar, Clock, Users, Eye, Mail, Phone, Ticket, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    bookings?: Booking[];
};

export function SlotManager({ slots }: { slots: Slot[] }) {
    const [isPending, setIsPending] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
        if (!confirm("Usunąć ten termin?")) return;
        await deleteSlot(id);
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-primary" />
                        Harmonogram Sesji
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Kliknij "oko", aby zobaczyć listę obecności</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" /> Dodaj Termin
                </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {slots.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">Brak zaplanowanych terminów</div>
                )}

                {slots.map((slot) => {
                    const occupancy = (slot.currentBookings / slot.maxCapacity) * 100;
                    const isFull = slot.currentBookings >= slot.maxCapacity;

                    return (
                        <div key={slot.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className="text-center min-w-[52px]">
                                    <div className="text-xs font-bold text-slate-400 uppercase">
                                        {format(new Date(slot.startTime), "MMM", { locale: pl })}
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 leading-none">
                                        {format(new Date(slot.startTime), "dd")}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        {format(new Date(slot.startTime), "HH:mm")}
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all", isFull ? "bg-red-500" : "bg-brand-primary")}
                                                style={{ width: `${occupancy}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {slot.currentBookings}/{slot.maxCapacity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedSlot(slot)}
                                    className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-colors"
                                    title="Zobacz listę uczestników"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleDelete(slot.id)}
                                    className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Usuń termin"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Dodaj Nowy Termin</h3>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
                                <input name="date" type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Godzina</label>
                                    <input name="time" type="time" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Miejsca</label>
                                    <input name="capacity" type="number" defaultValue={4} min={1} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 outline-none focus:border-brand-primary" />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-slate-500 hover:text-slate-900 transition-colors">Anuluj</button>
                                <button type="submit" disabled={isPending} className="flex-1 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-2">
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Dodaj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                        <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">Lista Uczestników</h3>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(selectedSlot.startTime), "d MMMM yyyy, HH:mm", { locale: pl })}
                                </p>
                            </div>
                            <button onClick={() => setSelectedSlot(null)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {!selectedSlot.bookings || selectedSlot.bookings.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-400">Brak zapisanych osób na ten termin.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedSlot.bookings.map((booking) => (
                                        <div key={booking.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                    {booking.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-bold">{booking.userName}</p>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {booking.userEmail}</span>
                                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.userPhone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {booking.promoCode ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs font-medium">
                                                    <Ticket className="w-3 h-3" />
                                                    {booking.promoCode.code} (-{booking.promoCode.discount}%)
                                                </div>
                                            ) : (
                                                <div className="text-xs text-slate-300 px-3 py-1.5 border border-transparent">
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
