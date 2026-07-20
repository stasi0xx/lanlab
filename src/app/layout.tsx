// src/app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import {Footer} from "@/components/layout/Footer";

// 1. Nagłówki marki — pewny, precyzyjny grotesk
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

// 2. Akcent "heritage" — używany punktowo (cytat, "1968")
const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
});

// 3. Sans-Serif (UI/Body)
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// 4. Mono (ceny, dane techniczne)
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LANLAB ONLINE — Z pasją do nauczania od 1968 roku",
    description: "Nowoczesna szkoła językowa online z tradycją od 1968 roku. Indywidualne lekcje, bezpłatna lekcja próbna, umów się w kilka kliknięć.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl">
        <body
            className={`
          ${spaceGrotesk.variable}
          ${fraunces.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
        >
        <div>
            {children}
            <Footer />
        </div>

        </body>
        </html>
    );
}