"use server";

import { db } from "@/lib/db";
import { bookings, availabilitySlots, promoCodes } from "@/lib/db/schema";
import { eq, and, sql, or, isNull } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- SCHEMATY WALIDACJI (ZOD) ---

// Schemat dla kodu rabatowego
const PromoSchema = z.object({
    code: z.string().min(3).toUpperCase(),
    slotId: z.string().uuid().optional(), // Slot jest potrzebny do weryfikacji kodów dedykowanych
});

// Schemat dla formularza zapisu
const BookingSchema = z.object({
    slotId: z.string().uuid(),
    promoCode: z.string().optional(), // Opcjonalny, bo może płacić (w przyszłości)
    name: z.string().min(2, "Imię jest wymagane"),
    email: z.string().email("Niepoprawny email"),
    phone: z.string().min(9, "Numer telefonu jest za krótki"),
});

// --- AKCJA 1: WERYFIKACJA KODU ---

export async function verifyPromoCode(formData: FormData) {
    const rawCode = formData.get("code") as string;
    const slotId = formData.get("slotId") as string; // Pobieramy slotId z formularza

    const validated = PromoSchema.safeParse({ code: rawCode, slotId });
    if (!validated.success) return { success: false, message: "Błędne dane." };

    const { code, slotId: targetSlotId } = validated.data;

    try {
        const codeRecord = await db.query.promoCodes.findFirst({
            where: and(
                eq(promoCodes.code, code),
                eq(promoCodes.isActive, true)
            ),
        });

        if (!codeRecord) return { success: false, message: "Kod nieprawidłowy." };

        if ((codeRecord.usageLimit || 0) <= (codeRecord.usedCount || 0)) {
            return { success: false, message: "Limit kodu wyczerpany." };
        }

        // KLUCZOWE: Sprawdzenie dedykowanego slotu
        if (codeRecord.specificSlotId) {
            if (!targetSlotId) return { success: false, message: "Ten kod wymaga wybrania terminu." };
            if (codeRecord.specificSlotId !== targetSlotId) {
                return { success: false, message: "Ten kod nie obowiązuje na wybrany termin." };
            }
        }

        return {
            success: true,
            message: codeRecord.specificSlotId ? "Kod dedykowany przyjęty!" : "Kod rabatowy przyjęty!",
            type: codeRecord.type,
            codeId: codeRecord.id
        };

    } catch (error) {
        return { success: false, message: "Błąd weryfikacji." };
    }
}

// --- AKCJA 2: REZERWACJA TERMINU ---

export async function createBooking(prevState: any, formData: FormData) {
    // Parsujemy dane z formularza
    const rawData = {
        slotId: formData.get("slotId"),
        promoCodeId: formData.get("promoCodeId"), // ID kodu (ukryte pole), nie sam tekst
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
    };

    // 1. Walidacja danych
    // Uwaga: Zod oczekuje stringów, a FormData może dać null, więc rzutujemy ostrożnie w UI, tu walidujemy
    if (!rawData.slotId || !rawData.name || !rawData.email) {
        return { success: false, message: "Uzupełnij wszystkie pola." };
    }

    try {
        // 2. Sprawdź czy slot jest nadal wolny (Race condition check!)
        const slot = await db.query.availabilitySlots.findFirst({
            where: eq(availabilitySlots.id, rawData.slotId as string),
        });

        if (!slot || slot.currentBookings >= slot.maxCapacity) {
            return { success: false, message: "Niestety, ten termin właśnie się zapełnił." };
        }

        // --- NOWOŚĆ: SPRAWDZENIE PODWÓJNEGO ZAPISU ---
        const existingBooking = await db.query.bookings.findFirst({
            where: and(
                eq(bookings.slotId, rawData.slotId as string),
                eq(bookings.userEmail, rawData.email as string)
            )
        });

        if (existingBooking) {
            return { success: false, message: "Jesteś już zapisany na ten termin! Sprawdź maila." };
        }

        // 3. TRANSAKCJA (Drizzle + Postgres): Zapisz booking + Oznacz slot jako zajęty
        await db.transaction(async (tx) => {
            // A. Dodaj rezerwację
            await tx.insert(bookings).values({
                slotId: rawData.slotId as string,
                userName: rawData.name as string,
                userEmail: rawData.email as string,
                userPhone: rawData.phone as string,
                promoCodeId: rawData.promoCodeId ? (rawData.promoCodeId as string) : null,
                status: "confirmed", // Na razie od razu potwierdzone (MVP)
            });

            // B. Zablokuj slot
            await tx.update(availabilitySlots)
                .set({
                    // Zwiększamy licznik o 1
                    currentBookings: sql`${availabilitySlots.currentBookings} + 1`,
                    // Jeśli po dodaniu będzie full, ustaw isBooked na true (opcjonalnie, dla porządku)
                    isBooked: sql`${availabilitySlots.currentBookings} + 1 >= ${availabilitySlots.maxCapacity}`
                })
                .where(eq(availabilitySlots.id, rawData.slotId as string));
        });

        // 4. Odśwież cache, żeby kalendarz zaktualizował się u wszystkich
        revalidatePath("/");

        return { success: true, message: "Rezerwacja potwierdzona!" };

    } catch (error) {
        console.error("Booking Error:", error);
        return { success: false, message: "Wystąpił błąd podczas rezerwacji. Spróbuj ponownie." };
    }
}