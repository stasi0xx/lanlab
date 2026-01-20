import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Upewnij się, że masz ten import do łączenia klas

export function AboutSection() {
    return (
        // Dodano id="about" dla łatwiejszej nawigacji w przyszłości
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* --- KOLUMNA LEWA: ZDJĘCIE 1:1 (Animacja wejścia) --- */}
                    <div className="relative animate-fade-in-up">
                        {/* Ozdobne tło pod zdjęciem */}
                        <div className="absolute top-4 left-4 w-full h-full bg-slate-100 rounded-2xl -z-10" />
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pattern-dots opacity-20 animate-fade-in delay-500" />

                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                            <Image
                                src="/images/about-1968.jpg" // Upewnij się, że plik istnieje
                                alt="Historyczne zdjęcie Language Laboratories z 1968 roku"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />

                            {/* Badge na zdjęciu - pojawia się chwilę później */}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-lg border border-white shadow-lg animate-fade-in-up delay-300">
                                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Założono w Gdańsku</p>
                                <p className="text-3xl font-serif font-bold text-brand-primary">1968</p>
                            </div>
                        </div>
                    </div>

                    {/* --- KOLUMNA PRAWA: TREŚĆ (Animacje kaskadowe/staggered) --- */}
                    <div className="space-y-8">
                        {/* Blok 1: Nagłówek (Lekkie opóźnienie względem zdjęcia) */}
                        <div className="animate-fade-in-up delay-100">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
                                Dziedzictwo i Przyszłość
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                                Pionierskie metody. <br/>
                                <span className="italic text-slate-500">Nowa rzeczywistość.</span>
                            </h2>
                        </div>

                        {/* Blok 2: Akapity tekstu (Kolejne opóźnienie) */}
                        <div className="space-y-4 text-lg text-slate-600 leading-relaxed animate-fade-in-up delay-200">
                            <p>
                                <strong>Language Laboratories (LANLAB)</strong> to jedna z pierwszych szkół językowych w Europie, która powstała w 1968 roku w Gdańsku. Już wtedy nasza nazwa nie była przypadkowa – nawiązywała do "laboratoryjnej" precyzji i nowoczesnych metod nauczania, które wyprzedzały swoją epokę.
                            </p>
                            <p>
                                Dziś przenosimy to dziedzictwo do świata cyfrowego jako <strong>LANLAB ONLINE</strong>. Zmieniła się technologia, ale nasza filozofia pozostała ta sama: indywidualne podejście do ucznia i dydaktyka oparta na zrozumieniu, a nie tylko pamięci.
                            </p>
                        </div>

                        {/* Blok 3: Wypunktowania (Każdy punkt wjeżdża osobno) */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <FeatureItem
                                text="Ponad 50 lat doświadczenia w dydaktyce"
                                className="animate-fade-in-up delay-300"
                            />
                            <FeatureItem
                                text="Pionierskie podejście do indywidualizacji nauczania"
                                // Używamy dokładniejszych opóźnień w ms dla płynniejszego efektu
                                className="animate-fade-in-up delay-[400ms]"
                            />
                            <FeatureItem
                                text="Nowoczesna platforma online z duszą tradycyjnej szkoły"
                                className="animate-fade-in-up delay-[500ms]"
                            />
                        </div>

                        {/* Blok 4: Podpis/Cytat (Na samym końcu) */}
                        <div className="pt-6 animate-fade-in-up delay-[600ms]">
                            <p className="font-serif italic text-slate-800 text-xl">
                                "Nie uczymy tylko słówek. Uczymy myśleć w nowym języku."
                            </p>
                            <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-wide">
                                — Misja Language Laboratories
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// Zaktualizowany komponent pomocniczy, który przyjmuje className dla animacji
function FeatureItem({ text, className }: { text: string, className?: string }) {
    return (
        // Używamy cn() do połączenia klas bazowych z klasami animacji przekazanymi z góry
        <div className={cn("flex items-start gap-3", className)}>
            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-700 font-medium">{text}</span>
        </div>
    );
}