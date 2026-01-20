import Link from "next/link";
import { MapPin, FileText, Briefcase, Calendar } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 font-sans text-sm">
            <div className="container mx-auto px-6 py-16">

                {/* GÓRNA CZĘŚĆ - GRID 4 KOLUMNY */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* 1. BRAND & MISJA */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                            LanLab<span className="text-brand-primary">.</span>
                        </h3>
                        <p className="leading-relaxed text-slate-500">
                            Pionierskie metody nauczania języków przeniesione do świata cyfrowego.
                            Łączymy tradycję z nowoczesnością od 1968 roku.
                        </p>
                    </div>

                    {/* 2. DANE KONTAKTOWE */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-brand-primary" /> Adres Korespondencyjny
                        </h4>
                        <address className="not-italic space-y-2 leading-relaxed">
                            <p>ul. Gdyńska G lok. 9</p>
                            <p>80-340 Gdańsk</p>
                            <p className="mt-4 text-xs uppercase tracking-wider text-slate-600 font-bold">Polska</p>
                        </address>
                    </div>

                    {/* 3. DANE REJESTROWE */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand-primary" /> Dane Rejestrowe
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-600 uppercase font-bold">Nazwa Pełna</p>
                                <p className="text-slate-300">WeUnite Jan Hofman</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 uppercase font-bold">NIP</p>
                                <p className="font-mono text-slate-300">5842877195</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 uppercase font-bold">REGON</p>
                                <p className="font-mono text-slate-300">543312986</p>
                            </div>
                        </div>
                    </div>

                    {/* 4. PROFIL DZIAŁALNOŚCI */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-brand-primary" /> Informacje Prawne
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-600 uppercase font-bold">Forma Prawna</p>
                                <p>Indywidualna działalność gospodarcza</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 uppercase font-bold flex items-center gap-1">
                                    Data Rozpoczęcia
                                </p>
                                <p>17.11.2025</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 uppercase font-bold">PKD</p>
                                <p className="text-xs leading-relaxed">
                                    73.11.Z Działalność agencji reklamowych<br/>
                                    <span className="opacity-50">Działalność profesjonalna, naukowa i techniczna</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* DOLNA CZĘŚĆ - COPYRIGHT */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
                    <p>
                        &copy; {currentYear} Stanisław Korycki. Wszelkie prawa zastrzeżone.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/regulamin" className="hover:text-white transition-colors">Regulamin</Link>
                        <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka Prywatności</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}