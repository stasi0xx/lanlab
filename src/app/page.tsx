import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/features/Hero";
import { BookingSection } from "@/components/features/BookingSection";
import { StatsFeatures } from "@/components/features/StatsFeatures";
import { TestimonialsSection } from "@/components/features/TestimonialSection";
import { AboutSection } from "@/components/features/AboutSection";
import { KubaChat } from "@/components/features/KubaChat";
import { getKubaKnowledgeForChat } from "@/app/actions/kuba-actions";

export default async function Home() {
    const { knowledge, faqs } = await getKubaKnowledgeForChat();

    return (
        <main className="min-h-screen relative">
            <Navbar />
            <Hero />
            <StatsFeatures />
            <AboutSection />
            <BookingSection />
            <TestimonialsSection />
            <KubaChat knowledge={knowledge} faqs={faqs} />
        </main>
    );
}
