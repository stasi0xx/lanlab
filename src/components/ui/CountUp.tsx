"use client";

import { useEffect, useState, useRef } from "react";

export function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    let startTime: number | null = null;
                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);

                        // Easing function (easeOutExpo) dla płynnego kończenia
                        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                        setCount(Math.floor(easeOut * end));

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            },
            { threshold: 0.5 } // Odpal jak 50% elementu będzie widoczne
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}</span>;
}