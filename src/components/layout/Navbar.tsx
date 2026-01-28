"use client";

import Link from "next/link";
import Image from "next/image"; // <--- WAŻNY IMPORT
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

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
                    ? "bg-black/80 backdrop-blur-md border-slate-200 py-3"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">

                {/* --- LOGO (PEŁNE) --- */}
                <Link href="/" className="flex items-center group">

                    {/* Zmieniamy wymiary kontenera.
             Wcześniej było w-10 (kwadrat), teraz dajemy w-40 lub w-48 (prostokąt),
             aby zmieścił się cały napis.
          */}
                    <div className="relative h-12 w-48 md:h-16 md:w-64 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/wetalk.webp" // Upewnij się, że nazwa pliku w public się zgadza!
                            alt="LanLab Online Logo"
                            fill
                            className="object-contain object-left" // object-left: wyrównuje logo do lewej
                            priority
                        />
                    </div>

                    {/* USUNĄŁEM CAŁY DIV Z TEKSTEM, KTÓRY BYŁ TUTAJ WCZEŚNIEJ */}

                </Link>

                {/* --- MENU DESKTOP --- */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="#historia" className="hover:text-brand-primary transition-colors">O nas</Link>
                    <Link href="#booking" className="hover:text-brand-primary transition-colors">Oferta</Link>
                    <Link href="#booking" className="px-5 py-2.5 bg-brand-primary text-black rounded-full hover:bg-brand-accent hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/25 font-bold">
                        Umów wizytę
                    </Link>
                </div>

                {/* --- MENU MOBILE (HAMBURGER) --- */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Dropdown (opcjonalne, jeśli masz) */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-black border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl">
                        <Link href="#historia" onClick={() => setIsOpen(false)}>O nas</Link>
                        <Link href="#booking" onClick={() => setIsOpen(false)}>Oferta</Link>
                        <Link href="#booking" onClick={() => setIsOpen(false)} className="text-brand-primary font-bold">Umów wizytę</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}