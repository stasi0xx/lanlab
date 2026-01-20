"use server";

import { db } from "@/lib/db";
import { availabilitySlots } from "@/lib/db/schema";
import { and, eq, gte, lte, asc, lt } from "drizzle-orm"; // Dodaj import 'lt' (less than)

export async function getAvailableSlots(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const slots = await db
            .select()
            .from(availabilitySlots)
            .where(
                and(
                    gte(availabilitySlots.startTime, startOfDay),
                    lte(availabilitySlots.startTime, endOfDay),
                    // NOWY WARUNEK: Pobierz jeśli liczba rezerwacji jest mniejsza niż limit
                    lt(availabilitySlots.currentBookings, availabilitySlots.maxCapacity)
                )
            )
            .orderBy(asc(availabilitySlots.startTime));

        return { success: true, data: slots };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Błąd serwera." };
    }
}