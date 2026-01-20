import { CountUp } from "@/components/ui/CountUp";
import { GraduationCap, FlaskConical, Laptop2, Sparkles } from "lucide-react";

export function StatsFeatures() {
    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden" id={'metoda'}>

            {/* Tło dekoracyjne sekcji */}
            <div className="absolute inset-0 bg-pattern-dots opacity-5 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                {/* --- TYTUŁ SEKCJ --- */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm">
                        <Sparkles className="w-3 h-3 text-brand-primary" />
                        Dlaczego LanLab?
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                        Liczby, które budują <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600">
                    Twoje zaufanie.
                </span>
                    </h2>
                    <p className="text-lg text-slate-500">
                        Łączymy twarde dane z miękkimi kompetencjami. Zobacz, co stoi za naszą skutecznością.
                    </p>
                </div>

                {/* --- GRID KOLOROWYCH KAFELKÓW --- */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">

                    {/* --- KAFELEK 1: DOŚWIADCZENIE (Amber Gradient) --- */}
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-10 rounded-[2.5rem] shadow-2xl shadow-orange-500/30 text-white flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 animate-fade-in-up delay-100 relative overflow-hidden">

                        {/* Ozdoba w tle */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-8 h-8" />
                        </div>

                        <h3 className="text-amber-100 font-bold uppercase tracking-widest text-xs mb-4">Tradycja</h3>

                        <div className="flex items-baseline justify-center gap-1 mb-4">
                <span className="text-7xl font-serif font-bold text-white">
                  <CountUp end={50} duration={2500} />
                </span>
                            <span className="text-4xl font-serif text-amber-200 font-bold">+</span>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2">Lat Doświadczenia</h4>
                        <p className="text-amber-50 leading-relaxed opacity-90">
                            Nieprzerwanie od 1968 roku uczymy gdańszczan języków obcych.
                        </p>
                    </div>

                    {/* --- KAFELEK 2: METODY (Teal Gradient) --- */}
                    <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-10 rounded-[2.5rem] shadow-2xl shadow-teal-500/30 text-white flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 animate-fade-in-up delay-200 relative overflow-hidden">

                        {/* Ozdoba w tle */}
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none -ml-10 -mb-10" />

                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <FlaskConical className="w-8 h-8" />
                        </div>

                        <h3 className="text-teal-100 font-bold uppercase tracking-widest text-xs mb-4">Podejście</h3>

                        <div className="flex items-baseline justify-center gap-1 mb-4">
                <span className="text-7xl font-serif font-bold text-white">
                  <CountUp end={100} duration={3000} />
                </span>
                            <span className="text-4xl font-serif text-teal-200 font-bold">%</span>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2">Indywidualizacji</h4>
                        <p className="text-teal-50 leading-relaxed opacity-90">
                            Laboratoryjna precyzja doboru metod. Program szyty idealnie na miarę.
                        </p>
                    </div>

                    {/* --- KAFELEK 3: TECHNOLOGIA (Rose Gradient) --- */}
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-10 rounded-[2.5rem] shadow-2xl shadow-rose-500/30 text-white flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 animate-fade-in-up delay-300 relative overflow-hidden">

                        {/* Ozdoba w tle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-black/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            <Laptop2 className="w-8 h-8" />
                        </div>

                        <h3 className="text-rose-100 font-bold uppercase tracking-widest text-xs mb-4">Dostępność</h3>

                        <div className="flex items-baseline justify-center gap-1 mb-4">
                <span className="text-7xl font-serif font-bold text-white">
                  <CountUp end={360} duration={3500} />
                </span>
                            <span className="text-4xl font-serif text-rose-200 font-bold">°</span>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2">Wsparcia Online</h4>
                        <p className="text-rose-50 leading-relaxed opacity-90">
                            Nowoczesna platforma i materiały dostępne z każdego miejsca na ziemi.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}