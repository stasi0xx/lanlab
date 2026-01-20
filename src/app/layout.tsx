// src/app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. Konfiguracja "Historycznego" szeryfa
const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
    // Fraunces to Variable font, więc wagi są automatyczne,
    // ale możemy dostroić osie optyczne jeśli trzeba.
});

// 2. Nowoczesny Sans-Serif (UI/Body)
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// 3. Techniczny Mono (Kod, Ceny, Chatbot data)
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Language Laboratories - Nauka języków od 1968",
    description: "Nowoczesna szkoła językowa online z tradycjami. Umów się na lekcję próbną.",
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
          ${fraunces.variable} 
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased bg-white text-slate-900
        `}
        >
        {children}
        </body>
        </html>
    );
}