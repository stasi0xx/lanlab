import { CountUp } from "@/components/ui/CountUp";
import { GraduationCap, Target, Globe } from "lucide-react";

const STATS = [
    {
        icon: GraduationCap,
        value: 56,
        suffix: "+",
        label: "Lat doświadczenia",
        description: "Ciągłość metodyczna od 1968 roku — jedna z pierwszych szkół językowych w Europie.",
    },
    {
        icon: Target,
        value: 100,
        suffix: "%",
        label: "Indywidualne podejście",
        description: "Program dopasowany do Twojego poziomu, celu i tempa nauki.",
    },
    {
        icon: Globe,
        value: 24,
        suffix: "/7",
        label: "Dostępność online",
        description: "Rezerwuj i ucz się bez względu na to, gdzie jesteś.",
    },
];

export function StatsFeatures() {
    return (
        <section className="py-24 md:py-32 bg-brand-paper relative" id="metoda">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-brand-line pb-10">
                    <div className="max-w-xl space-y-4">
                        <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">
                            Dlaczego LANLAB
                        </span>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-ink leading-[1.05]">
                            Tradycja, która stała się metodą.
                        </h2>
                    </div>
                    <p className="text-brand-muted max-w-sm text-sm md:text-base leading-relaxed">
                        Nie sprzedajemy obietnic. Pół wieku doświadczenia przełożone na konkretny, indywidualny program nauki.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {STATS.map(({ icon: Icon, value, suffix, label, description }) => (
                        <div
                            key={label}
                            className="group relative rounded-2xl border border-brand-line bg-white p-8 transition-all duration-300 hover:border-brand-primary/40 hover:shadow-lg"
                        >
                            <div className="w-11 h-11 rounded-xl bg-brand-surface flex items-center justify-center mb-8 group-hover:bg-brand-primary/10 transition-colors">
                                <Icon className="w-5 h-5 text-brand-primary" />
                            </div>

                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="font-display text-5xl font-bold text-brand-ink tracking-tight">
                                    <CountUp end={value} duration={2000} />
                                </span>
                                <span className="text-xl font-bold text-brand-primary">{suffix}</span>
                            </div>

                            <h4 className="font-semibold text-brand-ink mb-2">{label}</h4>
                            <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
