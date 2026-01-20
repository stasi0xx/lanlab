import { getAdminData, createAdminSlot, deleteSlot, createPromoCode, deletePromoCode } from "@/app/actions/admin-actions";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Trash2, Users, Calendar, Plus, Ticket, X, Mail, Phone } from "lucide-react";
import Link from "next/link";

// Poprawiony typ dla Next.js 15+ (Promise)
export default async function AdminPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // 1. AWAIT NA SEARCH PARAMS (To naprawia błąd)
    const params = await searchParams;

    const data = await getAdminData();

    if (!data.success || !data.slots || !data.bookings || !data.promoCodes) {
        return <div className="p-10 text-red-500">Błąd ładowania danych. Upewnij się, że getAdminData pobiera bookings: true.</div>;
    }

    // 2. UŻYWAMY 'params' ZAMIAST 'searchParams'
    const selectedSlotId = typeof params?.slotId === 'string' ? params.slotId : null;
    const selectedSlot = selectedSlotId ? data.slots.find(s => s.id === selectedSlotId) : null;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900 relative">

            {/* HEADER */}
            <header className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Panel Zarządzania</h1>
                <div className="flex gap-4 mt-4">
                    <StatCard label="Rezerwacje" value={data.bookings.length} />
                    <StatCard label="Aktywne Sloty" value={data.slots.length} />
                    <StatCard label="Kody Rabatowe" value={data.promoCodes.length} />
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* KOLUMNA 1: KREATOR I LISTA SLOTÓW */}
                <div className="lg:col-span-1 space-y-8">
                    {/* KREATOR */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="font-bold mb-4 flex items-center gap-2 text-brand-primary">
                            <Plus className="w-5 h-5"/> Nowy Termin
                        </h2>
                        <form action={createAdminSlot as any} className="space-y-3">
                            <input type="date" name="date" required className="w-full border p-2 rounded text-sm"/>
                            <div className="flex gap-2">
                                <input type="time" name="time" required className="w-full border p-2 rounded text-sm"/>
                                <input type="number" name="capacity" defaultValue={4} className="w-20 border p-2 rounded text-sm" placeholder="Osoby"/>
                            </div>
                            <button className="w-full bg-slate-900 text-white font-bold py-2 rounded hover:bg-brand-primary transition-colors text-sm">
                                Utwórz
                            </button>
                        </form>
                    </div>

                    {/* LISTA SLOTÓW (KLIKALNA) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-500"/> Kalendarz
                        </h2>
                        <p className="text-xs text-slate-400 mb-4">Kliknij w termin, aby zarządzać.</p>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {data.slots.map(slot => (
                                <Link
                                    key={slot.id}
                                    href={`/admin?slotId=${slot.id}`}
                                    scroll={false}
                                    className={`block p-3 border rounded-lg transition-all hover:border-brand-primary group relative ${selectedSlotId === slot.id ? 'border-brand-primary bg-blue-50 ring-1 ring-brand-primary' : 'bg-slate-50'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-sm">
                                                {format(slot.startTime, "dd.MM")} <span className="text-brand-primary">{format(slot.startTime, "HH:mm")}</span>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <Users className="w-3 h-3"/> {slot.currentBookings}/{slot.maxCapacity}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Ikonka biletu jeśli slot ma kod */}
                                    {slot.promoCodes && slot.promoCodes.length > 0 && (
                                        <div className="absolute top-3 right-3">
                                            <Ticket className="w-4 h-4 text-brand-primary" />
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KOLUMNA 2 i 3: KODY GLOBALNE I TABELA REZERWACJI */}
                <div className="lg:col-span-2 space-y-8">

                    {/* --- SEKCJA KODÓW GLOBALNYCH --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                            <h2 className="font-bold flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-slate-500"/> Kody Rabatowe (Globalne)
                            </h2>
                            {/* Formularz globalnego kodu */}
                            <form action={createPromoCode as any} className="flex gap-2 w-full md:w-auto">
                                <input type="text" name="code" placeholder="KOD GLOBALNY" required className="border p-2 rounded text-sm w-full md:w-40 uppercase" />
                                <input type="number" name="usageLimit" defaultValue={10} className="border p-2 rounded text-sm w-20" placeholder="Limit" />
                                <button className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-brand-primary whitespace-nowrap">
                                    Dodaj
                                </button>
                            </form>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-2">Kod</th>
                                    <th className="px-4 py-2">Użycie</th>
                                    <th className="px-4 py-2">Dotyczy</th>
                                    <th className="px-4 py-2">Akcja</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {data.promoCodes.map(code => (
                                    <tr key={code.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 font-mono font-bold text-brand-primary">{code.code}</td>
                                        <td className="px-4 py-2 text-xs">
                                            {code.usedCount} / {code.usageLimit}
                                        </td>
                                        <td className="px-4 py-2 text-xs">
                                            {code.slot ? (
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                                                Slot: {format(code.slot.startTime, "dd.MM HH:mm")}
                                            </span>
                                            ) : <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">Wszystkie</span>}
                                        </td>
                                        <td className="px-4 py-2">
                                            <form action={deletePromoCode.bind(null, code.id) as any}>
                                                <button className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* TABELA REZERWACJI */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="font-bold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-slate-500"/> Ostatnie Zapisy
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3">Klient</th>
                                    <th className="px-4 py-3">Termin</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {data.bookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium">
                                            {booking.userName}
                                            <div className="text-xs text-slate-500">{booking.userEmail}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {booking.slot ? format(booking.slot.startTime, "dd.MM HH:mm") : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs font-bold text-green-600">{booking.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================== */}
            {/* MODAL / SZCZEGÓŁY SLOTU */}
            {/* ============================================== */}

            {selectedSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                        {/* HEADER MODALA */}
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-serif font-bold">Szczegóły Terminu</h2>
                                <p className="text-white/70 flex items-center gap-2 mt-1">
                                    <Calendar className="w-4 h-4"/>
                                    {format(selectedSlot.startTime, "d MMMM yyyy, HH:mm", { locale: pl })}
                                </p>
                            </div>
                            <Link href="/admin" scroll={false} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <X className="w-6 h-6" />
                            </Link>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8">

                            {/* SEKCJA 1: UCZESTNICY */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4"/> Lista Obecności ({selectedSlot.bookings ? selectedSlot.bookings.length : 0} / {selectedSlot.maxCapacity})
                                </h3>

                                {selectedSlot.bookings && selectedSlot.bookings.length > 0 ? (
                                    <div className="grid gap-3">
                                        {selectedSlot.bookings.map(booking => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                                        {booking.userName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{booking.userName}</div>
                                                        <div className="text-xs text-slate-500 flex gap-3 mt-1">
                                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {booking.userEmail}</span>
                                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {booking.userPhone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {booking.promoCodeId && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">RABAT</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                                        Brak zapisanych osób na ten termin.
                                    </div>
                                )}
                            </div>

                            <hr className="border-slate-100" />

                            {/* SEKCJA 2: ZARZĄDZANIE SLOTEM */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                    <Ticket className="w-4 h-4"/> Ustawienia
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* USUWANIE */}
                                    <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                                        <h4 className="font-bold text-red-900 text-sm mb-2">Strefa Niebezpieczna</h4>
                                        <form action={deleteSlot.bind(null, selectedSlot.id) as any}>
                                            <button className="w-full bg-white border border-red-200 text-red-600 font-bold py-2 rounded hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center justify-center gap-2">
                                                <Trash2 className="w-4 h-4"/> Usuń Termin
                                            </button>
                                        </form>
                                    </div>

                                    {/* KOD DLA SLOTU */}
                                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                                        <h4 className="font-bold text-blue-900 text-sm mb-2">Kod Rabatowy na ten termin</h4>

                                        {selectedSlot.promoCodes && selectedSlot.promoCodes.length > 0 ? (
                                            <div className="space-y-2">
                                                {selectedSlot.promoCodes.map(code => (
                                                    <div key={code.id} className="flex justify-between items-center bg-white p-2 rounded border border-blue-200">
                                                        <span className="font-mono font-bold text-brand-primary">{code.code}</span>
                                                        <form action={deletePromoCode.bind(null, code.id) as any}>
                                                            <button className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                                        </form>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <form action={createPromoCode as any} className="flex gap-2">
                                                <input type="hidden" name="slotId" value={selectedSlot.id} />
                                                <input type="hidden" name="usageLimit" value="10" />
                                                <input type="text" name="code" placeholder="KOD-SLOTU" className="flex-1 border border-blue-200 rounded px-2 py-1 text-sm uppercase" required />
                                                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Dodaj</button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function StatCard({ label, value }: { label: string, value: number }) {
    return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <span className="block text-xs text-slate-500 uppercase font-bold">{label}</span>
            <span className="text-xl font-bold">{value}</span>
        </div>
    )
}