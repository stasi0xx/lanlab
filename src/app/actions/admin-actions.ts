// src/app/actions/admin-actions.ts
"use server";

import { db } from "@/lib/db";
import { promoCodes, availabilitySlots, bookings } from "@/lib/db/schema";
import { desc, eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// --- HELPER AUTH ---
async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
}

// --- 1. POBIERANIE DANYCH (DASHBOARD) ---
export async function getAdminData() {
    await checkAdmin();

    try {
        const allPromoCodes = await db.query.promoCodes.findMany({
            orderBy: [desc(promoCodes.createdAt)],
            with: { slot: true }
        });

        // ZMIANA TUTAJ: Zagnieżdżone "with"
        const allSlots = await db.query.availabilitySlots.findMany({
            orderBy: [asc(availabilitySlots.startTime)],
            with: {
                bookings: {
                    // Chcemy pobrać rezerwacje...
                    with: {
                        promoCode: true // ...i powiązany z nimi kod rabatowy!
                    }
                }
            }
        });

        return {
            codes: allPromoCodes,
            allSlots: allSlots
        };
    } catch (error) {
        console.error("Błąd admin data:", error);
        return { codes: [], allSlots: [] };
    }
}

// --- 2. ZARZĄDZANIE SLOTAMI (PRZYWRÓCONE) ---

export async function createAdminSlot(formData: FormData) {
    await checkAdmin();

    const dateStr = formData.get("date") as string; // np. 2026-02-03
    const timeStr = formData.get("time") as string; // np. 10:00
    const capacity = parseInt(formData.get("capacity") as string) || 4;

    if (!dateStr || !timeStr) {
        return { success: false, message: "Data i czas są wymagane" };
    }

    try {
        // Tworzymy obiekty Date
        const start = new Date(`${dateStr}T${timeStr}:00`);
        const end = new Date(start);
        end.setHours(start.getHours() + 1); // Domyślnie lekcja trwa 1h

        await db.insert(availabilitySlots).values({
            startTime: start,
            endTime: end,
            maxCapacity: capacity,
            currentBookings: 0,
            isBooked: false,
        });

        revalidatePath("/admin");
        revalidatePath("/"); // Odświeżamy też stronę główną dla klientów
        return { success: true, message: "Termin dodany" };
    } catch (e) {
        console.error("Błąd dodawania slotu:", e);
        return { success: false, message: "Błąd bazy danych" };
    }
}

export async function deleteSlot(slotId: string) {
    await checkAdmin();

    try {
        await db.delete(availabilitySlots).where(eq(availabilitySlots.id, slotId));
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        console.error("Błąd usuwania slotu:", e);
        // Najczęstszy błąd: Klucz obcy (są już rezerwacje lub kody przypisane do tego slotu)
        return { success: false, message: "Nie można usunąć terminu (może być powiązany z rezerwacjami lub kodami)" };
    }
}

// --- 3. ZARZĄDZANIE KODAMI RABATOWYMI ---

export async function createPromoCode(formData: FormData) {
    await checkAdmin();

    const code = formData.get("code") as string;
    const discount = Number(formData.get("discount"));
    const usageLimit = Number(formData.get("usageLimit"));

    // Pobieramy ID slotu (specificSlotId)
    const rawSlotId = formData.get("specificSlotId") as string;
    const targetSlotId = (rawSlotId === "GLOBAL" || rawSlotId === "") ? null : rawSlotId;

    if (!code || !discount) {
        return { success: false, message: "Kod i zniżka są wymagane" };
    }

    try {
        await db.insert(promoCodes).values({
            code: code.toUpperCase(),
            discount,
            usageLimit: usageLimit || 100,
            specificSlotId: targetSlotId, // Relacja do availabilitySlots
        });

        revalidatePath("/admin");
        return { success: true, message: "Kod utworzony" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Błąd bazy danych (prawdopodobnie kod już istnieje)" };
    }
}

export async function deletePromoCode(id: string) {
    await checkAdmin();
    try {
        await db.delete(promoCodes).where(eq(promoCodes.id, id));
        revalidatePath("/admin");
        return { success: true };
    } catch (e) {
        return { success: false, message: "Nie można usunąć kodu" };
    }
}