import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/features/Hero";
import {BookingSection} from "@/components/features/BookingSection";
import {StatsFeatures} from "@/components/features/StatsFeatures";
import {HistorySection} from "@/components/features/HistorySection";
import {TestimonialsSection} from "@/components/features/TestimonialSection";

export default function Home() {
    return (
        <main className="min-h-screen relative">
            <Navbar />
            <Hero />
            <StatsFeatures />
            <HistorySection />
            <BookingSection />
            <TestimonialsSection />
        </main>
    );
}