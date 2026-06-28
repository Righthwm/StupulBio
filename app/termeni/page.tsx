import type { Metadata } from "next";
import Link from "next/link";
import { HexPattern } from "@/components/ui/HexPattern";

export const metadata: Metadata = {
  title: "Termeni și Condiții",
  description:
    "Termenii și condițiile de utilizare a magazinului online Fagurul de Aur — comenzi, plată, livrare, retur și garanții.",
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
  { id: "informatii-generale", label: "1. Informații generale" },
  { id: "definitii", label: "2. Definiții" },
  { id: "produse-preturi", label: "3. Produse și prețuri" },
  { id: "comanda", label: "4. Plasarea comenzii" },
  { id: "plata", label: "5. Modalități de plată" },
  { id: "livrare", label: "6. Livrare" },
  { id: "retur", label: "7. Dreptul de retragere (retur)" },
  { id: "garantii", label: "8. Garanții și conformitate" },
  { id: "raspundere", label: "9. Limitarea răspunderii" },
  { id: "proprietate", label: "10. Proprietate intelectuală" },
  { id: "litigii", label: "11. Soluționarea litigiilor" },
  { id: "dispozitii-finale", label: "12. Dispoziții finale" },
];

export default function TermeniPage() {
  return (
    <div className="bg-bg-primary pt-20">
      {/* Header */}
      <div className="relative bg-bg-secondary border-b border-gold-400/10 overflow-hidden">
        <HexPattern opacity={0.025} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="gold-line" />
          <h1 className="font-heading text-text-primary" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Termeni și Condiții
          </h1>
          <p className="text-text-muted text-sm mt-4">Ultima actualizare: 1 iunie 2026</p>
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
            <Section id="informatii-generale" title="1. Informații generale">
              <p>
                Prezentul document stabilește termenii și condițiile de utilizare a site-ului{" "}
                <strong className="text-text-primary">faguruldeaur.ro</strong> (denumit în continuare „Site-ul")
                și de achiziționare a produselor comercializate prin intermediul acestuia.
              </p>
              <p>
                Site-ul este operat de <strong className="text-text-primary">FAGURUL DE AUR S.R.L.</strong>{" "}
                (denumită în continuare „Vânzătorul" sau „Fagurul de Aur"), cu sediul în județul Gorj,
                România, înregistrată la Registrul Comerțului sub nr. J20/XXX/20XX, CUI ROXXXXXXXX,
                e-mail: faguruldeaur@gmail.com.
              </p>
              <p>
                Prin accesarea și utilizarea Site-ului, precum și prin plasarea unei comenzi, sunteți de
                acord cu acești Termeni și Condiții. Dacă nu sunteți de acord, vă rugăm să nu utilizați
                Site-ul.
              </p>
              <p>
                Fagurul de Aur își rezervă dreptul de a modifica acești termeni în orice moment. Versiunea
                aplicabilă unei comenzi este cea în vigoare la data plasării comenzii.
              </p>
            </Section>

            <Section id="definitii" title="2. Definiții">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-text-primary">Client / Cumpărător</strong> — orice persoană fizică cu vârsta de minimum 18 ani sau persoană juridică ce plasează o comandă pe Site.</li>
                <li><strong className="text-text-primary">Comandă</strong> — document electronic prin care Cumpărătorul își exprimă intenția de a achiziționa Produse de pe Site.</li>
                <li><strong className="text-text-primary">Produse</strong> — miere, produse apicole și alte bunuri listate pe Site, oferite spre vânzare de către Vânzător.</li>
                <li><strong className="text-text-primary">Contract</strong> — contractul la distanță încheiat între Vânzător și Cumpărător, conform OUG nr. 34/2014, fără prezența fizică simultană a părților.</li>
                <li><strong className="text-text-primary">Curier</strong> — societatea de curierat prin care se efectuează livrarea Produselor.</li>
              </ul>
            </Section>

            <Section id="produse-preturi" title="3. Produse și prețuri">
              <p>
                Toate prețurile afișate pe Site sunt exprimate în <strong className="text-text-primary">lei (RON)</strong> și
                includ TVA. Prețurile nu includ costul de livrare, care este afișat separat la finalizarea
                comenzii.
              </p>
              <p>
                Imaginile produselor au caracter ilustrativ. Mierea este un produs natural: culoarea,
                consistența și gradul de cristalizare pot varia de la un lot la altul, în funcție de
                sezon și sursa florală, fără ca aceste variații să constituie neconformități.
              </p>
              <p>
                Vânzătorul își rezervă dreptul de a modifica prețurile în orice moment. Prețul aplicabil
                este cel afișat pe Site la momentul plasării comenzii.
              </p>
              <p>
                În cazul unei erori evidente de preț (preț derizoriu rezultat dintr-o eroare tehnică),
                Vânzătorul are dreptul de a anula comanda, cu notificarea Cumpărătorului și restituirea
                integrală a sumelor încasate.
              </p>
            </Section>

            <Section id="comanda" title="4. Plasarea comenzii">
              <p>Plasarea unei comenzi presupune parcurgerea următorilor pași:</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>adăugarea produselor dorite în coșul de cumpărături;</li>
                <li>completarea datelor de contact și a adresei de livrare;</li>
                <li>alegerea metodei de plată;</li>
                <li>acceptarea Termenilor și Condițiilor și confirmarea comenzii.</li>
              </ol>
              <p>
                După plasarea comenzii, Cumpărătorul primește un e-mail de confirmare a înregistrării
                acesteia. Contractul se consideră încheiat la momentul confirmării comenzii de către
                Vânzător prin e-mail sau telefonic.
              </p>
              <p>
                Vânzătorul poate refuza sau anula o comandă în situații justificate: date incomplete sau
                eronate, indisponibilitatea produsului în stoc, suspiciuni rezonabile de fraudă sau
                eșecul tranzacției de plată. Cumpărătorul va fi notificat, iar eventualele sume încasate
                vor fi restituite în maximum 14 zile.
              </p>
            </Section>

            <Section id="plata" title="5. Modalități de plată">
              <p>Pe Site sunt disponibile următoarele metode de plată:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-text-primary">Plata ramburs la livrare</strong> — plata se face
                  în numerar sau cu cardul direct curierului, la primirea coletului. Se percepe o taxă de
                  ramburs de 5 lei, afișată la finalizarea comenzii.
                </li>
                <li>
                  <strong className="text-text-primary">Plata online cu cardul</strong> — Visa sau
                  Mastercard, prin procesator de plăți autorizat. Datele cardului sunt procesate exclusiv
                  de procesatorul de plăți, în mediu securizat (3D Secure); Fagurul de Aur nu stochează datele
                  cardului dumneavoastră.
                </li>
              </ul>
              <p>
                Pentru fiecare comandă se emite factură fiscală, transmisă electronic pe adresa de e-mail
                indicată de Cumpărător.
              </p>
            </Section>

            <Section id="livrare" title="6. Livrare">
              <p>
                Livrarea se efectuează pe întreg teritoriul României, prin curier rapid, de regulă în{" "}
                <strong className="text-text-primary">24–48 de ore lucrătoare</strong> de la confirmarea
                comenzii. Termenul de livrare maxim este de 30 de zile calendaristice, conform legii.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cost livrare: <strong className="text-text-primary">19 lei</strong>;</li>
                <li>Livrare <strong className="text-text-primary">gratuită</strong> pentru comenzile de peste <strong className="text-text-primary">200 lei</strong>;</li>
                <li>Produsele sunt ambalate protector (carton, separatoare), iar pe timp de caniculă se folosesc soluții suplimentare de protecție termică.</li>
              </ul>
              <p>
                Riscul de pierdere sau deteriorare a Produselor se transferă Cumpărătorului la momentul
                intrării în posesia fizică a acestora. Vă recomandăm să verificați coletul la primire și
                să semnalați curierului eventualele deteriorări vizibile ale ambalajului.
              </p>
            </Section>

            <Section id="retur" title="7. Dreptul de retragere (retur)">
              <p>
                Conform OUG nr. 34/2014, Cumpărătorul persoană fizică (consumator) are dreptul de a se
                retrage din contract în termen de <strong className="text-text-primary">14 zile
                calendaristice</strong> de la primirea Produselor, fără a invoca vreun motiv.
              </p>
              <p>
                <strong className="text-text-primary">Excepție importantă:</strong> conform art. 16 lit.
                d) și e) din OUG 34/2014, dreptul de retragere <strong className="text-text-primary">nu se
                aplică</strong> produselor alimentare desigilate, care nu mai pot fi returnate din motive
                de protecție a sănătății și igienă. Mierea și produsele apicole desigilate (borcan
                deschis, sigiliu rupt) nu pot fi returnate. Produsele sigilate, în starea în care au fost
                livrate, pot fi returnate fără probleme.
              </p>
              <p>Pentru exercitarea dreptului de retragere:</p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>notificați-ne în scris la faguruldeaur@gmail.com, în termenul de 14 zile, menționând numărul comenzii;</li>
                <li>expediați produsele înapoi în maximum 14 zile de la notificare, la adresa comunicată de noi;</li>
                <li>costul direct al returnării este suportat de Cumpărător.</li>
              </ol>
              <p>
                Rambursarea integrală (inclusiv costul livrării standard inițiale) se efectuează în
                maximum 14 zile de la notificarea retragerii, prin aceeași metodă de plată folosită la
                comandă, dar nu înainte de primirea produselor returnate sau a dovezii expedierii lor.
              </p>
            </Section>

            <Section id="garantii" title="8. Garanții și conformitate">
              <p>
                Toate Produsele beneficiază de garanția legală de conformitate prevăzută de OUG nr.
                140/2021. Produsele alimentare au înscris pe etichetă data de valabilitate / data durabilității
                minimale.
              </p>
              <p>
                Fagurul de Aur garantează că mierea comercializată este <strong className="text-text-primary">100%
                naturală</strong>, fără adaosuri de zahăr, siropuri sau alte substanțe. În cazul în care un
                produs prezintă neconformități la livrare (ambalaj deteriorat, produs greșit), vă rugăm să
                ne contactați în cel mult 48 de ore de la primire — îl înlocuim sau restituim contravaloarea,
                pe cheltuiala noastră.
              </p>
              <p>
                Cristalizarea mierii este un proces natural care atestă autenticitatea produsului și nu
                reprezintă un defect sau o neconformitate.
              </p>
            </Section>

            <Section id="raspundere" title="9. Limitarea răspunderii">
              <p>
                Vânzătorul depune toate eforturile pentru ca informațiile de pe Site să fie corecte și
                actualizate, însă nu garantează că Site-ul este lipsit de erori sau întreruperi de
                funcționare.
              </p>
              <p>
                Vânzătorul nu răspunde pentru întârzieri sau neexecutări cauzate de evenimente de forță
                majoră (calamități, restricții legale, întreruperi majore ale serviciilor de curierat
                etc.), pentru perioada în care acestea acționează.
              </p>
              <p>
                Informațiile despre beneficiile produselor apicole au caracter informativ și nu
                înlocuiesc sfatul medical. Produsele apicole pot provoca reacții alergice persoanelor
                sensibile; nu se recomandă administrarea mierii copiilor sub 1 an.
              </p>
            </Section>

            <Section id="proprietate" title="10. Proprietate intelectuală">
              <p>
                Întregul conținut al Site-ului — texte, imagini, ilustrații, logo-uri, elemente de design,
                structură și cod — este proprietatea Fagurul de Aur S.R.L. sau a partenerilor săi și este
                protejat de legislația privind drepturile de autor și proprietatea intelectuală.
              </p>
              <p>
                Este interzisă copierea, reproducerea, distribuirea sau utilizarea în scop comercial a
                oricărui element al Site-ului fără acordul scris prealabil al Fagurul de Aur.
              </p>
            </Section>

            <Section id="litigii" title="11. Soluționarea litigiilor">
              <p>
                Orice neînțelegere va fi soluționată, în primul rând, pe cale amiabilă. Ne puteți contacta
                la faguruldeaur@gmail.com — răspundem în maximum 3 zile lucrătoare.
              </p>
              <p>
                Dacă soluționarea amiabilă nu este posibilă, consumatorii se pot adresa:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-text-primary">ANPC</strong> — Autoritatea Națională pentru
                  Protecția Consumatorilor:{" "}
                  <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:underline">anpc.ro</a>
                  {" "}· Direcția de Soluționare Alternativă a Litigiilor (SAL);
                </li>
                <li>
                  <strong className="text-text-primary">Platforma europeană SOL</strong> (soluționarea
                  online a litigiilor):{" "}
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:underline">ec.europa.eu/consumers/odr</a>;
                </li>
                <li>instanțelor judecătorești competente din România.</li>
              </ul>
              <p>Prezentul contract este guvernat de legea română.</p>
            </Section>

            <Section id="dispozitii-finale" title="12. Dispoziții finale">
              <p>
                Dacă oricare dintre clauzele prezentului document este declarată nulă sau inaplicabilă,
                celelalte clauze rămân în vigoare.
              </p>
              <p>
                Prelucrarea datelor cu caracter personal este detaliată în{" "}
                <Link href="/gdpr" className="text-gold-300 hover:underline">Politica de confidențialitate (GDPR)</Link>.
              </p>
              <p>
                Pentru orice întrebări legate de acești termeni, ne puteți scrie la{" "}
                <strong className="text-text-primary">faguruldeaur@gmail.com</strong> sau prin{" "}
                <Link href="/contact" className="text-gold-300 hover:underline">formularul de contact</Link>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
