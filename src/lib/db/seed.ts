import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { availabilitySlots, promoCodes } from "./schema";

const runSeed = async () => {
    const connectionString = process.env.DIRECT_URL;
    if (!connectionString) throw new Error("Brak DIRECT_URL");

    const client = postgres(connectionString, { max: 1, ssl: 'require' });
    const db = drizzle(client);

    console.log("🌱 Seedowanie danych na rok 2026...");

    try {
        // 1. Kody rabatowe (bez zmian)
        await db.insert(promoCodes).values([
            { code: "START2026", type: "free_trial", usageLimit: 50, isActive: true }, // Zaktualizowałem kod na 2026
            { code: "LANLAB10", type: "discount", usageLimit: 100, isActive: true },
        ]).onConflictDoNothing();

        // 2. SLOTY: LUTY 2026 (Pełny zakres)
        // Generujemy sloty od 3 do 14 lutego 2026
        const slots = [];
        const baseDate = new Date("2026-02-03T09:00:00.000Z"); // 3 Lutego 2026

        for (let i = 0; i < 12; i++) { // 12 dni dostępności
            for (let h = 0; h < 5; h++) { // 5 slotów dziennie (więcej opcji)
                const start = new Date(baseDate);
                start.setDate(baseDate.getDate() + i);
                start.setHours(10 + h);

                // Pomijamy weekendy (opcjonalnie, ale wygląda bardziej realistycznie)
                const day = start.getDay();
                if (day === 0 || day === 6) continue;

                const end = new Date(start);
                end.setHours(start.getHours() + 1);

                slots.push({
                    startTime: start,
                    endTime: end,
                    isBooked: false,
                    currentBookings: 0, // Na start 0
                    maxCapacity: 4,     // Ustawiamy limit na 4 osoby
                });
            }
        }

        // Wyczyść stare sloty (opcjonalne, ale zalecane przy re-seedowaniu)
        // await db.delete(availabilitySlots);

        if (slots.length > 0) {
            await db.insert(availabilitySlots).values(slots);
        }

        console.log(`✅ Dodano ${slots.length} slotów na Luty 2026.`);

        // 3. Wiedza (bez zmian)

        console.log("🏁 Gotowe!");
    } catch (error) {
        console.error("❌ Błąd:", error);
    } finally {
        await client.end();
    }
};

runSeed();