"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, getDay } from "date-fns";
import { pl } from "date-fns/locale";
import { getAvailableSlots } from "@/app/actions/get-slots";
import { verifyPromoCode, createBooking } from "@/app/actions/booking-actions"; // Import Server Actions
import { Calendar as CalendarIcon, Clock, Loader2, ChevronRight, ChevronLeft, X, CheckCircle2, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActionState } from "react"; // React 19 hook (lub useFormState w starszych Next.js)

type Slot = {
    id: string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean | null; // Zmiana: akceptujemy null
    // Opcjonalnie warto dodać te pola, skoro przychodzą z bazy:
    currentBookings?: number;
    maxCapacity?: number;
};

export function BookingSection() {
    // KALENDARZ SETUP
    const [currentMonth, setCurrentMonth] = useState(new Date("2026-02-01T12:00:00"));
    const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-02-03T12:00:00"));
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

    // BOOKING FORM ACTION (React 19)
    const [bookingState, formAction, isPending] = useActionState(createBooking, null);

    // --- LOGIKA KALENDARZA (BEZ ZMIAN) ---
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayIndex = (getDay(monthStart) + 6) % 7;
    const emptyDays = Array.from({ length: startDayIndex });

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

    useEffect(() => {
        // Jeśli booking się udał, zamknij modal i wyczyść
        if (bookingState?.success) {
            const timer = setTimeout(() => {
                setIsModalOpen(false);
                setSelectedSlotId(null);
                setPromoStatus("idle");
                setPromoCode("");
                setActiveCodeId(null);
                // Refresh slotów
                getAvailableSlots(selectedDate).then(res => res.data && setSlots(res.data));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [bookingState, selectedDate]);


    // --- HANDLERS ---
    const handleSlotClick = (id: string) => {
        setSelectedSlotId(id);
        setIsModalOpen(true);
        setPromoStatus("idle"); // Reset stanu przy otwarciu
    };

    const verifyCode = async () => {
        if (!promoCode) return;
        setPromoStatus("verifying");

        const formData = new FormData();
        formData.append("code", promoCode);
        // DODAJEMY TO: Przekazujemy ID aktualnie wybranego slotu
        if (selectedSlotId) {
            formData.append("slotId", selectedSlotId);
        }

        const result = await verifyPromoCode(formData);

        if (result.success) {
            setPromoStatus("valid");
            setPromoMessage("Gratulacje! Umów się na bezpłatną lekcję próbną.");
            setActiveCodeId(result.codeId || null);
        } else {
            setPromoStatus("invalid");
            setPromoMessage(result.message || "Błąd kodu");
            setActiveCodeId(null);
        }
    };

    return (
        <section id="booking" className="py-24 bg-white relative">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* NAGŁÓWEK */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Wybierz termin zajęć</h2>
                </div>

                {/* KALENDARZ UI */}
                <div className="grid lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">

                    {/* LEWA: DNI */}
                    <div className="lg:col-span-7">
                        <h3 className="text-xl font-serif font-bold text-slate-800 capitalize mb-6">
                            {format(currentMonth, "LLLL yyyy", { locale: pl })}
                        </h3>

                        <div className="grid grid-cols-7 mb-2 text-center">
                            {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((d) => (
                                <span key={d} className="text-xs font-bold text-slate-400 uppercase py-2">{d}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                            {calendarDays.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isWeekend = getDay(day) === 0 || getDay(day) === 6;
                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => { setSelectedDate(day); setSelectedSlotId(null); }}
                                        disabled={isWeekend}
                                        className={cn(
                                            "aspect-square flex flex-col items-center justify-center rounded-lg transition-all relative",
                                            isSelected ? "bg-brand-primary text-white shadow-lg scale-105 z-10" :
                                                isWeekend ? "bg-slate-50 text-slate-300 cursor-not-allowed" :
                                                    "bg-white text-slate-700 hover:bg-blue-50 hover:text-brand-primary border border-slate-100"
                                        )}
                                    >
                                        <span className={cn("text-sm font-medium", isSelected && "font-bold")}>{format(day, "d")}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* PRAWA: GODZINY */}
                    <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8 pt-8 lg:pt-0 flex flex-col">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Dostępne godziny: {format(selectedDate, "d MMMM", { locale: pl })}
                        </h3>
                        <div className="flex-grow">
                            {loading ? (
                                <div className="flex h-40 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.id}
                                            onClick={() => handleSlotClick(slot.id)}
                                            className="py-3 px-3 rounded-xl text-sm font-medium transition-all border bg-white text-slate-700 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50"
                                        >
                                            {format(new Date(slot.startTime), "HH:mm")}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-200"><p>Brak terminów</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORMULARZA --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">

                        {/* ZAMKNIJ */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* SUKCES EKRAN */}
                        {bookingState?.success ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Rezerwacja przyjęta!</h3>
                                <p className="text-slate-500">Do zobaczenia na lekcji.</p>
                            </div>
                        ) : (
                            // FORMULARZ
                            <div className="p-8">
                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">Potwierdź wizytę</h3>
                                <p className="text-slate-500 text-sm mb-6">
                                    {format(selectedDate, "d MMMM", { locale: pl })}, godz. {slots.find(s => s.id === selectedSlotId) ? format(new Date(slots.find(s => s.id === selectedSlotId)!.startTime), "HH:mm") : ""}
                                </p>

                                {/* KROK 1: KOD RABATOWY */}
                                <div className={cn("mb-6 p-4 rounded-xl border transition-all", promoStatus === "valid" ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")}>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Kod rabatowy</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            disabled={promoStatus === "valid"}
                                            placeholder="Np. START2026"
                                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                        {promoStatus !== "valid" && (
                                            <button
                                                onClick={verifyCode}
                                                disabled={!promoCode || promoStatus === "verifying"}
                                                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-brand-primary transition-colors disabled:opacity-50"
                                            >
                                                {promoStatus === "verifying" ? <Loader2 className="w-4 h-4 animate-spin"/> : "OK"}
                                            </button>
                                        )}
                                    </div>
                                    {/* KOMUNIKATY KODU */}
                                    {promoStatus === "valid" && (
                                        <div className="mt-3 flex items-start gap-2 text-green-700 text-sm font-medium animate-fade-in">
                                            <Gift className="w-4 h-4 mt-0.5" />
                                            <span>{promoMessage}</span>
                                        </div>
                                    )}
                                    {promoStatus === "invalid" && (
                                        <p className="mt-2 text-red-500 text-xs font-medium">{promoMessage}</p>
                                    )}
                                </div>

                                {/* KROK 2: DANE OSOBOWE (Pokazujemy tylko po wpisaniu kodu, zgodnie z briefem "Logika rabatowa") */}
                                {promoStatus === "valid" && (
                                    <form action={formAction} className="space-y-4 animate-fade-in-up">
                                        <input type="hidden" name="slotId" value={selectedSlotId || ""} />
                                        <input type="hidden" name="promoCodeId" value={activeCodeId || ""} />

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Imię i Nazwisko</label>
                                            <input name="name" required className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none" placeholder="Jan Kowalski" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                                            <input name="email" type="email" required className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none" placeholder="jan@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Telefon</label>
                                            <input name="phone" type="tel" required className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none" placeholder="+48 123 456 789" />
                                        </div>

                                        {bookingState?.message && !bookingState.success && (
                                            <p className="text-red-500 text-sm text-center">{bookingState.message}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full mt-4 h-12 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                                        >
                                            {isPending ? <Loader2 className="w-5 h-5 animate-spin"/> : "Umów wizytę bezpłatnie"}
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