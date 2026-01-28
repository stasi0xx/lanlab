// src/components/features/BookingSection.tsx
"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, getDay, addMonths, subMonths, isBefore, startOfDay } from "date-fns";
import { pl } from "date-fns/locale";
import { getAvailableSlots } from "@/app/actions/get-slots";
import { verifyPromoCode, createBooking } from "@/app/actions/booking-actions";
import { Clock, Loader2, X, CheckCircle2, Terminal, ArrowRight, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActionState } from "react";

type Slot = {
    id: string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean | null;
    currentBookings?: number;
    maxCapacity?: number;
};

export function BookingSection() {
    // START: Ustawiamy start na "dzisiaj" lub konkretną datę startową projektu
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    // MODAL & BOOKING STATE
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // PROMO CODE STATE
    const [promoCode, setPromoCode] = useState("");
    const [promoStatus, setPromoStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");
    const [promoMessage, setPromoMessage] = useState("");
    const [activeCodeId, setActiveCodeId] = useState<string | null>(null);

    // ACTION STATE
    const [bookingState, formAction, isPending] = useActionState(createBooking, null);

    // --- LOGIKA KALENDARZA ---
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Obliczamy puste dni na początku miesiąca (Poniedziałek = 0)
    const startDayIndex = (getDay(monthStart) + 6) % 7;
    const emptyDays = Array.from({ length: startDayIndex });

    // Zmiana miesiąca
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => {
        // Opcjonalnie: Zablokuj cofanie się w przeszłość
        // if (isBefore(subMonths(currentMonth, 1), startOfMonth(new Date()))) return;
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // Pobieranie slotów
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const res = await getAvailableSlots(selectedDate);
            if (res.success && res.data) {
                setSlots(res.data);
            } else {
                setSlots([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [selectedDate]);

    // Obsługa sukcesu
    useEffect(() => {
        if (bookingState?.success) {
            const timer = setTimeout(() => {
                setIsModalOpen(false);
                setSelectedSlotId(null);
                setPromoStatus("idle");
                setPromoCode("");
                setActiveCodeId(null);
                getAvailableSlots(selectedDate).then(res => res.data && setSlots(res.data));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [bookingState, selectedDate]);

    // Handlery
    const handleSlotClick = (id: string) => {
        setSelectedSlotId(id);
        setIsModalOpen(true);
        setPromoStatus("idle");
    };

    const verifyCode = async () => {
        if (!promoCode) return;
        setPromoStatus("verifying");

        const formData = new FormData();
        formData.append("code", promoCode);
        if (selectedSlotId) {
            formData.append("slotId", selectedSlotId);
        }

        const result = await verifyPromoCode(formData);

        if (result.success) {
            setPromoStatus("valid");
            setPromoMessage("Dostęp przyznany. Protokół aktywny.");
            setActiveCodeId(result.codeId || null);
        } else {
            setPromoStatus("invalid");
            setPromoMessage(result.message || "Błąd autoryzacji");
            setActiveCodeId(null);
        }
    };

    return (
        <section id="booking" className="py-24 bg-black relative border-t border-zinc-900 selection:bg-cyan-500 selection:text-black">

            {/* Dekoracyjny Glow (Cyan) */}
            <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">

                {/* NAGŁÓWEK */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-zinc-800 pb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 text-cyan-500 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                            <Terminal className="w-4 h-4" />
                            <span>System Scheduler v2.1</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9]">
                            Zarezerwuj <br />
                            <span className="text-zinc-500">Sesję.</span>
                        </h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                            /// STATUS: ONLINE<br/>
                            /// SERVER TIME: {format(new Date(), "HH:mm")} UTC
                        </p>
                    </div>
                </div>

                {/* KALENDARZ UI - INDUSTRIAL FRAME */}
                <div className="grid lg:grid-cols-12 border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm min-h-[500px]">

                    {/* LEWA: KALENDARZ */}
                    <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col">

                        {/* Nawigacja Miesiąca */}
                        <div className="flex justify-between items-center mb-8 bg-black/40 p-4 border border-zinc-800/50 rounded-sm">
                            <button
                                onClick={prevMonth}
                                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all rounded-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <h3 className="text-lg md:text-xl font-mono text-white uppercase tracking-wider font-bold">
                                {format(currentMonth, "LLLL yyyy", { locale: pl })}
                            </h3>

                            <button
                                onClick={nextMonth}
                                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all rounded-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nagłówki Dni */}
                        <div className="grid grid-cols-7 mb-4 text-center">
                            {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((d) => (
                                <span key={d} className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{d}</span>
                            ))}
                        </div>

                        {/* Grid Dni */}
                        <div className="grid grid-cols-7 gap-1 auto-rows-fr">
                            {emptyDays.map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}

                            {calendarDays.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                // Sprawdzamy czy to przeszłość (opcjonalnie, do stylowania)
                                const isPast = isBefore(day, startOfDay(new Date()));

                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => { setSelectedDate(day); setSelectedSlotId(null); }}
                                        // ZMIANA: Usunięto disabled={isWeekend}. Teraz wszystko jest klikalne.
                                        // disabled={isPast} // Możesz odkomentować, jeśli chcesz blokować przeszłość
                                        className={cn(
                                            "aspect-square flex flex-col items-center justify-center transition-all relative border border-transparent hover:border-zinc-700 rounded-sm",
                                            isSelected ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] z-10" :
                                                isPast ? "text-zinc-800" : // Przeszłość ciemniejsza
                                                    "text-zinc-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <span className={cn("text-sm font-mono", isSelected && "font-bold")}>{format(day, "d")}</span>
                                        {isSelected && <div className="absolute bottom-2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* PRAWA: GODZINY */}
                    <div className="lg:col-span-5 p-6 md:p-8 flex flex-col bg-black/40">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                            <Clock className="w-4 h-4 text-cyan-600" />
                            <span>Sloty: {format(selectedDate, "d MMMM", { locale: pl })}</span>
                        </h3>

                        <div className="flex-grow relative">
                            {loading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">Scanning Database...</span>
                                    </div>
                                </div>
                            ) : null}

                            {slots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2 pb-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => handleSlotClick(slot.id)}
                                            className="group relative py-4 px-4 bg-zinc-900/50 border border-zinc-800 text-sm font-mono text-zinc-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-900/10 transition-all text-left flex justify-between items-center"
                                        >
                                            <span>{format(new Date(slot.startTime), "HH:mm")}</span>
                                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyan-400" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                // Stan pusty
                                <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-sm border border-dashed border-zinc-800 bg-zinc-900/20 p-8 min-h-[200px]">
                                    <Lock className="w-6 h-6 mb-2 opacity-50" />
                                    <p className="font-mono text-xs uppercase mb-1">Brak dostępnych slotów</p>
                                    <p className="text-[10px] text-zinc-700">Wybierz inny dzień.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORMULARZA (Bez zmian w logice, tylko styl) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-black border border-zinc-800 w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">

                        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">/// SECURE_CONNECTION</span>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {bookingState?.success ? (
                            <div className="p-12 text-center flex flex-col items-center bg-black">
                                <div className="w-16 h-16 border border-cyan-500/30 bg-cyan-900/10 flex items-center justify-center mb-6 text-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">Potwierdzono.</h3>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">System oczekuje na połączenie.</p>
                            </div>
                        ) : (
                            <div className="p-8 bg-black">
                                <div className="mb-8">
                                    <h3 className="text-xl font-serif text-white mb-1">Weryfikacja Tożsamości</h3>
                                    <p className="text-zinc-500 text-xs font-mono">
                                        TARGET: {format(selectedDate, "yyyy-MM-dd")} @ {slots.find(s => s.id === selectedSlotId) ? format(new Date(slots.find(s => s.id === selectedSlotId)!.startTime), "HH:mm") : ""}
                                    </p>
                                </div>

                                {/* Kod Rabatowy */}
                                <div className={cn("mb-6 p-4 border transition-all duration-500 relative overflow-hidden",
                                    promoStatus === "valid" ? "border-cyan-500/50 bg-cyan-900/10" : "border-zinc-800 bg-zinc-900/30"
                                )}>
                                    {promoStatus === "valid" && <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>}

                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Access Code</label>
                                    <div className="flex gap-2 relative">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            disabled={promoStatus === "valid"}
                                            placeholder="ENTER CODE..."
                                            className="flex-1 bg-black border border-zinc-700 px-3 py-2 text-sm font-mono text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all"
                                        />
                                        {promoStatus !== "valid" && (
                                            <button
                                                onClick={verifyCode}
                                                disabled={!promoCode || promoStatus === "verifying"}
                                                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors disabled:opacity-50"
                                            >
                                                {promoStatus === "verifying" ? <Loader2 className="w-3 h-3 animate-spin"/> : "VERIFY"}
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-3 min-h-[20px]">
                                        {promoStatus === "valid" && (
                                            <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono animate-fade-in">
                                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                                                <span>{promoMessage}</span>
                                            </div>
                                        )}
                                        {promoStatus === "invalid" && <p className="text-red-500 text-xs font-mono">/// ERROR: {promoMessage}</p>}
                                    </div>
                                </div>

                                {/* Formularz Danych */}
                                {promoStatus === "valid" && (
                                    <form action={formAction} className="space-y-4 animate-fade-in-up">
                                        <input type="hidden" name="slotId" value={selectedSlotId || ""} />
                                        <input type="hidden" name="promoCodeId" value={activeCodeId || ""} />

                                        <div className="space-y-4">
                                            <div className="group">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 group-focus-within:text-cyan-500 transition-colors">Identyfikator (Imię i Nazwisko)</label>
                                                <input name="name" required className="w-full bg-black border-b border-zinc-700 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-zinc-800" placeholder="John Doe" />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 group-focus-within:text-cyan-500 transition-colors">Kanał Komunikacji (Email)</label>
                                                <input name="email" type="email" required className="w-full bg-black border-b border-zinc-700 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-zinc-800" placeholder="user@domain.com" />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 group-focus-within:text-cyan-500 transition-colors">Kontakt (Tel)</label>
                                                <input name="phone" type="tel" required className="w-full bg-black border-b border-zinc-700 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-zinc-800" placeholder="+48..." />
                                            </div>
                                        </div>

                                        {bookingState?.message && !bookingState.success && (
                                            <p className="text-red-500 text-xs font-mono mt-4 border border-red-900/50 bg-red-900/10 p-2">/// ERROR: {bookingState.message}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full mt-6 h-12 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : "Potwierdź rezerwację"}
                                                {!isPending && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                                            </span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}