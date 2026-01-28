"use server";

import { db } from "@/lib/db";
import { availabilitySlots, bookings, promoCodes } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
}

// 1. POBIERANIE DANYCH (DASHBOARD)
export async function getAdminData() {
    try {
        // 1. ZAKTUALIZUJ TO ZAPYTANIE:
        const allSlots = await db.query.availabilitySlots.findMany({
            orderBy: [asc(availabilitySlots.startTime)],
            limit: 100,
            with: {
                promoCodes: true, // To już miałeś
                bookings: true    // <--- DODAJ TO! (Dzięki temu slot będzie miał pole .bookings)
            }
        });

        const allBookings = await db.query.bookings.findMany({
            with: { slot: true },
            orderBy: [desc(bookings.createdAt)],
        });

        const allPromoCodes = await db.query.promoCodes.findMany({
            orderBy: [desc(promoCodes.isActive)],
            with: { slot: true }
        });

        return { success: true, slots: allSlots, bookings: allBookings, promoCodes: allPromoCodes };
    } catch (error) {
        console.error(error); // Warto dodać logowanie błędu
        return { success: false, error: "Błąd danych" };
    }
}
// 2. DODAWANIE SLOTU (Generator)
export async function createAdminSlot(formData: FormData) {
    const dateStr = formData.get("date") as string; // np. 2026-02-03
    const timeStr = formData.get("time") as string; // np. 10:00
    const capacity = parseInt(formData.get("capacity") as string) || 4;

    if (!dateStr || !timeStr) return { success: false, message: "Data i czas są wymagane" };

    try {
        const start = new Date(`${dateStr}T${timeStr}:00`);
        const end = new Date(start);
        end.setHours(start.getHours() + 1); // Domyślnie lekcja 1h

        await db.insert(availabilitySlots).values({
            startTime: start,
            endTime: end,
            maxCapacity: capacity,
            currentBookings: 0,
            isBooked: false,
        });

        revalidatePath("/admin");
        revalidatePath("/"); // Odśwież też stronę główną dla klientów
        return { success: true, message: "Slot dodany" };
    } catch (e) {
        return { success: false, message: "Błąd bazy danych" };
    }
}

// 3. USUWANIE SLOTU
export async function deleteSlot(slotId: string) {
    try {
        await db.delete(availabilitySlots).where(eq(availabilitySlots.id, slotId));
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        return { success: false, message: "Nie można usunąć slotu (może ma rezerwacje?)" };
    }
}

export async function createPromoCode(formData: FormData) {
    await checkAdmin();

    const code = formData.get("code") as string;
    const discount = Number(formData.get("discount"));
    const usageLimit = Number(formData.get("usageLimit"));

    // KLUCZOWE: Pobieramy slotId. Jeśli jest pusty string "", zamieniamy na NULL
    const rawSlotId = formData.get("specificSlotId") as string;
    const specificSlotId = rawSlotId === "GLOBAL" || rawSlotId === "" ? null : rawSlotId;

    if (!code || !discount) {
        return { success: false, message: "Kod i zniżka są wymagane" };
    }

    try {
        await db.insert(promoCodes).values({
            code: code.toUpperCase(),
            discount,
            usageLimit: usageLimit || 100, // Domyślnie 100 użyć
            specificSlotId: specificSlotId, // Tutaj trafia UUID lub NULL
        });

        revalidatePath("/admin");
        return { success: true, message: "Kod utworzony" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Błąd bazy danych (prawdopodobnie kod już istnieje)" };
    }
}

// NOWA AKCJA: Usuwanie kodu
export async function deletePromoCode(id: string) {
    await checkAdmin();

    try {
        await db.delete(promoCodes).where(eq(promoCodes.id, id));
        revalidatePath("/admin");
        return {success: true};
    } catch (e) {
        return {success: false, message: "Nie można usunąć kodu"};
    }
}