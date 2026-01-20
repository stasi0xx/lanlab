import Image from "next/image";

export function HistorySection() {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="historia">

            {/* Tło dekoracyjne */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEWA: TREŚĆ */}
                    <div className="space-y-8 animate-fade-in-up">
                        <div>
              <span className="text-brand-primary font-bold tracking-widest uppercase text-xs border border-brand-primary/30 px-3 py-1 rounded-full bg-brand-primary/10">
                O Nas
              </span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-6 leading-tight">
                                Language Laboratories <br />
                                <span className="text-slate-400 italic">od 1968 roku.</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                            <p>
                                To jedna z wcześniej działających szkół językowych w Europie, która powstała w Gdańsku. Jej nazwa i działalność nawiązywała do nowoczesnych na tamte czasy metod nauczania języków obcych.
                            </p>
                            <p>
                                Wprowadziliśmy elementy indywidualizacji programów i podejście dydaktyczne, które w polskim kontekście szkolnictwa językowego uznano za <strong>pionierskie</strong>.
                            </p>
                            <div className="border-l-2 border-brand-primary pl-6 py-2 my-6">
                                <p className="text-white font-serif text-xl italic">
                                    "LANLAB ONLINE to nowa odsłona marki. To suma 50 lat doświadczeń przeniesiona w erę cyfrową."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PRAWA: ZDJĘCIE (Z efektem wtopienia) */}
                    <div className="relative group animate-fade-in-up delay-200">
                        <div className="absolute inset-0 bg-brand-primary rounded-2xl rotate-3 group-hover:rotate-1 transition-transform duration-500 opacity-20" />
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src="/images/about-1968.jpg"
                                alt="Historyczne zdjęcie LanLab"
                                fill
                                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                            />

                            {/* Overlay gradientowy, żeby tekst był czytelny jeśli nałożymy */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-xs font-mono text-brand-primary mb-1">ARCHIWUM</p>
                                <p className="text-white font-bold">Pierwsze laboratorium językowe</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}