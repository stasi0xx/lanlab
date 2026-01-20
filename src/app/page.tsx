import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/features/Hero";

export default function Home() {
    return (
        <main className="min-h-screen relative">
            <Navbar />
            <Hero />

            {/* Placeholder na sekcję Booking (zrobimy w nastepnym kroku) */}
            <section id="booking" className="py-24 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-serif mb-4">Rezerwacja Online</h2>
                    <p className="text-text-muted">Tutaj załadujemy kalendarz z bazy danych...</p>
                </div>
            </section>
        </main>
    );
}