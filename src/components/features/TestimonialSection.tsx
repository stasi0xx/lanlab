// src/components/features/TestimonialSection.tsx
import { cn } from "@/lib/utils";
import { Star, MessageSquare, Terminal, Quote } from "lucide-react";

// 1. DANE - (Treść ta sama, ale kontekst wizualny inny)
const reviews = [
    {
        name: "Anna Kowalska",
        role: "UX Designer", // Zamiast username, dajemy rolę/kontekst
        body: "Niesamowite podejście! Po 3 miesiącach w końcu przełamałam barierę językową. Metody WeTalk to czysty konkret.",
        img: "https://avatar.vercel.sh/anna",
        rating: 5,
    },
    {
        name: "Piotr Nowak",
        role: "Senior Dev",
        body: "Lekcje online to dla mnie strzał w dziesiątkę. Oszczędzam czas, a poziom nauczania jest wyższy niż stacjonarnie.",
        img: "https://avatar.vercel.sh/piotr",
        rating: 5,
    },
    {
        name: "Marta Wiśniewska",
        role: "Architekt",
        body: "Przygotowanie do egzaminu FCE na najwyższym poziomie. Zdałam z wynikiem A! Dziękuję za profesjonalizm.",
        img: "https://avatar.vercel.sh/marta",
        rating: 5,
    },
    {
        name: "Tomasz Zieliński",
        role: "CEO, TechCorp",
        body: "Angielski biznesowy w WeTalk pomógł mi zdobyć kontrakt z zagranicznym klientem. Zero lania wody.",
        img: "https://avatar.vercel.sh/tomek",
        rating: 4,
    },
    {
        name: "Karolina Szymańska",
        role: "Rodzic",
        body: "Syn uwielbia te zajęcia. Lektorzy mają świetne podejście do młodzieży cyfrowej ery.",
        img: "https://avatar.vercel.sh/karo",
        rating: 5,
    },
    {
        name: "Jakub Lewandowski",
        role: "Freelancer",
        body: "Platforma działa bez zarzutu, a materiały są nowoczesne. Widać, że szkoła rozumie współczesne potrzeby.",
        img: "https://avatar.vercel.sh/kuba",
        rating: 5,
    },
];

// 2. KARTA OPINII (Industrial Style)
const ReviewCard = ({
                        img,
                        name,
                        role,
                        body,
                        rating,
                    }: {
    img: string;
    name: string;
    role: string;
    body: string;
    rating: number;
}) => {
    return (
        <figure
            className={cn(
                "relative w-[350px] cursor-default overflow-hidden border mx-4 group transition-all duration-300",
                // Styl podstawowy
                "bg-zinc-900/30 border-zinc-800 p-6",
                // Styl Hover
                "hover:bg-zinc-900 hover:border-zinc-700"
            )}
        >
            {/* Dekorator narożny */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-zinc-700 group-hover:border-purple-500 transition-colors" />

            {/* Header Karty */}
            <div className="flex flex-row items-center gap-4 mb-4">
                {/* Avatar w stylu "Hex" lub kwadrat */}
                <div className="relative">
                    <img className="w-10 h-10 border border-zinc-700 grayscale group-hover:grayscale-0 transition-all" src={img} alt={name} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black" />
                </div>

                <div className="flex flex-col">
                    <figcaption className="text-sm font-bold text-white font-serif tracking-wide">
                        {name}
                    </figcaption>
                    <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                        {role}
                    </span>
                </div>

                {/* Ocena jako dane techniczne */}
                <div className="ml-auto flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-purple-500 text-purple-500" />
                        ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600 mt-1">VERIFIED_USER</span>
                </div>
            </div>

            {/* Treść Opinii */}
            <blockquote className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-zinc-800 -z-10 transform -scale-x-100" />
                <p className="text-sm text-zinc-400 leading-relaxed italic group-hover:text-zinc-300 transition-colors">
                    "{body}"
                </p>
            </blockquote>

            {/* Stopka Karty - Linia postępu */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-zinc-800">
                <div className="h-full bg-purple-500 w-[0%] group-hover:w-full transition-all duration-700 ease-out" />
            </div>
        </figure>
    );
};

// 3. MARQUEE (Bez zmian w logice, tylko TypeScript fixy jeśli potrzebne)
const Marquee = ({
                     className,
                     reverse,
                     pauseOnHover = false,
                     children,
                     vertical = false,
                     repeat = 4,
                     ...props
                 }: {
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    vertical?: boolean;
    repeat?: number;
    [key: string]: any;
}) => {
    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                },
                className,
            )}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                            "animate-marquee flex-row": !vertical,
                            "animate-marquee-vertical flex-col": vertical,
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                            "[animation-direction:reverse]": reverse,
                        })}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
};

// 4. GŁÓWNA SEKCJA
export function TestimonialsSection() {
    const firstRow = reviews.slice(0, reviews.length / 2);
    const secondRow = reviews.slice(reviews.length / 2);

    return (
        <section className="py-24 bg-black relative overflow-hidden border-t border-zinc-900" id="opinie">

            {/* Tło - Subtelna siatka */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="container mx-auto px-6 mb-16 relative z-10">

                {/* NAGŁÓWEK - LEWA STRONA (Dla odmiany od środka) */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-zinc-800 pb-8 mb-12">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                            <Terminal className="w-4 h-4" />
                            <span>User Feedback Logs</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif text-white leading-[0.9]">
                            Zaufali nam. <br/>
                            <span className="text-zinc-500">Wyniki mówią same za siebie.</span>
                        </h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                            Total Reviews: 1240+<br/>
                            Average Rating: 4.9/5.0
                        </p>
                    </div>
                </div>

            </div>

            <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden">

                {/* Rząd 1 - W lewo */}
                <Marquee pauseOnHover className="[--duration:50s]">
                    {firstRow.map((review) => (
                        <ReviewCard key={review.name} {...review} />
                    ))}
                </Marquee>

                {/* Rząd 2 - W prawo (reverse) */}
                <Marquee reverse pauseOnHover className="[--duration:50s]">
                    {secondRow.map((review) => (
                        <ReviewCard key={review.name} {...review} />
                    ))}
                </Marquee>

                {/* Maski gradientowe po bokach - ZMIANA NA CZARNY */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent z-10"></div>
            </div>
        </section>
    );
}