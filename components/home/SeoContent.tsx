import Link from "next/link";
import { HexPattern } from "@/components/ui/HexPattern";

/** FAQ pairs — shared with the homepage so the visible Q&A and the FAQPage
 *  structured data never drift apart. */
export const homeFaqs: { q: string; a: string }[] = [
  {
    q: "Ce înseamnă miere naturală pură (raw honey)?",
    a: "Mierea naturală pură, sau raw honey, este miere crudă, neîncălzită și neprelucrată, extrasă la rece direct din fagure. Nu este pasteurizată și nu i se adaugă zahăr, sirop sau aditivi, astfel încât enzimele, antioxidanții și flavonoidele rămân intacte. Toată mierea Fagurul de Aur este 100% naturală și pură.",
  },
  {
    q: "De ce cristalizează mierea naturală?",
    a: "Cristalizarea este un proces natural prin care glucoza din miere se solidifică în timp — un semn de autenticitate, nu un defect. Mierea de salcâm cristalizează lent, iar mierea de tei sau polifloră mai repede. O miere care nu cristalizează niciodată poate fi încălzită excesiv sau falsificată.",
  },
  {
    q: "Care sunt beneficiile mierii poliflora?",
    a: "Mierea polifloră provine din nectarul a zeci de flori de câmp, fiind bogată în enzime, antioxidanți, polen și minerale. Susține imunitatea, oferă energie și are un gust complex. Fiind un cules diversificat, concentrează biodiversitatea pajiștilor românești.",
  },
  {
    q: "Cum recunosc o miere naturală, recoltată manual?",
    a: "Mierea naturală recoltată manual provine dintr-o stupină gestionată fără antibiotice și fără tratamente chimice, cu extracție la rece prin centrifugare. Fagurul de Aur garantează puritatea fiecărui borcan și emite factură fiscală pentru fiecare comandă.",
  },
  {
    q: "Cât durează livrarea mierii în România?",
    a: "Livrăm prin curier rapid în toată România, de regulă în 24–48 de ore lucrătoare. Comenzile peste 200 lei beneficiază de transport gratuit. Poți comanda miere naturală online cu plata cu cardul sau ramburs la livrare.",
  },
];

/** Long-form, keyword-rich content block for the homepage (helps topical SEO). */
export function SeoContent() {
  return (
    <section
      aria-labelledby="de-ce-noi"
      className="relative bg-bg-secondary border-t border-gold-400/10 overflow-hidden"
    >
      <HexPattern opacity={0.02} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <span className="block w-12 h-px bg-gold-400 mb-5" aria-hidden="true" />
        <h2 id="de-ce-noi" className="font-heading text-text-primary mb-6" style={{ fontSize: "clamp(1.7rem,3.2vw,2.4rem)" }}>
          De ce să alegi mierea naturală Fagurul de Aur
        </h2>

        <div className="space-y-5 text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">Fagurul de Aur</strong> este o stupină de familie din
            Gorj, unde producem <strong className="text-text-primary">miere naturală pură, 100% curată</strong>,
            din 2009. Albinele noastre culeg nectar din salcâm, tei, flori de munte și pajiști poliflore,
            iar noi recoltăm mierea <strong className="text-text-primary">manual</strong>, prin extracție la
            rece din fagure. Așa obținem <strong className="text-text-primary">miere crudă (raw honey)</strong>,
            neîncălzită și neprelucrată, în care enzimele, polenul, antioxidanții și flavonoidele rămân vii.
          </p>
          <p>
            Practicăm o apicultură pastorală: mutăm stupii după înflorire, de la salcâm la tei și sus, în
            pajiștile alpine, pentru ca albinele să aibă acces la flori curate, departe de poluare. Nu folosim
            antibiotice, zahăr sau aditivi — doar miere de albine pură, așa cum o lasă natura, cu propolis,
            polen și ceară ca produse apicole adiacente.
          </p>

          <h3 className="font-heading text-text-primary text-xl pt-2">Miere pură, recoltată manual în România</h3>
          <p>
            Fiecare borcan poartă amprenta culesului din care provine. Mierea de salcâm cristalizează lent și
            are aromă delicată; mierea de tei este calmantă și aromatică; mierea de munte concentrează plante
            medicinale alpine; iar mierea polifloră oferă gustul complet al verii românești. Descoperă întreaga
            gamă în <Link href="/magazin" className="text-gold-300 hover:underline">magazinul nostru de miere naturală</Link>{" "}
            sau află <Link href="/despre-noi" className="text-gold-300 hover:underline">povestea stupinei Fagurul de Aur</Link>.
          </p>

          <h3 className="font-heading text-text-primary text-xl pt-2">Garanție de puritate și calitate</h3>
          <p>
            Suntem un producător de miere din România care pune calitatea înaintea cantității. Mierea noastră
            este miere curată, recoltată responsabil, fără aditivi și fără încălzire, cu
            <strong className="text-text-primary"> garanție de puritate</strong>. Cristalizarea naturală, gustul
            autentic și aroma florală sunt dovada că ai în față miere neprelucrată, recoltată cu grijă. Comandă
            online cu livrare în 24–48h în toată țara.
          </p>
        </div>

        {/* FAQ */}
        <h2 className="font-heading text-text-primary mt-16 mb-6" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>
          Întrebări frecvente despre mierea naturală
        </h2>
        <div className="divide-y divide-gold-400/10 border-t border-gold-400/10">
          {homeFaqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                <h3 className="font-heading text-text-primary text-lg">{f.q}</h3>
                <span className="text-gold-400 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
              </summary>
              <p className="text-text-secondary leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
