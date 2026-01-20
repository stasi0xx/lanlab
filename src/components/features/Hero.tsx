import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export function Hero() {
    return (
        // 1. USUNIĘTO bg-brand-secondary (bo zasłaniał animację)
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">

            {/* 2. TŁO: Jest teraz niezależnym elementem "pod spodem" */}
            <BackgroundGradientAnimation containerClassName="absolute inset-0 -z-10" />

            {/* 3. TREŚĆ: Wyciągnięta na zewnątrz, z relative i z-10, żeby była NAD tłem */}
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEWA STRONA: COPYWRITING */}
                <div className="text-left space-y-8">

                    {/* BADGE */}
                    <div className="opacity-0 animate-appear [animation-delay:0ms] inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-white/80 px-4 py-1.5 text-sm font-bold text-brand-primary backdrop-blur-md shadow-sm">
                        <History className="w-4 h-4" />
                        <span className="tracking-wide">EST. 1968 GDANSK</span>
                    </div>

                    {/* NAGŁÓWEK */}
                    <h1 className="opacity-0 animate-appear [animation-delay:200ms] text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-[0.95] tracking-tight drop-shadow-sm">
                        Z pasją <br />
                        do nauczania <br />
                        <span className="relative inline-block mt-2">
                            <span className="relative z-10 italic text-brand-primary pr-4">od 1968 roku</span>
                            <svg className="absolute bottom-2 left-0 w-full h-3 text-brand-accent/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    {/* OPIS */}
                    <p className="opacity-0 animate-appear [animation-delay:400ms] text-xl text-slate-600 max-w-lg leading-relaxed border-l-4 border-brand-accent/50 pl-6 font-medium">
                        Pionierskie metody prof. Szumilewicza przeniesione do świata cyfrowego.
                        <span className="block mt-2 font-bold text-slate-900">To nie jest kolejna aplikacja. To szkoła.</span>
                    </p>

                    {/* PRZYCISKI */}
                    <div className="opacity-0 animate-appear [animation-delay:600ms] flex flex-col sm:flex-row gap-4 pt-4">
                        <Link
                            href="#booking"
                            className="inline-flex h-14 items-center justify-center rounded-none bg-brand-primary px-8 text-lg font-serif italic text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-slate-900 hover:-translate-y-1"
                        >
                            Umów Lekcję Próbną
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link href={'#historia'} className="inline-flex h-14 items-center justify-center border-b-2 border-slate-900 px-6 text-lg font-bold text-slate-900 transition-colors hover:text-brand-primary hover:border-brand-primary">
                            Poznaj Historię
                        </Link>
                    </div>
                </div>

                {/* PRAWA STRONA: ZDJĘCIE */}
                <div className="relative h-[500px] w-full hidden lg:block perspective-1000 opacity-0 animate-appear [animation-delay:800ms]">

                    <div className="absolute top-10 right-10 w-full h-full border-2 border-brand-primary/20 z-0" />

                    <div className="absolute inset-0 bg-gray-200 z-10 overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-700 ease-out group border border-white/50">
                        {/* ZDJĘCIE */}
                        <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                            {/* Pamiętaj o dodaniu zdjęcia do folderu public! */}
                            <div className="absolute inset-0 bg-[url('/pierwsza_placowka.jpg')] bg-cover bg-center opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-normal"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                            <span className="relative z-20 text-white/70 font-mono text-xs uppercase tracking-widest border border-white/30 px-4 py-2 bg-black/20 backdrop-blur-sm">
                                [FOTO: Stanowisko nr 1, 1968]
                            </span>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-6 border-t border-white/20">
                            <div className="flex justify-between items-end text-slate-900">
                                <div>
                                    <p className="text-xs font-mono uppercase text-brand-primary font-bold mb-1">Status</p>
                                    <p className="font-serif text-xl italic">Online Available</p>
                                </div>
                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Pływający element */}
                    <div className="absolute -bottom-10 -left-10 bg-white p-6 shadow-2xl border border-gray-100 z-20 max-w-[200px] animate-float opacity-0 animate-appear [animation-delay:1000ms]">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-bold">Następny termin</p>
                        <p className="text-3xl font-serif text-brand-primary">03 Lutego</p>
                        <p className="text-sm text-slate-900 mt-1 font-medium">godz. 17:00</p>
                    </div>
                </div>

            </div>
        </section>
    );
}