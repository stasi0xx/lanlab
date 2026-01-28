// src/app/login/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Walidacja inputu to podstawa bezpieczeństwa
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    // 1. Walidacja danych wejściowych
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Nieprawidłowy format danych." };
    }

    // 2. Próba logowania w Supabase
    const { error } = await supabase.auth.signInWithPassword({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
    });

    if (error) {
        // Nie mówimy "złe hasło", żeby nie ułatwiać enumeracji użytkowników.
        // Mówimy ogólnie: "Błąd uwierzytelniania".
        return { error: "Błąd uwierzytelniania. Sprawdź poświadczenia." };
    }

    // 3. Sukces -> Przekierowanie
    revalidatePath("/", "layout");
    redirect("/admin");
}