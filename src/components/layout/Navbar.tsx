import Link from "next/link";

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-xl">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-white font-serif font-bold text-xl transition-transform group-hover:scale-105">
                        L
                    </div>
                    <div className="flex flex-col">
            <span className="font-serif text-lg font-bold leading-none tracking-tight text-brand-primary">
              LANLAB
            </span>
                        <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
              Since 1968
            </span>
                    </div>
                </Link>

                {/* MENU (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    {["Metoda", "Historia", "Opinie"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-sm font-medium text-text-muted transition-colors hover:text-brand-primary"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link
                        href="#booking"
                        className="hidden sm:inline-flex rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-accent hover:scale-105 active:scale-95"
                    >
                        UMÓW SIĘ
                    </Link>
                </div>
            </div>
        </header>
    );
}