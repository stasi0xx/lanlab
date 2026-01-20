import { pgTable, uuid, timestamp, boolean, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- TABELA: KODY RABATOWE ---
export const promoCodes = pgTable("promo_codes", {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(),
    type: text("type").notNull(), // 'discount' | 'free_trial'
    usageLimit: integer("usage_limit").default(1),
    usedCount: integer("used_count").default(0),
    isActive: boolean("is_active").default(true),
    specificSlotId: uuid("specific_slot_id"), // Przypisanie do konkretnego slotu
});

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
}));

// 3. Relacje Kodów Rabatowych (może należeć do slotu)
export const promoCodesRelations = relations(promoCodes, ({ one }) => ({
    slot: one(availabilitySlots, {
        fields: [promoCodes.specificSlotId],
        references: [availabilitySlots.id],
    }),
}));