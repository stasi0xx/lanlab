// src/components/features/AboutSection.tsx
import Image from "next/image";
import { ArrowRight, Cpu, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutSection() {
    return (
        <section id="historia" className="py-24 bg-black relative overflow-hidden border-t border-zinc-900">

            {/* Dekoracyjny Glow */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto px-6 max-w-7xl">

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* --- KOLUMNA LEWA --- */}
                    <div className="flex flex-col gap-8 mt-8 lg:mt-0 relative z-10 group">

                        {/* 1. BLOK ZDJĘCIA */}
                        <div className="relative w-full">
                            {/* Rama Glitch (Pod spodem - dostosowana do 16:9) */}
                            <div className="absolute -top-3 -left-3 w-full h-full border border-zinc-800 bg-zinc-900/50 -z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2" />

                            {/* ZMIANA: aspect-video (16:9 Horyzontalnie) */}
                            <div className="relative aspect-video w-full overflow-hidden border border-zinc-700 bg-black z-10">

                                <div className="absolute inset-0 bg-zinc-900" />

                                {/* ZMIANA: Ścieżka do pliku about.jpg */}
                                <Image
                                    src="/images/about.jpg"
                                    alt="Archiwum WeTalk"
                                    fill
                                    className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                />

                                {/* Scanlines Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

                                {/* Badge "System Origin" - Mniejszy padding dla formatu poziomego */}
                                <div className="absolute bottom-0 right-0 bg-black border-t border-l border-zinc-700 p-3 md:p-5 z-30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 bg-purple-500 animate-pulse" />
                                        <p className="text-[10px] uppercase tracking-widest text-purple-400 font-mono">
                                            SYSTEM_ORIGIN
                                        </p>
                                    </div>
                                    <p className="text-2xl md:text-4xl font-serif font-bold text-white leading-none">1968</p>
                                </div>
                            </div>

                            {/* Dekoratory narożne */}
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-purple-500 z-40 pointer-events-none" />
                            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-zinc-800 z-0 pointer-events-none opacity-50" />
                        </div>

                        {/* 2. BLOK CYTATU */}
                        <div className="relative border-t border-zinc-800/50 pt-5">
                            <div className="absolute left-0 top-5 h-full w-[2px] bg-gradient-to-b from-purple-500 to-transparent opacity-50"></div>

                            <div className="flex items-center gap-2 font-mono text-xs text-purple-400 mb-3 opacity-70 pl-4">
                                <Terminal className="w-3 h-3" />
                                <span>user@wetalk:~/mission_statement.txt</span>
                            </div>

                            <p className="font-serif italic text-white text-xl md:text-2xl leading-tight pl-6">
                                "Nie uczymy słówek. Wgrywamy nowy system operacyjny do Twojej komunikacji."
                            </p>
                        </div>

                    </div>

                    {/* --- KOLUMNA PRAWA --- */}
                    <div className="space-y-10 relative z-20 lg:pl-8">

                        {/* Blok 1: Nagłówek */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-800 bg-white/5 text-purple-300 text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
                                <Cpu className="w-3.5 h-3.5" />
                                <span>Legacy Code / New Interface</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[0.9]">
                                Metoda laboratoryjna. <br/>
                                <span className="text-zinc-500 italic">Zaktualizowana.</span>
                            </h2>
                        </div>

                        {/* Blok 2: Tekst główny */}
                        <div className="space-y-6 text-lg text-zinc-400 leading-relaxed border-l border-zinc-800 pl-8">
                            <p>
                                <strong className="text-white font-serif tracking-wide">WeTalk (ex-LanLab)</strong> to nie startup. To instytucja.
                                Powstaliśmy w 1968 roku w Gdańsku jako jedno z pierwszych laboratoriów językowych w Europie.
                            </p>
                            <p>
                                Przez 50 lat technologia zmieniła się diametralnie. Ludzki mózg? Ani trochę.
                                Dlatego <strong className="text-white">przenieśliśmy naszą analogową skuteczność do chmury.</strong>
                                To ta sama szkoła, te same standardy, ale bez kredy na rękach.
                            </p>
                        </div>

                        {/* Blok 3: Lista */}
                        <div className="space-y-2 pt-2 border-t border-zinc-800/30">
                            <FeatureItem text="5 dekad iteracji metodycznej (Stable Release)" />
                            <FeatureItem text="Algorytmiczna precyzja doboru materiału" />
                            <FeatureItem text="Platforma online z duszą tradycyjnej akademii" />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// Komponent pomocniczy
function FeatureItem({ text }: { text: string }) {
    return (
        <div className="group flex items-center gap-4 p-3 rounded-sm hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-zinc-800/50">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-zinc-700 bg-black group-hover:border-purple-500 group-hover:bg-purple-500/10 transition-colors">
                <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <span className="text-zinc-300 font-medium font-sans text-sm tracking-wide group-hover:text-white transition-colors">
                {text}
            </span>
        </div>
    );
}