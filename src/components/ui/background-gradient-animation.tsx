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
                "h-full w-full absolute top-0 left-0 bg-slate-50 overflow-hidden flex items-center justify-center",
                containerClassName
            )}
            style={{
                // DEFINICJA KOLORÓW (RGB)
                // Ciemniejszy niebieski / Granat
                "--first-color": "18, 113, 255",
                // Głęboki fiolet
                "--second-color": "100, 50, 200",
                // Ciemny turkus
                "--third-color": "0, 100, 150",
                // Niebieski 'Royal'
                "--fourth-color": "50, 80, 200",
                // Akcent jaśniejszy
                "--fifth-color": "20, 150, 255",

                "--size": "80%", // Wielkość blobów
            } as React.CSSProperties}
        >
            <div className={cn("relative z-10 w-full h-full", className)}>{children}</div>

            {/* Kontener Gradientów */}
            <div className="gradients-container h-full w-full absolute inset-0 blur-[80px]">
                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),0.4)_0,_rgba(var(--first-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-first opacity-100 mix-blend-multiply"></div>
                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),0.4)_0,_rgba(var(--second-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-second opacity-100 mix-blend-multiply"></div>
                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),0.4)_0,_rgba(var(--third-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-third opacity-100 mix-blend-multiply"></div>
                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),0.4)_0,_rgba(var(--fourth-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-fourth opacity-70 mix-blend-multiply"></div>
                <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),0.4)_0,_rgba(var(--fifth-color),0)_50%)] no-repeat w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-fifth opacity-100 mix-blend-multiply"></div>
            </div>
        </div>
    );
};