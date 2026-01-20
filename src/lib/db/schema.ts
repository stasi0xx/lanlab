import { pgTable, text, timestamp, boolean, uuid, integer, vector, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- 1. SEKCJA AI / CHATBOT ---

export const knowledgeBase = pgTable("knowledge_base", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(), // Treść kawałka wiedzy (chunk)
    metadata: text("metadata"), // Opcjonalne tagi JSON, np. { source: "historia", page: 1 }
    embedding: vector("embedding", { dimensions: 1536 }), // OpenAI embedding (text-embedding-3-small)
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    // Indeks HNSW dla szybkiego wyszukiwania wektorowego (wymaga włączenia pgvector w Supabase!)
    index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops"))
]);

// --- 2. SEKCJA BOOKINGU ---

// Dostępne sloty czasowe (definiowane przez administratora)
export const availabilitySlots = pgTable("availability_slots", {
    id: uuid("id").defaultRandom().primaryKey(),
    startTime: timestamp("start_time").notNull(), // np. 2025-02-03 14:00:00
    endTime: timestamp("end_time").notNull(),   // np. 2025-02-03 15:00:00
    isBooked: boolean("is_booked").default(false).notNull(),
    // Zabezpieczenie przed wyścigiem (Optimistic locking version)
    version: integer("version").default(0).notNull(),
});

// Kody rabatowe
export const promoCodes = pgTable("promo_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").unique().notNull(), // np. "START2025"
    type: text("type").notNull(), // 'free_trial' | 'discount'
    isActive: boolean("is_active").default(true).notNull(),
    usageLimit: integer("usage_limit").default(100), // Ile razy można użyć
    usedCount: integer("used_count").default(0).notNull(),
});

// Rezerwacje
export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    slotId: uuid("slot_id").references(() => availabilitySlots.id).notNull(),
    userEmail: text("user_email").notNull(),
    userName: text("user_name").notNull(),
    userPhone: text("user_phone"),
    status: text("status").default("pending").notNull(), // pending, confirmed, cancelled
    promoCodeId: uuid("promo_code_id").references(() => promoCodes.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});