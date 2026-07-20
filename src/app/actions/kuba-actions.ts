"use server";

import { db } from "@/lib/db";
import { kubaKnowledge, kubaFaq, kubaNews } from "@/lib/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SECTIONS = ["historia", "misja", "oferta", "cennik"] as const;
export type KubaSection = (typeof SECTIONS)[number];

async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return user;
}

// --- ODCZYT: strona publiczna (widget KUBA) ---
export async function getKubaKnowledgeForChat() {
    try {
        const [knowledge, faqs] = await Promise.all([
            db.select().from(kubaKnowledge),
            db.query.kubaFaq.findMany({ orderBy: [asc(kubaFaq.order)] }),
        ]);

        const bySection = Object.fromEntries(knowledge.map((k) => [k.section, k.content])) as Record<KubaSection, string>;

        return { knowledge: bySection, faqs };
    } catch (error) {
        console.error("Błąd pobierania wiedzy KUBY:", error);
        return { knowledge: {} as Record<KubaSection, string>, faqs: [] };
    }
}

// --- ODCZYT: panel admina ---
export async function getKubaAdminData() {
    await checkAdmin();

    try {
        const [knowledge, faqs, news] = await Promise.all([
            db.select().from(kubaKnowledge),
            db.query.kubaFaq.findMany({ orderBy: [asc(kubaFaq.order)] }),
            db.query.kubaNews.findMany({ orderBy: [desc(kubaNews.publishedAt)] }),
        ]);

        const bySection = Object.fromEntries(knowledge.map((k) => [k.section, k.content])) as Record<KubaSection, string>;

        return { knowledge: bySection, faqs, news };
    } catch (error) {
        console.error("Błąd pobierania danych admina KUBY:", error);
        return { knowledge: {} as Record<KubaSection, string>, faqs: [], news: [] };
    }
}

// --- ZAPIS: sekcja wiedzy (upsert) ---
export async function saveKnowledgeSection(formData: FormData) {
    await checkAdmin();

    const section = formData.get("section") as string;
    const content = formData.get("content") as string;

    if (!SECTIONS.includes(section as KubaSection)) {
        return { success: false, message: "Nieznana sekcja" };
    }

    try {
        await db
            .insert(kubaKnowledge)
            .values({ section, content: content || "" })
            .onConflictDoUpdate({
                target: kubaKnowledge.section,
                set: { content: content || "", updatedAt: sql`now()` },
            });

        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true, message: "Zapisano" };
    } catch (error) {
        console.error("Błąd zapisu wiedzy KUBY:", error);
        return { success: false, message: "Błąd bazy danych" };
    }
}

// --- FAQ ---
export async function createFaqEntry(formData: FormData) {
    await checkAdmin();

    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;

    if (!question || !answer) {
        return { success: false, message: "Pytanie i odpowiedź są wymagane" };
    }

    try {
        await db.insert(kubaFaq).values({ question, answer, order: 0 });
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Błąd dodawania FAQ:", error);
        return { success: false, message: "Błąd bazy danych" };
    }
}

export async function deleteFaqEntry(id: string) {
    await checkAdmin();
    try {
        await db.delete(kubaFaq).where(eq(kubaFaq.id, id));
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Nie można usunąć wpisu" };
    }
}

// --- AKTUALNOŚCI ---
export async function createNewsEntry(formData: FormData) {
    await checkAdmin();

    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title || !body) {
        return { success: false, message: "Tytuł i treść są wymagane" };
    }

    try {
        await db.insert(kubaNews).values({ title, body });
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Błąd dodawania aktualności:", error);
        return { success: false, message: "Błąd bazy danych" };
    }
}

export async function deleteNewsEntry(id: string) {
    await checkAdmin();
    try {
        await db.delete(kubaNews).where(eq(kubaNews.id, id));
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, message: "Nie można usunąć wpisu" };
    }
}
