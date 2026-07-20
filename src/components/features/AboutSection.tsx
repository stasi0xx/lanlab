import Image from "next/image";
import { Sparkles } from "lucide-react";

export function AboutSection() {
    return (
        <section id="historia" className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-brand-line">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* --- KOLUMNA LEWA: ARCHIWUM --- */}
                    <div className="relative">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-line shadow-lg">
                            <Image
                                src="/pierwsza_placowka.jpg"
                                alt="Pierwsze stanowisko szkoły Language Laboratories, 1968"
                                fill
                                className="object-cover grayscale sepia-[.25] contrast-110"
                            />
                            <div className="absolute inset-0 bg-brand-primary/25 mix-blend-multiply" />

                            <div className="absolute bottom-0 left-0 bg-white/95 backdrop-blur-sm rounded-tr-2xl px-5 py-4">
                                <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-0.5">Archiwum</p>
                                <p className="font-display text-3xl font-bold text-brand-ink leading-none">1968</p>
                            </div>
                        </div>
                    </div>

                    {/* --- KOLUMNA PRAWA: TREŚĆ --- */}
                    <div className="space-y-8">
                        <div className="space-y-5">
                            <span className="inline-flex items-center gap-2 text-brand-primary font-bold tracking-widest uppercase text-xs">
                                <Sparkles className="w-3.5 h-3.5" />
                                O nas
                            </span>

                            <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-ink leading-[1.05]">
                                Language Laboratories. <br />
                                <span className="text-brand-primary">Od 1968 roku.</span>
                            </h2>
                        </div>

                        <div className="space-y-5 text-base md:text-lg text-brand-muted leading-relaxed">
                            <p>
                                Jedna z wcześniej działających szkół językowych w Europie, założona w Gdańsku. Jej nazwa
                                i program nawiązywały do nowoczesnych, jak na tamte czasy, metod nauczania — z elementami
                                indywidualizacji, które w polskim szkolnictwie językowym uznano za pionierskie.
                            </p>
                            <p>
                                Przez ponad pół wieku metoda się rozwijała, ale zasada pozostała ta sama: program
                                dopasowany do ucznia, nie odwrotnie. <strong className="text-brand-ink font-semibold">LANLAB
                                ONLINE</strong> to ta sama szkoła, przeniesiona w erę cyfrową.
                            </p>
                        </div>

                        <div className="border-l-2 border-brand-primary/30 pl-6 py-1">
                            <p className="text-brand-ink font-display text-xl italic leading-snug">
                                "50 lat doświadczenia nauczyło nas jednego — najlepiej uczy się, gdy program mówi
                                Twoim językiem, nie odwrotnie."
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
