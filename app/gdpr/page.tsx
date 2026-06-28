import type { Metadata } from "next";
import Link from "next/link";
import { HexPattern } from "@/components/ui/HexPattern";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate (GDPR)",
  description:
    "Politica de confidențialitate Fagurul de Aur — cum colectăm, folosim și protejăm datele tale personale, conform Regulamentului (UE) 2016/679.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-label={title} className="mb-10 scroll-mt-28">
      <h2 className="font-heading text-2xl text-gold-300 mb-4" style={{ fontSize: "1.5rem" }}>
        {title}
      </h2>
      <div className="space-y-3 text-text-secondary text-sm leading-relaxed">{children}</div>
    </section>
  );
}

const toc = [
  { id: "operator", label: "1. Cine suntem (Operatorul)" },
  { id: "date-colectate", label: "2. Ce date colectăm" },
  { id: "scopuri", label: "3. Scopurile și temeiurile prelucrării" },
  { id: "destinatari", label: "4. Cui transmitem datele" },
  { id: "durata", label: "5. Cât timp păstrăm datele" },
  { id: "drepturi", label: "6. Drepturile tale" },
  { id: "cookies", label: "7. Cookie-uri" },
  { id: "securitate", label: "8. Securitatea datelor" },
  { id: "minori", label: "9. Datele minorilor" },
  { id: "modificari", label: "10. Modificări ale politicii" },
  { id: "contact-dpo", label: "11. Contact și plângeri" },
];

