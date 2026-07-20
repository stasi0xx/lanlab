import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

const reviews = [
    {
        name: "Anna Kowalska",
        role: "UX Designer",
        body: "Niesamowite podejście! Po 3 miesiącach w końcu przełamałam barierę językową. Program dopasowany dokładnie do mnie.",
        rating: 5,
    },
    {
        name: "Piotr Nowak",
        role: "Senior Developer",
        body: "Lekcje online to dla mnie strzał w dziesiątkę. Oszczędzam czas, a poziom nauczania jest wyższy niż stacjonarnie.",
        rating: 5,
    },
    {
        name: "Marta Wiśniewska",
        role: "Architektka",
        body: "Przygotowanie do egzaminu FCE na najwyższym poziomie. Zdałam z wynikiem A. Dziękuję za profesjonalizm.",
        rating: 5,
    },
    {
        name: "Tomasz Zieliński",
        role: "CEO, TechCorp",
        body: "Angielski biznesowy pomógł mi zdobyć kontrakt z zagranicznym klientem. Konkret, zero lania wody.",
        rating: 4,
    },
    {
        name: "Karolina Szymańska",
        role: "Rodzic",
        body: "Syn uwielbia te zajęcia. Lektorzy mają świetne podejście, mimo że lekcje są w 100% online.",
        rating: 5,
    },
    {
        name: "Jakub Lewandowski",
        role: "Freelancer",
        body: "Platforma działa bez zarzutu, a materiały są nowoczesne. Widać, że szkoła rozumie współczesne potrzeby.",
        rating: 5,
    },
];

function initials(name: string) {
    return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

const ReviewCard = ({ name, role, body, rating }: (typeof reviews)[number]) => {
    return (
        <figure
            className={cn(
                "relative w-[340px] shrink-0 cursor-default overflow-hidden rounded-2xl border mx-3 transition-all duration-300",
                "bg-white border-brand-line p-6 hover:border-brand-primary/40 hover:shadow-md"
            )}
        >
            <div className="flex flex-row items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-display font-bold text-sm">
                    {initials(name)}
                </div>

                <div className="flex flex-col">
                    <figcaption className="text-sm font-bold text-brand-ink">{name}</figcaption>
                    <span className="text-xs text-brand-muted">{role}</span>
                </div>

                <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-brand-primary text-brand-primary" />
                    ))}
                </div>
            </div>

            <blockquote className="relative">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-brand-line -z-10 -scale-x-100" />
                <p className="text-sm text-brand-ink/80 leading-relaxed">"{body}"</p>
            </blockquote>
        </figure>
    );
};

const Marquee = ({
    className,
    reverse,
    children,
}: {
    className?: string;
    reverse?: boolean;
    children?: React.ReactNode;
}) => {
    return (
        <div className={cn("group flex overflow-hidden [--duration:50s]", className)}>
            {Array(2).fill(0).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex shrink-0 flex-row animate-marquee",
                        reverse && "[animation-direction:reverse]"
                    )}
                >
                    {children}
                </div>
            ))}
        </div>
    );
};

export function TestimonialsSection() {
    const firstRow = reviews.slice(0, reviews.length / 2);
    const secondRow = reviews.slice(reviews.length / 2);

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-brand-line" id="opinie">
            <div className="container mx-auto px-6 mb-14 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-brand-line pb-10">
                    <div className="max-w-2xl">
                        <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Opinie</span>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-ink leading-[1.05] mt-4">
                            Zaufali nam.
                        </h2>
                    </div>
                    <p className="text-brand-muted text-sm md:text-base">
                        4.9 / 5.0 średniej oceny &middot; ponad 1200 opinii
                    </p>
                </div>
            </div>

            <div className="relative flex flex-col gap-6 overflow-hidden">
                <Marquee>
                    {firstRow.map((review) => <ReviewCard key={review.name} {...review} />)}
                </Marquee>
                <Marquee reverse>
                    {secondRow.map((review) => <ReviewCard key={review.name} {...review} />)}
                </Marquee>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent z-10" />
            </div>
        </section>
    );
}
