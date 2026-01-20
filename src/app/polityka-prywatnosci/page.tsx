import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Navbar />
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold mb-8">Polityka Prywatności</h1>
                <p className="text-sm text-slate-500 mb-12">Obowiązuje od: {new Date().toLocaleDateString('pl-PL')}</p>

                <div className="prose prose-slate max-w-none space-y-8">

                    <section>
                        <h2 className="text-xl font-bold mb-4">1. Administrator Danych Osobowych</h2>
                        <p>
                            Administratorem Twoich danych osobowych jest <strong>WeUnite Jan Hofman</strong> z siedzibą przy ul. Gdyńska G lok. 9, 80-340 Gdańsk, NIP: 5842877195, REGON: 543312986.
                        </p>
                        <p>
                            W sprawach związanych z ochroną danych możesz skontaktować się z nami pod adresem e-mail: (uzupełnij email).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">2. Jakie dane przetwarzamy i w jakim celu?</h2>
                        <p>Przetwarzamy dane, które podajesz nam dobrowolnie:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Formularz rezerwacji:</strong> Imię, nazwisko, adres e-mail, numer telefonu. Cel: Realizacja usługi rezerwacji terminu, kontakt w sprawie lekcji (Podstawa prawna: Art. 6 ust. 1 lit. b RODO - wykonanie umowy/działania przed zawarciem umowy).
                            </li>
                            <li>
                                <strong>Kontakt e-mail/telefon:</strong> Dane, które podasz w trakcie kontaktu. Cel: Udzielenie odpowiedzi na zapytanie (Podstawa prawna: Art. 6 ust. 1 lit. f RODO - uzasadniony interes administratora).
                            </li>
                            <li>
                                <strong>Dane analityczne:</strong> Adres IP, informacje o przeglądarce, zachowanie na stronie. Cel: Analiza statystyk i optymalizacja strony (Podstawa prawna: Art. 6 ust. 1 lit. f RODO).
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">3. Narzędzia Analityczne i Cookies (GA4 & GTM)</h2>
                        <p>
                            Korzystamy z narzędzi dostarczanych przez Google Ireland Limited:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>
                                <strong>Google Tag Manager (GTM):</strong> Narzędzie do zarządzania skryptami na stronie. Samo w sobie nie zbiera danych osobowych, ale uruchamia inne tagi (np. GA4).
                            </li>
                            <li>
                                <strong>Google Analytics 4 (GA4):</strong> Służy do analizy ruchu na stronie. GA4 automatycznie anonimizuje adresy IP użytkowników. Dane zbierane to m.in. czas spędzony na stronie, lokalizacja (ogólna), typ urządzenia.
                            </li>
                        </ul>
                        <p className="mt-2">
                            Możesz zablokować działanie Google Analytics instalując dodatek do przeglądarki udostępniony przez Google: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">Google Analytics Opt-out</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">4. Odbiorcy Danych</h2>
                        <p>
                            Twoje dane mogą być przekazywane podmiotom przetwarzającym je na nasze zlecenie, niezbędnym do realizacji usług:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Dostawcom usług hostingowych i serwerowych (np. Vercel, Supabase).</li>
                            <li>Dostawcom narzędzi do automatyzacji procesów (np. Make.com, Airtable) - wyłącznie w zakresie niezbędnym do obsługi Twojego zgłoszenia.</li>
                            <li>Biuru księgowemu (w przypadku wystawienia faktury).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">5. Twoje Prawa</h2>
                        <p>
                            Zgodnie z RODO przysługuje Ci prawo do:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Dostępu do swoich danych oraz otrzymania ich kopii.</li>
                            <li>Sprostowania (poprawiania) swoich danych.</li>
                            <li>Usunięcia danych ("prawo do bycia zapomnianym").</li>
                            <li>Ograniczenia przetwarzania.</li>
                            <li>Wniesienia sprzeciwu wobec przetwarzania.</li>
                            <li>Wniesienia skargi do Prezesa UODO (ul. Stawki 2, 00-193 Warszawa).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">6. Okres przechowywania danych</h2>
                        <p>
                            Dane osobowe będą przechowywane przez okres niezbędny do realizacji celów (np. do czasu odbycia lekcji), a po tym czasie przez okres wymagany przepisami prawa (np. księgowego) lub do czasu przedawnienia ewentualnych roszczeń.
                        </p>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}