"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, getDay, addMonths, subMonths, isBefore, startOfDay, addDays } from "date-fns";
import { pl } from "date-fns/locale";
import { getAvailableSlots } from "@/app/actions/get-slots";
import { verifyPromoCode, checkExistingCustomer, createBooking } from "@/app/actions/booking-actions";
import {
    Clock, Loader2, X, CheckCircle2, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight,
    Sparkles, MapPin, Monitor, GraduationCap, Gift, ShieldCheck,
} from "lucide-react";
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

type LessonLocation = "stationary" | "online";
type BookingMode = "trial" | "continuation";
type Step = "location" | "type" | "verify" | "calendar";

const STEPS: { key: Step; label: string }[] = [
    { key: "location", label: "Forma zajęć" },
    { key: "type", label: "Rodzaj lekcji" },
    { key: "verify", label: "Twoje dane" },
    { key: "calendar", label: "Termin" },
];

export function BookingSection() {
    const [step, setStep] = useState<Step>("location");

    const [lessonLocation, setLessonLocation] = useState<LessonLocation | null>(null);
    const [bookingMode, setBookingMode] = useState<BookingMode | null>(null);

    // KOD RABATOWY (weryfikowany na etapie wyboru rodzaju lekcji, przed danymi kontaktowymi)
    const [promoCode, setPromoCode] = useState("");
    const [promoStatus, setPromoStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");
    const [promoMessage, setPromoMessage] = useState("");
    const [activeCodeId, setActiveCodeId] = useState<string | null>(null);

    // DANE KONTAKTOWE + WERYFIKACJA W BAZIE
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [verifyStatus, setVerifyStatus] = useState<"idle" | "checking" | "blocked" | "ok">("idle");
    const [verifyMessage, setVerifyMessage] = useState("");
    const [isReturningCustomer, setIsReturningCustomer] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [bookingState, formAction, isPending] = useActionState(createBooking, null);

    // --- KALENDARZ: MIESIĄC (desktop) ---
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayIndex = (getDay(monthStart) + 6) % 7;
    const emptyDays = Array.from({ length: startDayIndex });

    // --- KALENDARZ: TYDZIEŃ (mobile) — najbliższe 14 dni ---
    const upcomingDays = eachDayOfInterval({ start: startOfDay(new Date()), end: addDays(new Date(), 13) });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    useEffect(() => {
        if (step !== "calendar") return;
        async function fetchData() {
            setLoading(true);
            const res = await getAvailableSlots(selectedDate);
            setSlots(res.success && res.data ? res.data : []);
            setLoading(false);
        }
        fetchData();
    }, [selectedDate, step]);

    useEffect(() => {
        if (bookingState?.success) {
            const timer = setTimeout(() => {
                setIsModalOpen(false);
                setSelectedSlotId(null);
                setStep("location");
                setLessonLocation(null);
                setBookingMode(null);
                setPromoStatus("idle");
                setPromoCode("");
                setActiveCodeId(null);
                setContactName("");
                setContactEmail("");
                setContactPhone("");
                setVerifyStatus("idle");
                setIsReturningCustomer(false);
                getAvailableSlots(selectedDate).then((res) => res.data && setSlots(res.data));
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [bookingState, selectedDate]);

    const scrollToPanel = () => {
        setTimeout(() => document.getElementById("booking-flow-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    };

    const chooseLocation = (loc: LessonLocation) => {
        setLessonLocation(loc);
        setStep("type");
        scrollToPanel();
    };

    const chooseContinuation = () => {
        setBookingMode("continuation");
        setStep("verify");
        scrollToPanel();
    };

    const chooseTrial = () => {
        setBookingMode("trial");
    };

    const verifyCode = async () => {
        if (!promoCode) return;
        setPromoStatus("verifying");

        const formData = new FormData();
        formData.append("code", promoCode);

        const result = await verifyPromoCode(formData);

        if (result.success) {
            setPromoStatus("valid");
            setActiveCodeId(result.codeId || null);
        } else {
            setPromoStatus("invalid");
            setPromoMessage(result.message || "Błąd weryfikacji kodu");
            setActiveCodeId(null);
        }
    };

    const proceedFromTrial = () => {
        setStep("verify");
        scrollToPanel();
    };

    const handleVerifyCustomer = async () => {
        if (!contactName || !contactEmail || !contactPhone) return;
        setVerifyStatus("checking");
        setVerifyMessage("");

        const formData = new FormData();
        formData.append("email", contactEmail);
        formData.append("phone", contactPhone);

        const result = await checkExistingCustomer(formData);

        if (!result.success) {
            setVerifyStatus("idle");
            setVerifyMessage(result.message || "Sprawdź wpisane dane.");
            return;
        }

        if (bookingMode === "trial" && result.exists) {
            setVerifyStatus("blocked");
            setVerifyMessage("Ten e-mail lub numer telefonu widnieje już w naszej bazie — bezpłatna lekcja próbna jest dostępna tylko dla nowych uczniów.");
            return;
        }

        setIsReturningCustomer(!!result.exists);
        setVerifyStatus("ok");
        setStep("calendar");
        scrollToPanel();
    };

    const switchToContinuationAfterBlock = () => {
        setBookingMode("continuation");
        setVerifyStatus("ok");
        setIsReturningCustomer(true);
        setStep("calendar");
        scrollToPanel();
    };

    const goBack = (target: Step) => {
        setStep(target);
        scrollToPanel();
    };

    const handleSlotClick = (id: string) => {
        setSelectedSlotId(id);
        setIsModalOpen(true);
    };

    const selectedSlot = slots.find((s) => s.id === selectedSlotId);
    const currentStepIndex = STEPS.findIndex((s) => s.key === step);

    return (
        <section id="booking" className="py-24 md:py-32 bg-brand-surface relative border-t border-brand-line">
            <div className="container mx-auto px-6 max-w-6xl relative z-10">

                {/* NAGŁÓWEK */}
                <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
                    <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Rezerwacja</span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-ink leading-[1.05]">
                        Zarezerwuj swoją lekcję.
                    </h2>
                    <p className="text-brand-muted">
                        Kilka kroków dzieli Cię od wybranego terminu.
                    </p>
                </div>

                {/* PASEK KROKÓW */}
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 flex-wrap">
                    {STEPS.map((s, i) => (
                        <div key={s.key} className="flex items-center gap-2 md:gap-4">
                            <div
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
                                    i === currentStepIndex
                                        ? "bg-brand-primary text-white"
                                        : i < currentStepIndex
                                            ? "bg-brand-ink/5 text-brand-ink cursor-pointer hover:bg-brand-ink/10"
                                            : "bg-brand-ink/5 text-brand-muted"
                                )}
                                onClick={() => i < currentStepIndex && goBack(s.key)}
                            >
                                <span className={cn(
                                    "w-4 h-4 rounded-full flex items-center justify-center text-[10px]",
                                    i === currentStepIndex ? "bg-white/20" : "bg-brand-ink/10"
                                )}>
                                    {i + 1}
                                </span>
                                {s.label}
                            </div>
                            {i < STEPS.length - 1 && <div className="w-4 h-px bg-brand-line" />}
                        </div>
                    ))}
                </div>

                <div id="booking-flow-panel" className="max-w-3xl mx-auto scroll-mt-28">

                    {/* KROK 1: FORMA ZAJĘĆ */}
                    {step === "location" && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <button
                                onClick={() => chooseLocation("stationary")}
                                className="text-left rounded-2xl border border-brand-line bg-white p-8 hover:border-brand-primary hover:shadow-lg transition-all group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5 text-brand-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <p className="font-display text-xl font-bold text-brand-ink mb-1">Stacjonarnie</p>
                                <p className="text-sm text-brand-muted mb-6">Spotykamy się w ustalonym miejscu, twarzą w twarz.</p>
                                <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                                    Wybieram <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button
                                onClick={() => chooseLocation("online")}
                                className="text-left rounded-2xl border border-brand-line bg-white p-8 hover:border-brand-primary hover:shadow-lg transition-all group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5 text-brand-primary">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <p className="font-display text-xl font-bold text-brand-ink mb-1">Online</p>
                                <p className="text-sm text-brand-muted mb-6">Lekcja zdalna, z dowolnego miejsca na świecie.</p>
                                <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                                    Wybieram <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    )}

                    {/* KROK 2: RODZAJ LEKCJI */}
                    {step === "type" && (
                        <div>
                            <button onClick={() => goBack("location")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors mb-6">
                                <ArrowLeft className="w-3.5 h-3.5" /> Zmień formę zajęć
                            </button>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* KONTYNUACJA */}
                                <div className="rounded-2xl border border-brand-line bg-white p-8">
                                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5 text-brand-primary">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <p className="font-display text-xl font-bold text-brand-ink mb-1">Kontynuacja nauki</p>
                                    <p className="font-display text-3xl font-bold text-brand-ink mb-1">
                                        150 zł <span className="text-base font-medium text-brand-muted">/ 60 min</span>
                                    </p>
                                    <p className="text-sm text-brand-muted mb-6">Już z nami się uczysz? Umów kolejną lekcję.</p>
                                    <button
                                        onClick={chooseContinuation}
                                        className="w-full h-12 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-2"
                                    >
                                        Umawiam się
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* LEKCJA PRÓBNA */}
                                <div
                                    className={cn(
                                        "rounded-2xl border p-8 transition-all",
                                        promoStatus === "valid" ? "border-brand-primary shadow-sm" : "border-brand-line bg-white"
                                    )}
                                >
                                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5 text-brand-primary">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <p className="font-display text-xl font-bold text-brand-ink mb-1">Bezpłatna lekcja próbna</p>
                                    <p className="text-sm text-brand-muted mb-4">Wpisz kod rabatowy, aby odblokować bezpłatną lekcję.</p>

                                    {promoStatus === "valid" ? (
                                        <div className="space-y-3">
                                            <p className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                                                <CheckCircle2 className="w-4 h-4" /> Kod aktywny — lekcja bezpłatna!
                                            </p>
                                            <button
                                                onClick={proceedFromTrial}
                                                className="w-full h-12 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-2"
                                            >
                                                Umawiam się
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex gap-2" onFocus={chooseTrial}>
                                                <input
                                                    type="text"
                                                    value={promoCode}
                                                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoStatus("idle"); chooseTrial(); }}
                                                    placeholder="Kod rabatowy"
                                                    className="flex-1 min-w-0 bg-brand-surface border border-brand-line rounded-full px-4 py-3 text-sm text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
                                                />
                                                <button
                                                    onClick={verifyCode}
                                                    disabled={!promoCode || promoStatus === "verifying"}
                                                    className="px-5 py-3 bg-brand-ink text-white rounded-full text-sm font-bold hover:bg-brand-primary transition-colors disabled:opacity-40 shrink-0"
                                                >
                                                    {promoStatus === "verifying" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sprawdź"}
                                                </button>
                                            </div>
                                            {promoStatus === "invalid" && (
                                                <p className="text-red-600 text-xs font-medium mt-3">{promoMessage}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KROK 3: DANE KONTAKTOWE + WERYFIKACJA */}
                    {step === "verify" && (
                        <div>
                            <button onClick={() => goBack("type")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors mb-6">
                                <ArrowLeft className="w-3.5 h-3.5" /> Zmień rodzaj lekcji
                            </button>

                            <div className="rounded-2xl border border-brand-line bg-white p-8">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-muted mb-6">
                                    <ShieldCheck className="w-4 h-4 text-brand-primary" />
                                    Twoje dane
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-muted mb-1.5">Imię i nazwisko</label>
                                        <input
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            className="w-full bg-brand-surface border border-brand-line rounded-xl px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-primary transition-colors"
                                            placeholder="Jan Kowalski"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-muted mb-1.5">E-mail</label>
                                        <input
                                            type="email"
                                            value={contactEmail}
                                            onChange={(e) => { setContactEmail(e.target.value); setVerifyStatus("idle"); }}
                                            className="w-full bg-brand-surface border border-brand-line rounded-xl px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-primary transition-colors"
                                            placeholder="jan@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-brand-muted mb-1.5">Telefon</label>
                                        <input
                                            type="tel"
                                            value={contactPhone}
                                            onChange={(e) => { setContactPhone(e.target.value); setVerifyStatus("idle"); }}
                                            className="w-full bg-brand-surface border border-brand-line rounded-xl px-4 py-3 text-sm text-brand-ink focus:outline-none focus:border-brand-primary transition-colors"
                                            placeholder="+48 600 000 000"
                                        />
                                    </div>

                                    {verifyStatus === "blocked" && (
                                        <div className="rounded-xl bg-red-50 border border-red-100 p-4 space-y-3">
                                            <p className="text-red-600 text-xs font-medium">{verifyMessage}</p>
                                            <button
                                                onClick={switchToContinuationAfterBlock}
                                                className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
                                            >
                                                Przejdź do kontynuacji nauki <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    {verifyMessage && verifyStatus === "idle" && (
                                        <p className="text-red-600 text-xs font-medium">{verifyMessage}</p>
                                    )}

                                    <button
                                        onClick={handleVerifyCustomer}
                                        disabled={!contactName || !contactEmail || !contactPhone || verifyStatus === "checking"}
                                        className="w-full h-12 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-dark transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                                    >
                                        {verifyStatus === "checking" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dalej"}
                                        {verifyStatus !== "checking" && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KROK 4: KALENDARZ */}
                    {step === "calendar" && (
                        <div>
                            <button onClick={() => goBack("verify")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors mb-6">
                                <ArrowLeft className="w-3.5 h-3.5" /> Zmień dane
                            </button>

                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-4 h-4 text-brand-primary" />
                                <p className="text-sm font-semibold text-brand-ink">
                                    {bookingMode === "trial" ? "Wybierz termin bezpłatnej lekcji próbnej" : "Wybierz termin lekcji"}
                                </p>
                                {isReturningCustomer && bookingMode === "continuation" && (
                                    <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">Witaj ponownie 👋</span>
                                )}
                            </div>

                            <div className="grid lg:grid-cols-12 rounded-2xl border border-brand-line bg-white overflow-hidden shadow-sm">

                                {/* LEWA: KALENDARZ */}
                                <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-brand-line">

                                    {/* Widok mobile: pasek najbliższych dni */}
                                    <div className="md:hidden -mx-2 mb-2 flex gap-2 overflow-x-auto no-scrollbar pb-2 px-2">
                                        {upcomingDays.map((day) => {
                                            const isSelected = isSameDay(day, selectedDate);
                                            return (
                                                <button
                                                    key={day.toString()}
                                                    onClick={() => setSelectedDate(day)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center min-w-[56px] h-16 rounded-xl border shrink-0 transition-all",
                                                        isSelected
                                                            ? "bg-brand-primary border-brand-primary text-white"
                                                            : "border-brand-line text-brand-ink hover:border-brand-primary/40"
                                                    )}
                                                >
                                                    <span className="text-[10px] uppercase font-bold opacity-70">{format(day, "EEE", { locale: pl })}</span>
                                                    <span className="text-lg font-bold">{format(day, "d")}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Widok desktop: siatka miesiąca */}
                                    <div className="hidden md:block">
                                        <div className="flex justify-between items-center mb-8">
                                            <button onClick={prevMonth} className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-surface rounded-full transition-all">
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <h3 className="text-lg font-display font-bold text-brand-ink capitalize">
                                                {format(currentMonth, "LLLL yyyy", { locale: pl })}
                                            </h3>
                                            <button onClick={nextMonth} className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-surface rounded-full transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 mb-3 text-center">
                                            {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((d) => (
                                                <span key={d} className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{d}</span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 auto-rows-fr">
                                            {emptyDays.map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}

                                            {calendarDays.map((day) => {
                                                const isSelected = isSameDay(day, selectedDate);
                                                const isPast = isBefore(day, startOfDay(new Date()));

                                                return (
                                                    <button
                                                        key={day.toString()}
                                                        onClick={() => { if (!isPast) { setSelectedDate(day); setSelectedSlotId(null); } }}
                                                        disabled={isPast}
                                                        className={cn(
                                                            "aspect-square flex flex-col items-center justify-center transition-all relative rounded-lg",
                                                            isSelected
                                                                ? "bg-brand-primary text-white shadow-sm"
                                                                : isPast
                                                                    ? "text-brand-line cursor-not-allowed"
                                                                    : "text-brand-ink hover:bg-brand-surface"
                                                        )}
                                                    >
                                                        <span className="text-sm font-medium">{format(day, "d")}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* PRAWA: GODZINY */}
                                <div className="lg:col-span-5 p-6 md:p-8 flex flex-col bg-brand-surface/40">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-6 flex items-center gap-2 border-b border-brand-line pb-4">
                                        <Clock className="w-4 h-4 text-brand-primary" />
                                        <span>Godziny: {format(selectedDate, "d MMMM", { locale: pl })}</span>
                                    </h3>

                                    <div className="flex-grow relative min-h-[160px]">
                                        {loading ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
                                            </div>
                                        ) : slots.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto no-scrollbar pr-1 pb-2">
                                                {slots.map((slot) => (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => handleSlotClick(slot.id)}
                                                        className="group py-3.5 px-4 bg-white border border-brand-line rounded-xl text-sm font-semibold text-brand-ink hover:border-brand-primary hover:text-brand-primary transition-all text-left flex justify-between items-center"
                                                    >
                                                        <span>{format(new Date(slot.startTime), "HH:mm")}</span>
                                                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-brand-muted text-sm border border-dashed border-brand-line rounded-xl p-8 min-h-[180px] text-center">
                                                <p className="font-semibold mb-1">Brak wolnych terminów tego dnia</p>
                                                <p className="text-xs">Wybierz inny dzień z kalendarza.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL POTWIERDZENIA --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">

                        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-line">
                            <span className="text-sm font-bold text-brand-ink">
                                {bookingMode === "trial" ? "Lekcja próbna" : "Rezerwacja"}
                            </span>
                            <button onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-brand-ink transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {bookingState?.success ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-brand-ink mb-2">Potwierdzono!</h3>
                                <p className="text-brand-muted text-sm">Szczegóły wysłaliśmy na Twój e-mail.</p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="text-sm text-brand-muted mb-6 space-y-1">
                                    <p>
                                        {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: pl })}
                                        {selectedSlot ? ` · ${format(new Date(selectedSlot.startTime), "HH:mm")}` : ""}
                                    </p>
                                    <p>
                                        {lessonLocation === "stationary" ? "Lekcja stacjonarna" : "Lekcja online"}
                                        {" · "}
                                        {bookingMode === "trial" ? "bezpłatna lekcja próbna" : "150 zł / 60 min"}
                                    </p>
                                    <p className="font-semibold text-brand-ink">{contactName} · {contactEmail} · {contactPhone}</p>
                                </div>

                                <form action={formAction} className="space-y-4">
                                    <input type="hidden" name="slotId" value={selectedSlotId || ""} />
                                    <input type="hidden" name="promoCodeId" value={bookingMode === "trial" ? (activeCodeId || "") : ""} />
                                    <input type="hidden" name="name" value={contactName} />
                                    <input type="hidden" name="email" value={contactEmail} />
                                    <input type="hidden" name="phone" value={contactPhone} />
                                    <input type="hidden" name="lessonLocation" value={lessonLocation || "online"} />

                                    {bookingState?.message && !bookingState.success && (
                                        <p className="text-red-600 text-xs font-medium">{bookingState.message}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full h-12 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-primary-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Potwierdź rezerwację"}
                                        {!isPending && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
