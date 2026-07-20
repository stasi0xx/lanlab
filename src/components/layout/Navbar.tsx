"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "#historia", label: "O nas" },
    { href: "#metoda", label: "Metoda" },
    { href: "#booking", label: "Cennik" },
    { href: "#opinie", label: "Opinie" },
];

function Wordmark({ className }: { className?: string }) {
    return (
        <span className={cn("flex items-center", className)}>
            <Image src="/logo-mark.png" alt="LanLab Online" width={189} height={100} className="h-12 w-auto object-contain" priority />
        </span>
    );
}

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-brand-paper/90 backdrop-blur-md border-brand-line py-3 shadow-sm"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="group">
                    <Wordmark className="transition-opacity group-hover:opacity-80" />
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-ink">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-brand-primary transition-colors">
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="#booking"
                        className="px-5 py-2.5 bg-brand-primary text-white rounded-full hover:bg-brand-primary-dark active:scale-95 transition-all font-bold shadow-sm"
                    >
                        Umów się
                    </Link>
                </div>

                <button
                    className="md:hidden p-2 text-brand-ink"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-brand-paper border-b border-brand-line p-6 flex flex-col gap-4 md:hidden shadow-xl">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-brand-ink font-medium">
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="#booking"
                            onClick={() => setIsOpen(false)}
                            className="text-center py-3 bg-brand-primary text-white rounded-full font-bold"
                        >
                            Umów się
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
