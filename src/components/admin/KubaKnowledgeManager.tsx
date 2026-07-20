"use client";

import { useState } from "react";
import {
    saveKnowledgeSection,
    createFaqEntry,
    deleteFaqEntry,
    createNewsEntry,
    deleteNewsEntry,
    type KubaSection,
} from "@/app/actions/kuba-actions";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Bot, Loader2, Check, Plus, Trash2, HelpCircle, Newspaper, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = { id: string; question: string; answer: string; order: number };
type News = { id: string; title: string; body: string; publishedAt: Date };

const SECTION_TABS: { key: KubaSection; label: string; placeholder: string }[] = [
    { key: "historia", label: "Historia", placeholder: "Od 1968 roku LANLAB..." },
    { key: "misja", label: "Misja", placeholder: "Naszą misją jest..." },
    { key: "oferta", label: "Oferta", placeholder: "Prowadzimy indywidualne lekcje..." },
    { key: "cennik", label: "Cennik", placeholder: "Lekcja standardowa: 150 zł / 60 min..." },
];

function SectionEditor({ knowledge }: { knowledge: Record<KubaSection, string> }) {
    const [active, setActive] = useState<KubaSection>("historia");
    const [values, setValues] = useState<Record<string, string>>(
        Object.fromEntries(SECTION_TABS.map((t) => [t.key, knowledge[t.key] || ""]))
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    async function handleSave() {
        setSaving(true);
        setSaved(false);
        const formData = new FormData();
        formData.append("section", active);
        formData.append("content", values[active] || "");
        await saveKnowledgeSection(formData);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    const activeTab = SECTION_TABS.find((t) => t.key === active)!;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                <h3 className="font-semibold text-slate-900">Wiedza KUBY — bloki treściowe</h3>
            </div>

            <div className="flex border-b border-slate-200 px-5 gap-1 overflow-x-auto">
                {SECTION_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActive(tab.key)}
                        className={cn(
                            "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                            active === tab.key
                                ? "border-brand-primary text-brand-primary"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-5">
                <textarea
                    value={values[active] || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [active]: e.target.value }))}
                    placeholder={activeTab.placeholder}
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors resize-y"
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-brand-primary-dark transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
                        {saved ? "Zapisano" : "Zapisz sekcję"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FaqEditor({ faqs }: { faqs: Faq[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        await createFaqEntry(formData);
        setIsPending(false);
        setIsOpen(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Usunąć to pytanie?")) return;
        await deleteFaqEntry(id);
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-primary" /> FAQ
                </h3>
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Dodaj
                </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                {faqs.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">Brak pytań</div>}
                {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 flex items-start justify-between gap-4 group hover:bg-slate-50">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                            <p className="text-sm text-slate-500 mt-1">{faq.answer}</p>
                        </div>
                        <button onClick={() => handleDelete(faq.id)} className="p-1.5 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Nowe pytanie FAQ</h3>
                        <form action={handleSubmit} className="space-y-3">
                            <input name="question" required placeholder="Pytanie" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-brand-primary" />
                            <textarea name="answer" required placeholder="Odpowiedź" rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-brand-primary resize-y" />
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 text-slate-500 hover:text-slate-900">Anuluj</button>
                                <button type="submit" disabled={isPending} className="flex-1 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark flex items-center justify-center gap-2">
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Dodaj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function NewsEditor({ news }: { news: News[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        await createNewsEntry(formData);
        setIsPending(false);
        setIsOpen(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Usunąć tę aktualność?")) return;
        await deleteNewsEntry(id);
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-brand-primary" /> Aktualności
                </h3>
                <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Dodaj
                </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                {news.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">Brak aktualności</div>}
                {news.map((n) => (
                    <div key={n.id} className="p-4 flex items-start justify-between gap-4 group hover:bg-slate-50">
                        <div>
                            <p className="text-[11px] text-slate-400 uppercase font-bold mb-0.5">{format(new Date(n.publishedAt), "d MMM yyyy", { locale: pl })}</p>
                            <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                            <p className="text-sm text-slate-500 mt-1">{n.body}</p>
                        </div>
                        <button onClick={() => handleDelete(n.id)} className="p-1.5 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Nowa aktualność</h3>
                        <form action={handleSubmit} className="space-y-3">
                            <input name="title" required placeholder="Tytuł" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-brand-primary" />
                            <textarea name="body" required placeholder="Treść" rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-brand-primary resize-y" />
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2.5 text-slate-500 hover:text-slate-900">Anuluj</button>
                                <button type="submit" disabled={isPending} className="flex-1 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark flex items-center justify-center gap-2">
                                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Dodaj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export function KubaKnowledgeManager({
    knowledge,
    faqs,
    news,
}: {
    knowledge: Record<KubaSection, string>;
    faqs: Faq[];
    news: News[];
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Wiedza chatbota KUBA</h2>
                    <p className="text-sm text-slate-500">Treść, na podstawie której KUBA odpowiada odwiedzającym stronę.</p>
                </div>
            </div>

            <SectionEditor knowledge={knowledge} />

            <div className="grid md:grid-cols-2 gap-6">
                <FaqEditor faqs={faqs} />
                <NewsEditor news={news} />
            </div>
        </div>
    );
}
