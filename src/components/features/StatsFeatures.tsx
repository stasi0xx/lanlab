// src/components/features/StatsFeatures.tsx
import { CountUp } from "@/components/ui/CountUp";
import { GraduationCap, FlaskConical, Globe, Terminal } from "lucide-react";

export function StatsFeatures() {
    return (
        <section className="py-32 bg-black relative overflow-hidden border-t border-zinc-900" id="metoda">

            {/* TŁO: Techniczna siatka */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                {/* --- TYTUŁ SEKCJ --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-zinc-800 pb-12">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-3 text-brand-primary font-mono text-xs uppercase tracking-[0.2em]">
                            <Terminal className="w-4 h-4" />
                            <span>System Metrics</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-white leading-[0.9]">
                            Liczby nie kłamią.<br />
                            <span className="text-zinc-500">Skuteczność to matematyka.</span>
                        </h2>
                    </div>

                    <p className="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed text-right md:text-left font-mono">
                        /// STAT_LOG_INIT<br/>
                        W świecie marketingu liczy się opowieść. W świecie nauki liczą się dowody.
                    </p>
                </div>

                {/* --- GRID KAFELKÓW (Neon Brutalism) --- */}
                <div className="grid md:grid-cols-3 gap-0 border-l border-t border-zinc-800">

                    {/* --- KAFELEK 1: TRADYCJA (AMBER / ORANGE) --- */}
                    <div className="group relative border-r border-b border-zinc-800 bg-black/50 p-12 transition-all duration-500 hover:bg-orange-950/10">
                        {/* Kolorowa linia akcentowa */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_20px_rgba(249,115,22,0.7)]" />

                        {/* Ikona z poświatą */}
                        <div className="mb-8 relative">
                            <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <GraduationCap className="w-10 h-10 text-zinc-500 group-hover:text-orange-500 transition-colors duration-300 relative z-10" />
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-7xl font-serif font-medium text-white tracking-tighter group-hover:text-orange-100 transition-colors">
                                <CountUp end={50} duration={2500} />
                            </span>
                            <span className="text-2xl font-mono text-orange-600 font-bold group-hover:text-orange-500 transition-colors">+</span>
                        </div>

                        <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4 group-hover:text-orange-500 transition-colors">
                            Lata Tradycji
                        </h4>
                        <p className="text-zinc-400 text-sm leading-relaxed border-l border-zinc-800 pl-4 group-hover:border-orange-500/50 transition-colors">
                            Ciągłość metodyczna od 1968 roku.
                            <br/>Najstarsza szkoła w kodzie binarnym.
                        </p>
                    </div>

                    {/* --- KAFELEK 2: PRECYZJA (EMERALD / TEAL) --- */}
                    <div className="group relative border-r border-b border-zinc-800 bg-black/50 p-12 transition-all duration-500 hover:bg-emerald-950/10">
                        {/* Kolorowa linia akcentowa */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_20px_rgba(16,185,129,0.7)]" />

                        {/* Ikona z poświatą */}
                        <div className="mb-8 relative">
                            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <FlaskConical className="w-10 h-10 text-zinc-500 group-hover:text-emerald-500 transition-colors duration-300 relative z-10" />
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-7xl font-serif font-medium text-white tracking-tighter group-hover:text-emerald-100 transition-colors">
                                <CountUp end={100} duration={3000} />
                            </span>
                            <span className="text-2xl font-mono text-emerald-600 font-bold group-hover:text-emerald-500 transition-colors">%</span>
                        </div>

                        <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4 group-hover:text-emerald-500 transition-colors">
                            Personalizacji
                        </h4>
                        <p className="text-zinc-400 text-sm leading-relaxed border-l border-zinc-800 pl-4 group-hover:border-emerald-500/50 transition-colors">
                            Algorytm doboru materiałów oparty o Twój profil kognitywny.
                        </p>
                    </div>

                    {/* --- KAFELEK 3: DOSTĘPNOŚĆ (ROSE / PINK) --- */}
                    <div className="group relative border-r border-b border-zinc-800 bg-black/50 p-12 transition-all duration-500 hover:bg-rose-950/10">
                        {/* Kolorowa linia akcentowa */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_20px_rgba(244,63,94,0.7)]" />

                        {/* Ikona z poświatą */}
                        <div className="mb-8 relative">
                            <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Globe className="w-10 h-10 text-zinc-500 group-hover:text-rose-500 transition-colors duration-300 relative z-10" />
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-7xl font-serif font-medium text-white tracking-tighter group-hover:text-rose-100 transition-colors">
                                <CountUp end={360} duration={3500} />
                            </span>
                            <span className="text-2xl font-mono text-rose-600 font-bold group-hover:text-rose-500 transition-colors">deg</span>
                        </div>

                        <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4 group-hover:text-rose-500 transition-colors">
                            Dostępność
                        </h4>
                        <p className="text-zinc-400 text-sm leading-relaxed border-l border-zinc-800 pl-4 group-hover:border-rose-500/50 transition-colors">
                            Nauka bez granic geograficznych.
                            <br/>Platforma dostępna 24/7.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}