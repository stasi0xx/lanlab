// src/components/ui/background-gradient-animation.tsx
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const BackgroundGradientAnimation = ({
                                                children,
                                                className,
                                                containerClassName,
                                            }: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 bg-black overflow-hidden flex items-center justify-center",
                containerClassName
            )}
            style={{
                // PALETA NEONOWYCH KOLORÓW (RGB)
                // Głęboki fiolet (baza)
                "--first-color": "120, 0, 255",

                // Neonowy błękit (Cyber Blue)
                "--second-color": "0, 240, 255",

                // Neonowy róż (Hot Pink)
                "--third-color": "255, 0, 150",

                // Elektryczny błękit
                "--fourth-color": "50, 100, 255",

                // Jasny akcent (Cyan)
                "--fifth-color": "0, 255, 200",

                "--size": "90%",
            } as React.CSSProperties}
        >
            <div className={cn("relative z-10 w-full h-full", className)}>{children}</div>

            {/* ZWIĘKSZONE OPACITY (0.6) + BLUR */}
            <div className="gradients-container h-full w-full absolute inset-0 blur-[100px] opacity-60">

                {/* Używamy 'mix-blend-hard-light' lub 'screen' dla efektu świecenia */}
                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),0.5)_0,_rgba(var(--first-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-first mix-blend-hard-light"></div>

                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),0.4)_0,_rgba(var(--second-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-second mix-blend-hard-light"></div>

                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),0.4)_0,_rgba(var(--third-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-third mix-blend-hard-light"></div>

                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),0.4)_0,_rgba(var(--fourth-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-fourth mix-blend-hard-light"></div>

                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),0.4)_0,_rgba(var(--fifth-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-fifth mix-blend-hard-light"></div>
            </div>
        </div>
    );
};