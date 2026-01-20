import { Navbar } from "@/components/layout/Navbar"; // Zakładam, że masz Navbar
import { Footer } from "@/components/layout/Footer"; // Zakładam, że masz Footer

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900">
            <Navbar />
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <h1 className="text-4xl font-serif font-bold mb-8">Regulamin Serwisu</h1>
                <p className="text-sm text-slate-500 mb-12">Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</p>

                <div className="prose prose-slate max-w-none space-y-8">

                    <section>
                        <h2 className="text-xl font-bold mb-4">I. Postanowienia ogólne</h2>
                        <p>
                            1. Niniejszy Regulamin określa zasady korzystania z serwisu internetowego LanLab, dostępnego pod adresem internetowym domeny głównej.
                        </p>
                        <p>
                            2. Właścicielem serwisu i Administratorem jest firma: <strong>WeUnite Jan Hofman</strong> z siedzibą przy ul. Gdyńska G lok. 9, 80-340 Gdańsk, NIP: 5842877195, REGON: 543312986.
                        </p>
                        <p>
                            3. Kontakt z Administratorem możliwy jest drogą elektroniczną pod adresem e-mail (uzupełnij email) lub pisemnie na adres siedziby.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">II. Rodzaje i zakres usług świadczonych drogą elektroniczną</h2>
                        <p>
                            1. Administrator świadczy za pośrednictwem Serwisu usługi drogą elektroniczną polegające na:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Umożliwieniu zapoznania się z ofertą edukacyjną (szkoła językowa).</li>
                            <li>Umożliwieniu rezerwacji terminów spotkań/lekcji online poprzez formularz rezerwacyjny.</li>
                            <li>Umożliwieniu kontaktu za pośrednictwem formularzy kontaktowych.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">III. Warunki świadczenia usług</h2>
                        <p>
                            1. Do korzystania z Serwisu niezbędne jest posiadanie urządzenia z dostępem do sieci Internet oraz przeglądarki internetowej (np. Chrome, Firefox, Safari).
                        </p>
                        <p>
                            2. Użytkownik zobowiązany jest do korzystania z Serwisu w sposób zgodny z prawem i dobrymi obyczajami, a w szczególności do niepodawania fałszywych danych osobowych podczas rezerwacji.
                        </p>
                        <p>
                            3. Zakazane jest dostarczanie przez Użytkownika treści o charakterze bezprawnym.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">IV. Rezerwacje i Lekcje Próbne</h2>
                        <p>
                            1. Serwis umożliwia zapisanie się na lekcje (w tym darmowe lekcje próbne z użyciem kodów rabatowych).
                        </p>
                        <p>
                            2. Rezerwacja terminu następuje poprzez wybór daty w kalendarzu, podanie wymaganych danych (imię, email, telefon) i zatwierdzenie formularza.
                        </p>
                        <p>
                            3. Administrator zastrzega sobie prawo do odwołania lub zmiany terminu rezerwacji z przyczyn losowych, o czym Użytkownik zostanie poinformowany drogą mailową lub telefoniczną.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">V. Reklamacje</h2>
                        <p>
                            1. Użytkownik ma prawo składać reklamacje dotyczące funkcjonowania Serwisu.
                        </p>
                        <p>
                            2. Reklamacje należy zgłaszać drogą elektroniczną na adres e-mail Administratora.
                        </p>
                        <p>
                            3. Administrator rozpatrzy reklamację w terminie do 14 dni od jej otrzymania.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">VI. Ochrona danych osobowych</h2>
                        <p>
                            Zasady przetwarzania danych osobowych określa <a href="/polityka-prywatnosci" className="text-brand-primary underline">Polityka Prywatności</a>, stanowiąca integralną część niniejszego Regulaminu.
                        </p>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}