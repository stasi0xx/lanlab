import { config } from "dotenv";
// 1. Ładujemy zmienne środowiskowe z głównego katalogu
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { availabilitySlots, promoCodes, knowledgeBase } from "./schema";

const runSeed = async () => {
    console.log("🌱 Sprawdzam połączenie...");

    // 2. Pobieramy DIRECT_URL (port 5432) - stabilniejszy dla skryptów
    const connectionString = process.env.DIRECT_URL;

    if (!connectionString) {
        throw new Error("❌ Błąd: Brak DIRECT_URL w pliku .env.local");
    }

    // 3. Tworzymy klienta SQL specjalnie dla seeda
    const client = postgres(connectionString, {
        max: 1, // Tylko jedno połączenie, nie potrzebujemy więcej
        ssl: 'require', // Wymagane przez Supabase
    });

    const db = drizzle(client);

    console.log("🌱 Rozpoczynam seedowanie...");

    try {
        // --- KODY RABATOWE ---
        await db.insert(promoCodes).values([
            {
                code: "START2025",
                type: "free_trial",
                usageLimit: 50,
                isActive: true,
            },
            {
                code: "LANLAB10",
                type: "discount",
                usageLimit: 100,
                isActive: true,
            },
        ]).onConflictDoNothing();
        console.log("✅ Kody rabatowe dodane.");

        // --- SLOTY KALENDARZA (OD 3 LUTEGO) ---
        const slots = [];
        const baseDate = new Date("2025-02-03T09:00:00.000Z"); // 3 Lutego, 10:00 czasu PL

        for (let i = 0; i < 5; i++) {
            for (let h = 0; h < 4; h++) {
                const start = new Date(baseDate);
                start.setDate(baseDate.getDate() + i);
                start.setHours(10 + h);

                const end = new Date(start);
                end.setHours(start.getHours() + 1);

                slots.push({
                    startTime: start,
                    endTime: end,
                    isBooked: false,
                });
            }
        }
        await db.insert(availabilitySlots).values(slots);
        console.log("✅ Sloty kalendarza dodane.");

        // --- WIEDZA CHATBOTA ---
        await db.insert(knowledgeBase).values([
            {
                content: "Language Laboratories powstało w 1968 roku w Gdańsku. Jesteśmy jedną z najstarszych szkół językowych w Europie.",
                metadata: JSON.stringify({ category: "historia" }),
            },
            {
                content: "Standardowa lekcja kosztuje 150 zł i trwa 60 minut. Oferujemy zajęcia online.",
                metadata: JSON.stringify({ category: "oferta" }),
            },
        ]);
        console.log("✅ Wiedza dla Kuby dodana.");

        console.log("🏁 Seedowanie zakończone sukcesem!");
    } catch (error) {
        console.error("❌ Błąd podczas seedowania:", error);
    } finally {
        // Zamykamy połączenie, żeby skrypt nie wisiał
        await client.end();
    }
};

runSeed();