export default function GdprPage() {
  return (
    <div className="bg-bg-primary pt-20">
      {/* Header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="gold-line" />
          <h1 className="font-heading text-text-primary" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Politica de Confidențialitate
          </h1>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto text-sm">
            Conform Regulamentului (UE) 2016/679 privind protecția persoanelor fizice în ceea ce
            privește prelucrarea datelor cu caracter personal (GDPR)
          </p>
          <p className="text-text-muted text-sm mt-3">Ultima actualizare: 1 iunie 2026</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* TOC */}
          <nav aria-label="Cuprins" className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 card p-5">
              <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
                Cuprins
              </h2>
              <ul className="space-y-1.5">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-text-muted text-xs hover:text-gold-300 transition-colors block py-0.5">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3">
            <Section id="operator" title="1. Cine suntem (Operatorul)">
              <p>
                Operatorul datelor dumneavoastră cu caracter personal este{" "}
                <strong className="text-text-primary">FAGURUL DE AUR S.R.L.</strong>, cu sediul în județul
                Gorj, România, înregistrată la Registrul Comerțului sub nr. J20/XXX/20XX, CUI
                ROXXXXXXXX (denumită în continuare „Fagurul de Aur", „noi").
              </p>
              <p>
                Ne puteți contacta pentru orice aspect legat de protecția datelor la:{" "}
                <strong className="text-text-primary">faguruldeaur@gmail.com</strong>.
              </p>
              <p>
                Respectăm confidențialitatea datelor dumneavoastră și prelucrăm datele personale doar în
                conformitate cu GDPR, Legea nr. 190/2018 și restul legislației aplicabile în România.
              </p>
            </Section>

            <Section id="date-colectate" title="2. Ce date colectăm">
              <p>În funcție de modul în care interacționați cu site-ul nostru, putem colecta:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-text-primary">La plasarea unei comenzi:</strong> nume, prenume,
                  adresă de e-mail, număr de telefon, adresă de livrare (județ, localitate, stradă, cod
                  poștal), detaliile comenzii și, pentru persoane juridice, datele de facturare.
                </li>
                <li>
                  <strong className="text-text-primary">La plata online cu cardul:</strong> datele
                  cardului sunt colectate și procesate <em>exclusiv</em> de procesatorul de plăți
                  autorizat, în mediul său securizat. Fagurul de Aur nu vede și nu stochează numărul
                  cardului, data de expirare sau codul CVV.
                </li>
                <li>
                  <strong className="text-text-primary">La completarea formularului de contact:</strong>{" "}
                  nume, e-mail, telefon (opțional), subiectul și conținutul mesajului.
                </li>
                <li>
                  <strong className="text-text-primary">La abonarea la newsletter:</strong> adresa de
                  e-mail.
                </li>
                <li>
                  <strong className="text-text-primary">Automat, la vizitarea site-ului:</strong> adresă
                  IP, tip de browser și dispozitiv, pagini vizitate, date colectate prin cookie-uri (vezi
                  secțiunea 7).
                </li>
              </ul>
              <p>
                Nu colectăm și nu prelucrăm categorii speciale de date (origine rasială, opinii politice,
                date privind sănătatea etc.).
              </p>
            </Section>

            <Section id="scopuri" title="3. Scopurile și temeiurile prelucrării">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gold-400/15">
                  <thead>
                    <tr className="bg-bg-elevated">
                      <th className="p-3 font-body font-semibold text-gold-400 uppercase tracking-wider border-b border-gold-400/15">Scop</th>
                      <th className="p-3 font-body font-semibold text-gold-400 uppercase tracking-wider border-b border-gold-400/15">Temei legal (art. 6 GDPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-400/10">
                    <tr>
                      <td className="p-3">Procesarea și livrarea comenzilor, facturare</td>
                      <td className="p-3">Executarea contractului — art. 6 (1) (b); obligație legală pentru facturare — art. 6 (1) (c)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Răspuns la solicitări prin formularul de contact</td>
                      <td className="p-3">Interes legitim / demersuri precontractuale — art. 6 (1) (f) și (b)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Trimiterea newsletterului și a ofertelor</td>
                      <td className="p-3">Consimțământ — art. 6 (1) (a); retractabil oricând</td>
                    </tr>
                    <tr>
                      <td className="p-3">Păstrarea documentelor contabile</td>
                      <td className="p-3">Obligație legală — art. 6 (1) (c)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Prevenirea fraudelor, apărarea drepturilor în instanță</td>
                      <td className="p-3">Interes legitim — art. 6 (1) (f)</td>
                    </tr>
                    <tr>
                      <td className="p-3">Statistici și îmbunătățirea site-ului</td>
                      <td className="p-3">Consimțământ (cookie-uri de analiză) — art. 6 (1) (a)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Furnizarea datelor marcate ca obligatorii la plasarea comenzii este necesară pentru
                încheierea contractului; refuzul furnizării lor face imposibilă procesarea comenzii.
              </p>
            </Section>

            <Section id="destinatari" title="4. Cui transmitem datele">
              <p>
                Nu vindem și nu închiriem datele dumneavoastră personale. Le putem transmite, strict în
                măsura necesară, către:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-text-primary">Societăți de curierat</strong> — nume, telefon, adresă de livrare, pentru expedierea comenzilor;</li>
                <li><strong className="text-text-primary">Procesatori de plăți</strong> — pentru procesarea plăților online cu cardul;</li>
                <li><strong className="text-text-primary">Furnizori de servicii IT</strong> — găzduire web, servicii de e-mail, mentenanță (în baza unor acorduri de prelucrare conforme art. 28 GDPR);</li>
                <li><strong className="text-text-primary">Contabilitate și consultanță juridică</strong> — în limita obligațiilor legale;</li>
                <li><strong className="text-text-primary">Autorități publice</strong> — doar la cerere, în temeiul legii (ANAF, organe de cercetare etc.).</li>
              </ul>
              <p>
                Datele sunt stocate pe servere din Uniunea Europeană. Dacă un furnizor ar implica un
                transfer în afara UE/SEE, acesta s-ar realiza doar cu garanții adecvate (decizii de
                adecvare sau clauze contractuale standard aprobate de Comisia Europeană).
              </p>
            </Section>

            <Section id="durata" title="5. Cât timp păstrăm datele">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-text-primary">Date aferente comenzilor și facturilor</strong> — 10 ani (termenul legal de arhivare a documentelor financiar-contabile);</li>
                <li><strong className="text-text-primary">Mesaje primite prin formularul de contact</strong> — maximum 2 ani de la ultima corespondență;</li>
                <li><strong className="text-text-primary">Adresa de e-mail pentru newsletter</strong> — până la dezabonare sau retragerea consimțământului;</li>
                <li><strong className="text-text-primary">Date colectate prin cookie-uri</strong> — conform duratelor specifice fiecărui cookie (vezi secțiunea 7).</li>
              </ul>
              <p>La expirarea termenelor, datele sunt șterse sau anonimizate ireversibil.</p>
            </Section>

            <Section id="drepturi" title="6. Drepturile tale">
              <p>Conform GDPR, beneficiați de următoarele drepturi:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-text-primary">Dreptul de acces</strong> (art. 15) — să aflați ce date prelucrăm despre dumneavoastră și să primiți o copie a acestora;</li>
                <li><strong className="text-text-primary">Dreptul la rectificare</strong> (art. 16) — corectarea datelor inexacte sau completarea celor incomplete;</li>
                <li><strong className="text-text-primary">Dreptul la ștergere („dreptul de a fi uitat")</strong> (art. 17) — în condițiile prevăzute de regulament;</li>
                <li><strong className="text-text-primary">Dreptul la restricționarea prelucrării</strong> (art. 18);</li>
                <li><strong className="text-text-primary">Dreptul la portabilitatea datelor</strong> (art. 20) — primirea datelor într-un format structurat, utilizat în mod curent;</li>
                <li><strong className="text-text-primary">Dreptul la opoziție</strong> (art. 21) — inclusiv față de marketingul direct, oricând și gratuit;</li>
                <li><strong className="text-text-primary">Dreptul de a vă retrage consimțământul</strong> — oricând, fără a afecta legalitatea prelucrării anterioare;</li>
                <li><strong className="text-text-primary">Dreptul de a nu face obiectul unei decizii bazate exclusiv pe prelucrare automată</strong> (art. 22) — nu folosim astfel de procese decizionale.</li>
              </ul>
              <p>
                Pentru exercitarea acestor drepturi, scrieți-ne la{" "}
                <strong className="text-text-primary">faguruldeaur@gmail.com</strong>. Răspundem în
                maximum <strong className="text-text-primary">30 de zile</strong> de la primirea cererii
                (termen prelungibil cu 60 de zile în cazuri complexe, cu notificare prealabilă).
              </p>
            </Section>

            <Section id="cookies" title="7. Cookie-uri">
              <p>
                Site-ul folosește cookie-uri — fișiere text de mici dimensiuni stocate pe dispozitivul
                dumneavoastră. Categoriile utilizate:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-text-primary">Cookie-uri strict necesare</strong> — esențiale
                  pentru funcționarea site-ului (ex. memorarea coșului de cumpărături). Nu necesită
                  consimțământ; stocate local, de regulă până la 12 luni.
                </li>
                <li>
                  <strong className="text-text-primary">Cookie-uri de analiză</strong> — ne ajută să
                  înțelegem cum este folosit site-ul (pagini vizitate, durată sesiune), în formă
                  agregată. Se activează doar cu consimțământul dumneavoastră.
                </li>
                <li>
                  <strong className="text-text-primary">Cookie-uri de marketing</strong> — folosite doar
                  dacă vă exprimați acordul, pentru oferte personalizate.
                </li>
              </ul>
              <p>
                Puteți gestiona sau șterge cookie-urile din setările browserului. Blocarea cookie-urilor
                strict necesare poate afecta funcționarea coșului de cumpărături și a procesului de
                comandă.
              </p>
            </Section>

            <Section id="securitate" title="8. Securitatea datelor">
              <p>
                Aplicăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor împotriva
                accesului neautorizat, pierderii, distrugerii sau divulgării:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>conexiune criptată TLS/SSL (https) pe întreg site-ul;</li>
                <li>acces la date restricționat la personalul strict necesar, pe bază de credențiale;</li>
                <li>plăți procesate exclusiv prin procesatori certificați PCI-DSS, cu autentificare 3D Secure;</li>
                <li>copii de siguranță periodice și actualizări de securitate ale sistemelor.</li>
              </ul>
              <p>
                În cazul improbabil al unei încălcări a securității datelor care prezintă risc ridicat
                pentru drepturile dumneavoastră, vă vom notifica fără întârzieri nejustificate, conform
                art. 34 GDPR.
              </p>
            </Section>

            <Section id="minori" title="9. Datele minorilor">
              <p>
                Site-ul nostru se adresează persoanelor cu vârsta de minimum 18 ani. Nu colectăm cu bună
                știință date personale ale minorilor. Dacă aflăm că am colectat astfel de date fără
                consimțământul titularului răspunderii părintești, le vom șterge în cel mai scurt timp.
              </p>
            </Section>

            <Section id="modificari" title="10. Modificări ale politicii">
              <p>
                Putem actualiza periodic această politică pentru a reflecta modificări legislative sau
                operaționale. Versiunea curentă, cu data ultimei actualizări, este publicată permanent pe
                această pagină. Modificările semnificative vor fi anunțate vizibil pe site sau prin
                e-mail, acolo unde legea o cere.
              </p>
            </Section>

            <Section id="contact-dpo" title="11. Contact și plângeri">
              <p>
                Pentru orice întrebare sau solicitare privind datele personale:{" "}
                <strong className="text-text-primary">faguruldeaur@gmail.com</strong> sau{" "}
                <Link href="/contact" className="text-gold-300 hover:underline">formularul de contact</Link>.
              </p>
              <p>
                Dacă apreciați că prelucrarea datelor dumneavoastră încalcă GDPR, aveți dreptul de a
                depune o plângere la autoritatea de supraveghere:
              </p>
              <div className="card p-5">
                <p className="text-text-primary font-semibold mb-1">
                  ANSPDCP — Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
                </p>
                <p className="text-text-muted text-xs leading-relaxed">
                  B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, 010336 București, România<br />
                  Telefon: +40 318 059 211 · E-mail: anspdcp@dataprotection.ro<br />
                  Web:{" "}
                  <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:underline">
                    www.dataprotection.ro
                  </a>
                </p>
              </div>
              <p>
                De asemenea, aveți dreptul de a vă adresa instanțelor judecătorești competente.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
