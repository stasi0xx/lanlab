// src/components/layout/Footer.tsx
import Link from "next/link";
import { MapPin, FileText, Briefcase, ArrowUpRight } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white text-brand-muted border-t border-brand-line font-sans text-sm relative">
            <div className="container mx-auto px-6 py-20 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* 1. BRAND */}
                    <div className="space-y-5">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white font-display font-bold text-sm">L</span>
                            <span className="font-display font-bold text-lg text-brand-ink">
                                LANLAB<span className="text-brand-primary"> ONLINE</span>
                            </span>
                        </Link>
                        <p className="leading-relaxed text-brand-muted text-sm max-w-xs">
                            Z pasją do nauczania od 1968 roku.<br />
                            Tradycja szkoły językowej Language Laboratories, w nowoczesnym, cyfrowym wydaniu.
                        </p>
                    </div>

                    {/* 2. ADRES */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-brand-ink font-bold mb-5 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-brand-primary" /> Adres
                        </h4>
                        <address className="not-italic space-y-1">
                            <p className="text-brand-ink font-medium">ul. Gdyńska G lok. 9</p>
                            <p className="text-brand-muted">80-340 Gdańsk, Polska</p>
                        </address>
                    </div>

                    {/* 3. DANE REJESTROWE */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-brand-ink font-bold mb-5 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-brand-primary" /> Dane rejestrowe
                        </h4>
                        <div className="space-y-3">
                            <p className="text-brand-ink font-medium">WeUnite Jan Hofman</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-brand-muted uppercase mb-0.5">NIP</p>
                                    <p className="text-brand-ink text-xs">5842877195</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-brand-muted uppercase mb-0.5">REGON</p>
                                    <p className="text-brand-ink text-xs">543312986</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. PROFIL */}
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-brand-ink font-bold mb-5 flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-brand-primary" /> Działalność
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-brand-muted uppercase mb-0.5">Forma prawna</p>
                                <p className="text-brand-ink text-xs">JDG</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-brand-muted uppercase mb-0.5">PKD</p>
                                <p className="text-brand-ink text-xs">73.11.Z — Działalność agencji reklamowych</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-brand-line flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-brand-muted">&copy; {currentYear} LANLAB ONLINE — WeUnite Jan Hofman. Wszystkie prawa zastrzeżone.</p>

                    <div className="flex gap-8 text-xs font-bold uppercase tracking-wider">
                        <Link href="/regulamin" className="hover:text-brand-primary transition-colors flex items-center gap-1 group text-brand-ink">
                            Regulamin
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="/polityka-prywatnosci" className="hover:text-brand-primary transition-colors flex items-center gap-1 group text-brand-ink">
                            Prywatność
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
