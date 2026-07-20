# Product

## Register

brand

## Users

Głównie dorośli uczący się indywidualnie — rozwój osobisty lub zawodowy (praca, egzaminy, kontrakty zagraniczne), nie dzieci ani grupy korporacyjne w pierwszej kolejności. Trafiają na stronę porównując kilka szkół językowych, często na telefonie, w krótkim oknie decyzyjnym: chcą szybko zrozumieć ofertę, cenę i zaufać marce, zanim klikną "Umów się". Niska tolerancja na przeładowaną treść lub żargon marketingowy.

Drugorzędna powierzchnia: panel administracyjny (`/admin`) używany przez właściciela/lektora do zarządzania terminami, kodami rabatowymi i treścią wiedzy chatbota KUBA. To osobna powierzchnia typu *product* — projektowana jako narzędzie robocze, nie jako część doświadczenia marki.

## Product Purpose

LANLAB ONLINE to cyfrowa odsłona szkoły językowej Language Laboratories, działającej w Gdańsku od 1968 roku. Strona ma:

- sprzedawać pojedynczą, jasną ścieżkę: standardowa lekcja (150 zł / 1h) lub bezpłatna lekcja próbna odblokowywana kodem rabatowym,
- prowadzić do rezerwacji terminu w czytelnym kalendarzu,
- tłumaczyć ofertę i historię marki prostym językiem — częściowo przez treść strony, częściowo przez chatbota KUBA,
- dać właścicielowi panel do zarządzania terminami, kodami i wiedzą, którą "karmiony" jest KUBA, bez ingerencji w kod.

Sukces = użytkownik w kilku przewinięciach rozumie ofertę, ufa marce i rezerwuje termin (płatny lub próbny).

## Brand Personality

Pewny siebie, precyzyjny, ugruntowany. Trzy słowa, w tej kolejności ważności: **confident** (nasycony niebieski jako autorytet, nie dekoracja), **precise** (ostra typografia, zero szumu wizualnego), **established** (56+ lat historii jako dowód, nie jako stylistyka retro).

Kierunek wybrany świadomie: bliżej nowoczesnego, pewnego siebie fintechu (Revolut/Monzo-style marketing) niż akademickiej, stonowanej powagi instytutu językowego. Historia od 1968 roku jest argumentem zaufania wplecionym w nowoczesną powłokę, nie estetyką przewodnią.

## Anti-references

- **Obecny stan strony** (do całkowitego zastąpienia): motyw "hacker/terminal" — czarne tło, cyjan/fiolet, monospace, napisy typu "SYSTEM_ORIGIN", "SECURE_CONNECTION", marka "WeTalk". To ma zniknąć w całości na rzecz LANLAB ONLINE.
- Generyczny korporacyjny edtech SaaS: błękitne gradienty na białym tle, uśmiechnięci ludzie ze zdjęć stockowych, ikony w okrągłych kółkach, karty 1:1 wszędzie.
- Infantylna gamifikacja (Duolingo-style maskotki, paski postępu, streaki) — szkoła ma być poważna i premium, nie zabawowa.

## Design Principles

1. **Pewność zamiast krzykliwości** — nasycony niebieski niesie autorytet i skupia uwagę na ścieżce konwersji; to nie jest dekoracyjny akcent w tle.
2. **Historia jako dowód, nie dekoracja** — "od 1968" pojawia się jako fakt i dowód wiarygodności (liczby, archiwalne zdjęcie, cytat), nigdy jako stylistyka vintage/retro.
3. **Jedna czytelna ścieżka do zapisu** — każda sekcja strony prowadzi z powrotem do rezerwacji; brak rozpraszających bocznych ścieżek.
4. **Prostota tłumaczy ofertę** — zarówno copy strony, jak i odpowiedzi KUBY, upraszczają żargon edukacyjny na konkretne korzyści.
5. **Gotowość pod rozbudowę** — komponenty i CMS wiedzy KUBY projektowane tak, by dało się dodawać treść i automatyzacje bez przebudowy struktury.

## Accessibility & Inclusion

WCAG AA jako minimum. Szczególna uwaga na kontrast tekstu na nasyconym niebieskim tle (Committed color strategy podnosi ryzyko niskiego kontrastu). Cała ścieżka rezerwacji (kalendarz, wybór slotu, formularz, pole kodu rabatowego) musi być w pełni obsługiwalna z klawiatury i czytnikiem ekranu — to główna ścieżka konwersji. `prefers-reduced-motion` respektowany dla animacji hero i przejść kalendarza.
