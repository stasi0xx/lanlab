import { cn } from "@/lib/utils";
import { Star, MessageCircle } from "lucide-react";

// 1. DANE - PRZYKŁADOWE OPINIE
const reviews = [
    {
        name: "Anna Kowalska",
        username: "@anna_k",
        body: "Niesamowite podejście! Po 3 miesiącach w końcu przełamałam barierę językową. Metody LanLab naprawdę działają.",
        img: "https://avatar.vercel.sh/anna",
        rating: 5,
    },
    {
        name: "Piotr Nowak",
        username: "@piotr_dev",
        body: "Lekcje online to dla mnie strzał w dziesiątkę. Oszczędzam czas na dojazdy, a poziom nauczania jest wyższy niż stacjonarnie.",
        img: "https://avatar.vercel.sh/piotr",
        rating: 5,
    },
    {
        name: "Marta Wiśniewska",
        username: "@marta_w",
        body: "Przygotowanie do egzaminu FCE na najwyższym poziomie. Zdałam z wynikiem A! Dziękuję Panie Janie.",
        img: "https://avatar.vercel.sh/marta",
        rating: 5,
    },
    {
        name: "Tomasz Zieliński",
        username: "@tomek_biznes",
        body: "Angielski biznesowy w LanLab pomógł mi zdobyć kontrakt z zagranicznym klientem. Profesjonalizm w każdym calu.",
        img: "https://avatar.vercel.sh/tomek",
        rating: 4,
    },
    {
        name: "Karolina Szymańska",
        username: "@karo_s",
        body: "Syn uwielbia te zajęcia. Lektorzy mają świetne podejście do młodzieży. Polecam każdemu rodzicowi.",
        img: "https://avatar.vercel.sh/karo",
        rating: 5,
    },
    {
        name: "Jakub Lewandowski",
        username: "@kubal",
        body: "Platforma działa bez zarzutu, a materiały są bardzo nowoczesne. Widać, że szkoła idzie z duchem czasu.",
        img: "https://avatar.vercel.sh/kuba",
        rating: 5,
    },
];

// 2. KARTA OPINII
const ReviewCard = ({
                        img,
                        name,
                        username,
                        body,
                        rating,
                    }: {
    img: string;
    name: string;
    username: string;
    body: string;
    rating: number;
}) => {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-2xl border p-6 mx-4", // mx-4 daje odstęp między kartami
                "border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <img className="rounded-full w-10 h-10 border border-slate-100" width="40" height="40" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-bold text-slate-900">
                        {name}
                    </figcaption>
                    <div className="flex items-center gap-1">
                        {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="mt-4 text-sm text-slate-600 leading-relaxed italic">"{body}"</blockquote>
        </figure>
    );
};

// 3. KOMPONENT MARQUEE (Logika Animacji)
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

// 4. GŁÓWNA SEKCJA (Eksportowana)
export function TestimonialsSection() {
    const firstRow = reviews.slice(0, reviews.length / 2);
    const secondRow = reviews.slice(reviews.length / 2);

    return (
        <section className="py-24 bg-white relative overflow-hidden" id={'opinie'}>

            <div className="container mx-auto px-6 mb-16 text-center max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm mb-6 animate-fade-in-up">
                    <MessageCircle className="w-3 h-3 text-brand-primary" />
                    Social Proof
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 animate-fade-in-up delay-100">
                    Zaufali nam uczniowie z <br/> <span className="text-brand-primary">całego Trójmiasta.</span>
                </h2>
                <p className="text-lg text-slate-500 animate-fade-in-up delay-200">
                    Zobacz opinie osób, które już zmieniły swoje podejście do nauki języków z LanLab.
                </p>
            </div>

            <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden">

                {/* Rząd 1 - W lewo */}
                <Marquee pauseOnHover className="[--duration:40s]">
                    {firstRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>

                {/* Rząd 2 - W prawo (reverse) */}
                <Marquee reverse pauseOnHover className="[--duration:40s]">
                    {secondRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>

                {/* Maski gradientowe po bokach (Fade effect) */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
            </div>
        </section>
    );
}