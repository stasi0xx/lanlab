import type { KubaSection } from "@/app/actions/kuba-actions";

type Faq = { id: string; question: string; answer: string };

const STOPWORDS = new Set([
    "a", "i", "o", "w", "z", "do", "na", "się", "jest", "czy", "jak", "co", "to",
    "dla", "ze", "od", "po", "u", "the", "is", "are", "you", "can", "how",
]);

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function overlapScore(queryTokens: string[], targetTokens: string[]): number {
    const targetSet = new Set(targetTokens);
    return queryTokens.filter((t) => targetSet.has(t)).length;
}

const SECTION_TRIGGERS: Record<KubaSection, string[]> = {
    historia: ["historia", "1968", "tradycja", "gdansk", "poczatek", "powstala", "kim", "jestescie"],
    misja: ["misja", "wartosci", "dlaczego", "cel", "podejscie"],
    oferta: ["oferta", "lekcje", "zajecia", "program", "jezyk", "jezyki", "nauka", "poziom"],
    cennik: ["cena", "cennik", "koszt", "platnosc", "ile", "kosztuje", "zl", "zloty"],
};

const FALLBACK_FACTS: Record<KubaSection, string> = {
    historia:
        "LANLAB ONLINE to cyfrowa odsłona Language Laboratories — szkoły językowej działającej w Gdańsku od 1968 roku, jednej z pierwszych tego typu w Europie.",
    misja:
        "Naszą misją jest indywidualne podejście do nauki — program dopasowany do ucznia, a nie odwrotnie.",
    oferta:
        "Prowadzimy indywidualne lekcje językowe online, 1:1, dopasowane do Twojego poziomu i celu.",
    cennik:
        "Lekcja standardowa kosztuje 150 zł za 60 minut. Z kodem rabatowym możesz odblokować bezpłatną lekcję próbną.",
};

export function kubaRespond(
    message: string,
    knowledge: Partial<Record<KubaSection, string>>,
    faqs: Faq[]
): string {
    const queryTokens = tokenize(message);
    if (queryTokens.length === 0) {
        return "Możesz zapytać mnie o historię szkoły, ofertę, cennik albo o to, jak się zapisać na lekcję.";
    }

    // 1. Zapisy / rezerwacja — najważniejsza intencja, kieruje do CTA
    if (overlapScore(queryTokens, ["zapis", "zapisac", "zarezerwowac", "rezerwacja", "umowic", "termin", "kalendarz"]) > 0) {
        return "Zapisy działają przez sekcję Rezerwacja na tej stronie: wybierasz lekcję standardową (150 zł / 60 min) albo wpisujesz kod rabatowy, żeby odblokować bezpłatną lekcję próbną, a potem wybierasz termin w kalendarzu.";
    }

    // 2. Lekcja próbna
    if (overlapScore(queryTokens, ["probna", "probny", "darmowa", "darmowy", "bezplatna", "bezplatny", "kod", "rabat"]) > 0) {
        return "Bezpłatną lekcję próbną odblokowujesz kodem rabatowym w sekcji Rezerwacja — po wpisaniu poprawnego kodu zobaczysz kalendarz z dostępnymi terminami.";
    }

    // 3. Dopasowanie do FAQ (najlepszy wynik nakładania słów kluczowych)
    let bestFaq: { faq: Faq; score: number } | null = null;
    for (const faq of faqs) {
        const score = overlapScore(queryTokens, tokenize(`${faq.question} ${faq.answer}`));
        if (score > 0 && (!bestFaq || score > bestFaq.score)) {
            bestFaq = { faq, score };
        }
    }
    if (bestFaq && bestFaq.score >= 2) {
        return bestFaq.faq.answer;
    }

    // 4. Dopasowanie do sekcji wiedzy (treść z CMS, z fallbackiem na fakty bazowe)
    let bestSection: { section: KubaSection; score: number } | null = null;
    for (const section of Object.keys(SECTION_TRIGGERS) as KubaSection[]) {
        const score = overlapScore(queryTokens, SECTION_TRIGGERS[section]);
        if (score > 0 && (!bestSection || score > bestSection.score)) {
            bestSection = { section, score };
        }
    }
    if (bestSection) {
        const content = knowledge[bestSection.section];
        return content && content.trim().length > 0 ? content : FALLBACK_FACTS[bestSection.section];
    }

    // 5. FAQ ze słabszym dopasowaniem, jeśli nic lepszego nie znaleziono
    if (bestFaq) {
        return bestFaq.faq.answer;
    }

    return "Nie mam jeszcze gotowej odpowiedzi na to pytanie. Zapytaj mnie o historię szkoły, ofertę, cennik albo zapisy — albo od razu umów się na lekcję w sekcji Rezerwacja.";
}
