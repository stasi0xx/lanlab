"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { kubaRespond } from "@/lib/kuba/respond";
import type { KubaSection } from "@/app/actions/kuba-actions";

type Message = { role: "kuba" | "user"; text: string };
type Faq = { id: string; question: string; answer: string };

const GREETING =
    "Cześć! Jestem KUBA. Opowiem Ci o LANLAB ONLINE — historii szkoły, ofercie, cenniku i zapisach. O co chcesz zapytać?";

const SUGGESTIONS = ["Jak się zapisać?", "Ile kosztuje lekcja?", "Skąd wasza historia?"];

export function KubaChat({
    knowledge,
    faqs,
}: {
    knowledge: Partial<Record<KubaSection, string>>;
    faqs: Faq[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{ role: "kuba", text: GREETING }]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isOpen]);

    function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const reply = kubaRespond(trimmed, knowledge, faqs);
        setMessages((m) => [...m, { role: "user", text: trimmed }, { role: "kuba", text: reply }]);
        setInput("");
    }

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm h-[28rem] bg-white rounded-2xl border border-brand-line shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-brand-primary text-white shrink-0">
                        <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                            <Bot className="w-4.5 h-4.5" />
                        </div>
                        <div className="leading-tight">
                            <p className="font-display font-bold text-sm">KUBA</p>
                            <p className="text-[11px] text-white/75">Asystent LANLAB ONLINE</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="ml-auto p-1 text-white/70 hover:text-white transition-colors">
                            <X className="w-4.5 h-4.5" />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 bg-brand-paper">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                                    msg.role === "kuba"
                                        ? "bg-white border border-brand-line text-brand-ink rounded-tl-sm"
                                        : "bg-brand-primary text-white ml-auto rounded-tr-sm"
                                )}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => send(s)}
                                        className="text-xs font-medium text-brand-primary border border-brand-primary/30 rounded-full px-3 py-1.5 hover:bg-brand-primary/5 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={(e) => { e.preventDefault(); send(input); }}
                        className="flex items-center gap-2 p-3 border-t border-brand-line bg-white shrink-0"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Napisz wiadomość..."
                            className="flex-1 min-w-0 bg-brand-surface border border-brand-line rounded-full px-4 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="w-10 h-10 shrink-0 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary-dark transition-colors disabled:opacity-40"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? "Zamknij czat z KUBĄ" : "Otwórz czat z KUBĄ"}
                className="fixed bottom-5 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-brand-primary text-white shadow-xl flex items-center justify-center hover:bg-brand-primary-dark active:scale-95 transition-all"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </>
    );
}
