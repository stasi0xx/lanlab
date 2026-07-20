import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3 } from "lucide-react";
import { HeroFlag3D } from "@/components/ui/WavingFlag";

export function Hero() {
    return (
        <section className="relative pt-36 pb-24 md:pt-44 md:pb-28 overflow-hidden bg-white">
            {/* Subtelna siatka w tle, tylko tekstura, nie dekoracja */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a1f4405_1px,transparent_1px),linear-gradient(to_bottom,#0a1f4405_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            {/* Granatowy blob po prawej stronie */}
            <div className="absolute top-1/2 -right-56 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-brand-primary/25 blur-[120px] pointer-events-none" />
            <div className="absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full bg-brand-primary-dark/20 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* --- LEWA STRONA --- */}
                <div className="text-left space-y-8">
                    <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] text-brand-primary uppercase backdrop-blur-sm">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span>Od 1968 roku &middot; Gdańsk</span>
                    </div>

                    <h1 className="font-display text-4xl md:text-6xl lg:text-[3.6rem] font-bold text-brand-ink leading-[1.05] tracking-tight max-w-xl">
                        Z <span className="underline decoration-brand-primary decoration-4 underline-offset-4">pasją</span> do nauczania od <span className="underline decoration-brand-primary decoration-4 underline-offset-4">1968</span> roku w <span className="underline decoration-brand-primary decoration-4 underline-offset-4">nowoczesnym</span> wydaniu
                    </h1>

                    <p className="text-lg text-brand-muted max-w-lg leading-relaxed">
                        Nowoczesna nauka języków online, indywidualnie, z ponad pół wieku doświadczenia.
                        LANLAB ONLINE to nowa odsłona historycznej szkoły językowej.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Link
                            href="#booking"
                            className="group inline-flex h-14 items-center justify-center gap-2 bg-brand-primary px-8 text-sm font-bold uppercase tracking-widest text-white rounded-full transition-all hover:bg-brand-primary-dark hover:shadow-lg"
                        >
                            Bezpłatna lekcja próbna
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="#booking"
                            className="inline-flex h-14 items-center justify-center px-6 text-sm font-bold uppercase tracking-widest text-brand-ink/70 hover:text-brand-primary border border-brand-line hover:border-brand-primary/50 rounded-full transition-colors"
                        >
                            Umów się
                        </Link>
                    </div>
                </div>

                {/* --- PRAWA STRONA: falująca flaga + karta rezerwacji --- */}
                <div className="relative hidden lg:block">
                    <div className="relative w-full max-w-md mx-auto">
                        <HeroFlag3D />
                    </div>

                    {/* Pływająca karta rezerwacji */}
                    <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 w-64 border border-brand-line">
                        <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
                            <Clock3 className="w-4 h-4" />
                            Lekcja standardowa
                        </div>
                        <p className="font-display text-2xl font-bold text-brand-ink">150 zł <span className="text-sm font-medium text-brand-muted">/ 60 min</span></p>
                        <p className="text-xs text-brand-muted mt-1">Indywidualnie, online, w dogodnym terminie</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
