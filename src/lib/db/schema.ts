import { pgTable, uuid, timestamp, boolean, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- TABELA: KODY RABATOWE ---


// --- TABELA: SLOTY (TERMINY) ---
export const availabilitySlots = pgTable("availability_slots", {
    id: uuid("id").defaultRandom().primaryKey(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    isBooked: boolean("is_booked").default(false),
    currentBookings: integer("current_bookings").default(0).notNull(),
    maxCapacity: integer("max_capacity").default(4).notNull(),
    version: integer("version").default(1),
});

// --- TABELA: REZERWACJE ---
export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    slotId: uuid("slot_id").notNull().references(() => availabilitySlots.id),
    userName: text("user_name").notNull(),
    userEmail: text("user_email").notNull(),
    userPhone: text("user_phone").notNull(),
    status: text("status").default("pending").notNull(),
    promoCodeId: uuid("promo_code_id").references(() => promoCodes.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promoCodes = pgTable("promo_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(), // np. "LATO2025"
    discount: integer("discount").notNull(), // np. 20 (procent)
    isActive: boolean("is_active").default(true),
    usageLimit: integer("usage_limit").default(100),
    usedCount: integer("used_count").default(0),

    // --- NOWE POLE: RELACJA DO SLOTU ---
    // Jeśli NULL -> kod działa na wszystko (globalny)
    // Jeśli USTAWIONE -> kod działa tylko na ten konkretny slot
    specificSlotId: uuid("specific_slot_id").references(() => availabilitySlots.id),

    createdAt: timestamp("created_at").defaultNow(),
});
// --- RELACJE (DEFINIUJEMY TYLKO RAZ!) ---

// 1. Relacje Slotu (ma wiele rezerwacji i wiele kodów)
export const slotsRelations = relations(availabilitySlots, ({ many }) => ({
    bookings: many(bookings),
    promoCodes: many(promoCodes),
}));

// 2. Relacje Rezerwacji (należy do jednego slotu)
export const bookingsRelations = relations(bookings, ({ one }) => ({
    slot: one(availabilitySlots, {
        fields: [bookings.slotId],
        references: [availabilitySlots.id],
    }),
    promoCode: one(promoCodes, {
        fields: [bookings.promoCodeId],
        references: [promoCodes.id],
    }),
}));

// 3. Relacje Kodów Rabatowych (może należeć do slotu)
export const promoCodesRelations = relations(promoCodes, ({ one }) => ({
    slot: one(availabilitySlots, {
        fields: [promoCodes.specificSlotId],
        references: [availabilitySlots.id],
    }),
}));