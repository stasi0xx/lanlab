// src/components/layout/Footer.tsx
import Link from "next/link";
import { MapPin, FileText, Briefcase, Terminal, ArrowUpRight } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-zinc-500 border-t border-zinc-900 font-sans text-sm relative overflow-hidden">

            {/* Dekoracyjna siatka w tle (subtelna) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="container mx-auto px-6 py-20 relative z-10">

                {/* GÓRNA CZĘŚĆ - GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

                    {/* 1. BRAND & MANIFEST */}
                    <div className="space-y-6">
                        <Link href="/" className="block group">
                            <h3 className="text-3xl font-serif font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors">
                                WeTalk<span className="text-purple-500">.</span>
                            </h3>
                        </Link>
                        <p className="leading-relaxed text-zinc-400 text-sm max-w-xs border-l border-zinc-800 pl-4">
                            Cyfrowa ewolucja metodyki nauczania.
                            <br/>Tradycja od 1968. <br/>Technologia od dzisiaj.
                        </p>
                    </div>

                    {/* 2. ADRES (Terminal Style) */}
                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> HQ_COORDINATES
                        </h4>
                        <address className="not-italic space-y-1">
                            <p className="text-zinc-300 font-medium">ul. Gdyńska G lok. 9</p>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <span>80-340 Gdańsk</span>
                                <span className="text-[10px] font-mono uppercase bg-zinc-900 px-1 border border-zinc-800 text-zinc-500">PL</span>
                            </div>
                        </address>
                    </div>

                    {/* 3. DANE REJESTROWE (Legal Entity) */}
                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> LEGAL_ENTITY
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-zinc-600 uppercase mb-1">Podmiot</p>
                                <p className="text-zinc-300 font-medium">WeUnite Jan Hofman</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-zinc-600 uppercase mb-1">NIP</p>
                                    <p className="font-mono text-zinc-400 text-xs">5842877195</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-600 uppercase mb-1">REGON</p>
                                    <p className="font-mono text-zinc-400 text-xs">543312986</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. PROFIL (System Info) */}
                    <div>
                        <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> OPERATION_MODE
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-zinc-600 uppercase mb-1">Forma Prawna</p>
                                <p className="text-zinc-400 text-xs">JDG (Active Status)</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-600 uppercase mb-1">Inicjalizacja</p>
                                <p className="font-mono text-zinc-400 text-xs">17.11.2025</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-600 uppercase mb-1">PKD 73.11.Z</p>
                                <p className="text-xs text-zinc-500 truncate" title="Działalność agencji reklamowych">
                                    Działalność agencji reklamowych...
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* DOLNA CZĘŚĆ - COPYRIGHT & LINKS */}
                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Copyright */}
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                        <Terminal className="w-3 h-3" />
                        <p>
                            &copy; {currentYear} WeUnite Jan Hofman. System Operational.
                        </p>
                    </div>

                    {/* Linki Prawne */}
                    <div className="flex gap-8 text-xs font-bold uppercase tracking-wider">
                        <Link href="/regulamin" className="hover:text-white transition-colors flex items-center gap-1 group">
                            Regulamin
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                        </Link>
                        <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors flex items-center gap-1 group">
                            Prywatność
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}