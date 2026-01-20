import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-brand-secondary">
            {/* --- NOWE TŁO INSPIROWANE OBRAZKIEM --- */}
            {/* Kolorowa, rozmyta plama po prawej stronie */}
            <div
                className="absolute top-1/2 -translate-y-1/2 right-[-10%]
                   w-[800px] h-[800px] md:w-[1000px] md:h-[1000px]
                   rounded-full
                   bg-[radial-gradient(circle,var(--color-brand-accent)_0%,var(--color-brand-primary)_40%,transparent_70%)]
                   opacity-40 blur-[120px] -z-10
                   animate-pulse-slow pointer-events-none"
            />
            {/* Druga, mniejsza i subtelniejsza plama dla balansu po lewej */}
            <div
                className="absolute top-0 left-[-20%]
                   w-[600px] h-[600px]
                   rounded-full
                   bg-[radial-gradient(circle,var(--color-blue-200)_0%,transparent_70%)]
                   opacity-30 blur-[100px] -z-10
                   pointer-events-none"
            />
            {/* ------------------------------------ */}

            <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">

                {/* BADGE */}
                <div className="animate-fade-in-up [animation-delay:0ms] inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-primary backdrop-blur-md mb-8 shadow-sm">
                    <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                    <span>Nowoczesna edukacja z tradycjami</span>
                </div>

                {/* H1 - KLUCZOWY ELEMENT */}
                <h1 className="animate-fade-in-up [animation-delay:200ms] max-w-5xl text-5xl md:text-7xl lg:text-8xl font-serif text-text-main leading-[1.1] mb-8 drop-shadow-sm">
                    Z pasją do nauczania <br className="hidden md:block" />
                    od <span className="text-brand-primary italic pr-2 relative">1968 roku</span>
                    <span className="block text-3xl md:text-5xl text-text-muted mt-4 font-normal font-sans">
            w nowoczesnym wydaniu online
          </span>
                </h1>

                {/* OPIS */}
                <p className="animate-fade-in-up [animation-delay:400ms] max-w-2xl text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
                    Połączyliśmy 50 lat doświadczenia dydaktycznego z najnowszą technologią.
                    Indywidualne podejście, które działało wtedy, teraz dostępne w Twoim domu.
                </p>

                {/* PRZYCISKI */}
                <div className="animate-fade-in-up [animation-delay:600ms] flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link
                        href="#booking"
                        className="inline-flex h-14 items-center justify-center rounded-full bg-brand-primary px-8 text-lg font-semibold text-white shadow-xl shadow-brand-primary/20 transition-transform hover:scale-105 hover:bg-brand-accent"
                    >
                        Zapisz się na lekcję
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <button className="inline-flex h-14 items-center justify-center rounded-full bg-white/80 border border-blue-200 px-8 text-lg font-medium text-text-main shadow-sm transition-colors hover:bg-white hover:border-brand-accent backdrop-blur-sm">
                        Poznaj naszą historię
                    </button>
                </div>
            </div>
        </section>
    );
}