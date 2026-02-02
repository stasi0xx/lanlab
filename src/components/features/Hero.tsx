// src/components/features/Hero.tsx
import Link from "next/link";
import { ArrowRight, History, CalendarCheck } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import {HeroFlag3D} from "@/components/ui/WavingFlag";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-screen flex items-center bg-transparent selection:bg-white selection:text-black">

            {/* 1. TŁO: Tylko Gradient Animation. USUNIĘTO div z gridem. */}
            <div className="fixed inset-0 -z-50 pointer-events-none">
                <BackgroundGradientAnimation />
            </div>

            {/* 2. Maska gradientowa (opcjonalnie) - przyciemnia dół, żeby tekst 'Stats' niżej był czytelny */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 -z-40"></div>

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* --- LEWA STRONA --- */}
                <div className="text-left space-y-10">

                    {/* BADGE */}
                    <div className="opacity-0 animate-appear [animation-delay:0ms] inline-flex items-center gap-3 border-l-2 border-white bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <History className="w-3.5 h-3.5" />
                        <span>EST. 1968 / TRADITION RECODED</span>
                    </div>

                    {/* NAGŁÓWEK */}
                    <h1 className="opacity-0 animate-appear [animation-delay:200ms] text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                        WeTalk<span className="text-brand-primary">.</span>
                        <span className="block text-2xl md:text-3xl font-sans font-light tracking-normal text-white/80 mt-6 border-l border-white/30 pl-6 py-2">
                            Nie uczymy języków.<br />
                            <span className="text-white font-medium text-shadow-glow">Budujemy Twoją komunikację.</span>
                        </span>
                    </h1>

                    {/* OPIS */}
                    <p className="opacity-0 animate-appear [animation-delay:400ms] text-lg text-white/70 max-w-lg leading-relaxed font-medium">
                        Metoda prof. Szumilewicza, zdigitalizowana.
                        Surowa efektywność bez zbędnych gamifikacji.
                        Szkoła dla tych, którzy wymagają więcej.
                    </p>

                    {/* PRZYCISKI */}
                    <div className="opacity-0 animate-appear [animation-delay:600ms] flex flex-col sm:flex-row gap-5 pt-2">
                        <Link
                            href="#booking"
                            className="group relative inline-flex h-14 items-center justify-center overflow-hidden bg-white px-8 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(103,232,249,0.6)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Rozpocznij
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>

                        <Link
                            href="#historia"
                            className="group inline-flex h-14 items-center justify-center px-8 text-sm font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white border border-transparent hover:border-white/50"
                        >
                            Manifest Marki
                        </Link>
                    </div>
                </div>

                {/* --- PRAWA STRONA --- */}
                <div className="relative hidden lg:block">
                    {/* Dekoracyjna ramka w stylu LanLab */}


                    <div className="relative h-[500px] lg:h-[600px] w-full animate-fade-in">
                        <HeroFlag3D />

                        {/* Dodatkowy sznyt: "Badge" informacyjny */}
                        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                            <p className="text-white font-serif italic">Z tradycją od 1968</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}