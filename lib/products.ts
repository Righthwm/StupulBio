import type { Product, Review } from "@/types";

export const products: Product[] = [
  {
    id: "miere-salcam",
    slug: "miere-salcam",
    name: "Miere de Salcâm",
    category: "miere",
    subcategory: "florala",
    description:
      "Miere lichidă, cristalizare lentă, aromă delicată florală. Ideală pentru ceai și deserturi.",
    longDescription:
      "Mierea de salcâm este una dintre cele mai apreciate și rafinate soiuri de miere din lume. Recoltată din florile albe parfumate ale salcâmilor din câmpiile și dealurile României, această miere se distinge printr-o culoare aproape transparentă și un gust delicat floral care persistă subtil pe palat.\n\nDatorită conținutului ridicat de fructoză, mierea de salcâm cristalizează foarte lent, menținându-și forma lichidă ani întregi. Această caracteristică o face ideală pentru îndulcit ceaiuri, preparate culinare dulci și băuturi reci, fără a altera gustul original al rețetei.\n\nFagurul de Aur recoltează mierea de salcâm exclusiv în perioada înfloririi, dintre mai și iunie, când florile sunt la apogeu. Procesul de extracție este manual, prin centrifugare la rece, fără nicio formă de procesare chimică sau termică, pentru a păstra intactă valoarea nutritivă și aromele naturale.\n\nBogată în antioxidanți, flavonoizi și compuși antimicrobieni, mierea de salcâm susține sistemul imunitar și oferă energie susținută. Este ideală pentru copii, sportivi și oricine dorește să adopte un stil de viață natural și sănătos.",
    price: 45,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 45, weightKg: 1.4 },
      { type: "Pachet 5 borcane (5kg)", price: 200, weightKg: 7 },
    ],
    color: "#E8C44A",
    badge: "Bestseller",
    badgeColor: "gold",
    offerBadge: "Ofertă",
    inStock: true,
    tags: ["salcam", "acacia", "lichida", "florala"],
    benefits: ["Antibacteriană naturală", "Bogată în fructoză", "Cristalizare lentă"],
    origin: "Câmpia Dunării",
    harvest: "Mai–Iunie 2024",
    rating: 4.9,
    reviewCount: 127,
    featured: true,
  },
  {
    id: "miere-tei",
    slug: "miere-tei",
    name: "Miere de Tei",
    category: "miere",
    subcategory: "florala",
    description:
      "Aromă inconfundabilă de flori de tei, ușor mentolată. Renumită pentru proprietățile calmante și relaxante.",
    longDescription:
      "Mierea de tei este celebră pentru aroma sa unică, inconfundabilă — o combinație de flori de tei, mentă ușoară și un fond dulce-aromatic care rămâne în memorie la prima degustare. Recoltată din livezile seculare de tei din România, în luna iulie când florile sunt în plină floare, această miere captează esența verii românești.\n\nCunoscută de secole ca remediu natural pentru anxietate, insomnie și stres, mierea de tei conține compuși bioactivi care susțin relaxarea sistemului nervos. O lingură de miere de tei în ceai cald, seara înainte de culcare, poate îmbunătăți calitatea somnului în mod semnificativ.\n\nCuloarea mierii proaspete variază de la galben-pai deschis la auriu, iar la cristalizare devine albă cremoasă — un semn al purității și naturalității. Structura cristalelor fine îi conferă o textură apetisantă, perfectă pentru tartine cu unt.\n\nFagurul de Aur recoltează mierea de tei direct de lângă pădurile seculare de tei, unde albinele au acces exclusiv la florile de tei, garantând autenticitatea soiului.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#D4A827",
    badge: "Calmant natural",
    badgeColor: "gold",
    inStock: true,
    tags: ["tei", "calmant", "relaxant", "somn"],
    benefits: ["Efect calmant natural", "Sprijină somnul", "Aromă inconfundabilă"],
    origin: "Livezi seculare de tei, România",
    harvest: "Iulie 2024",
    rating: 4.8,
    reviewCount: 89,
    featured: true,
  },
  {
    id: "miere-poliflora",
    slug: "miere-poliflora",
    name: "Miere Polifloră",
    category: "miere",
    subcategory: "poliflora",
    description:
      "Sinfonie de flori de câmp: trifoi, floarea soarelui, menta, lavandă. Gustul autentic al verii românești.",
    longDescription:
      "Mierea polifloră este expresia cea mai pură a diversității florale a României — o compoziție naturală complexă, rezultată din nectarul a zeci de specii de flori sălbatice și cultivate: trifoi, menta, lavandă, sunătoare, floarea soarelui, cicoare, salvie și multe altele.\n\nFiecare borcan de miere polifloră este unic, purtând amprenta sezonului și locului în care a fost recoltată. Aceasta nu este o caracteristică a lipsei de standarde, ci dimpotrivă — este dovada autenticității și a procesului natural.\n\nGustul este complex, cu note florale, ușor caramelizate, cu o dulceață echilibrată și un postgust cald. Cristalizarea este medie spre rapidă, textura finală fiind cremoasă și ușor granulată.\n\nBoagtă în enzime, vitamine din grupul B, vitamina C și minerale (calciu, magneziu, potasiu), mierea polifloră are o valoare nutritivă excepțională. Este ideal de consumat dimineața, pe stomacul gol, ca tonic general al organismului.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#C8851A",
    badge: undefined,
    inStock: true,
    tags: ["poliflora", "florala", "trifoi", "vara"],
    benefits: ["Bogată în enzime", "Tonic general", "Aromă complexă"],
    origin: "Câmpii înflorite, România",
    harvest: "Iulie–August 2024",
    rating: 4.7,
    reviewCount: 64,
    featured: false,
  },
  {
    id: "miere-munte",
    slug: "miere-munte",
    name: "Miere de Munte",
    category: "miere",
    subcategory: "montana",
    description:
      "Culeasă de la 800m altitudine, din pajiști alpine virgine. Concentrat de plante medicinale montane.",
    longDescription:
      "Mierea de munte este cea mai valoroasă și complexă producție a stupinei noastre. Recoltată din florile pajiștilor alpine de la 800 de metri altitudine, în zona Retezat–Hunedoara, această miere reprezintă un adevărat concentrat de biodiversitate montană.\n\nAlbinele noastre culeg nectarul din plante medicinale rare: rozmarin sălbatic, anghelică, isop, cimbrișor de munte, sunătoare, arnica și zeci de alte specii care cresc exclusiv la altitudini ridicate, departe de orice cultură agricolă sau sursă de poluare.\n\nCuloarea intensă, brun-aurie, și gustul puternic, aromatic, cu note de rășină, ierburi montane și miere de flori sălbatice, fac din această miere o experiență gustativă de neuitat. Cristalizarea este medie, cu o textură grosieră, caracteristică mierii de calitate superioară.\n\nValoarea terapeutică a mierii de munte este recunoscută de medicina tradițională din toate culturile montane ale Europei. Este recomandată ca adjuvant în afecțiunile respiratorii, pentru întărirea sistemului imunitar și ca tonic general al organismului.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#8B5E0A",
    badge: "Premium",
    badgeColor: "gold",
    inStock: true,
    tags: ["munte", "montana", "medicinala", "premium"],
    benefits: ["Plante medicinale alpine", "Înaltă valoare terapeutică", "Biodiversitate montană"],
    origin: "Munții Retezat, 800m alt.",
    harvest: "August 2024",
    rating: 4.9,
    reviewCount: 112,
    featured: true,
  },
  {
    id: "miere-mana",
    slug: "miere-mana",
    name: "Miere de Mană",
    category: "miere",
    subcategory: "mana",
    description:
      "Produsă din secrețiile plantelor, nu din nectar floral. Gust intens, ușor amarui. Rară și excepțional de sănătoasă.",
    longDescription:
      "Mierea de mană este un produs apicol cu totul special, deosebit de toate celelalte soiuri de miere. Spre deosebire de mierea obișnuită, care provine din nectarul floral, mierea de mană este produsă de albine din secrețiile dulci ale insectelor și ale plantelor (în principal conifere și foioase ca stejarul, bradul, molidul).\n\nCuloarea sa este o caracteristică imediat recognoscibilă: brun-închis, aproape negru, cu reflexe verzui sau roșiatice. Gustul este intens, ușor amarui, cu note de caramel ars, rășini și ierburi — o experiență gustativă pentru cunoscători.\n\nDin punct de vedere nutritiv, mierea de mană este superioară majorității soiurilor de miere florale: conține cantități semnificativ mai mari de minerale (magneziu, calciu, potasiu, fier), oligoelemente și antioxidanți de tip polifenoli.\n\nEste deosebit de apreciată în medicina tradițională din Austria, Germania și Elveția pentru proprietățile prebiotice, antibacteriene și imunostimulatoare. Cantitățile disponibile sunt limitate — stupul nostru produce miere de mană doar în anii cu condiții climatice favorabile.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#4A3520",
    badge: "Rară",
    badgeColor: "amber",
    inStock: true,
    tags: ["mana", "rara", "conifere", "minerale"],
    benefits: ["Bogată în minerale", "Prebiotică naturală", "Producție limitată"],
    origin: "Păduri de conifere, România",
    harvest: "Septembrie 2024",
    rating: 4.8,
    reviewCount: 43,
    featured: false,
  },
  {
    id: "miere-rapita",
    slug: "miere-rapita",
    name: "Miere de Rapiță",
    category: "miere",
    subcategory: "florala",
    description:
      "Cristalizare rapidă, textură cremoasă albă. Gust dulce, ușor vanilat. Cea mai accesibilă miere naturală.",
    longDescription:
      "Mierea de rapiță este ușor de recunoscut prin culoarea sa albă sau galben-pai deschis și textura cremoasă rezultată din cristalizarea rapidă — de obicei în câteva săptămâni de la extracție. Această caracteristică nu este un defect, ci o dovadă a purității sale.\n\nRecoltată din câmpurile de rapiță înflorită care înconjoară stupina noastră în lunile aprilie-mai, această miere are un gust dulce, delicat, ușor vanilat, fără notele puternice ale mierii de tei sau de mană. Este o miere accesibilă ca gust, perfectă pentru cei care doresc să facă trecerea de la zahăr la miere naturală.\n\nDin punct de vedere nutrițional, mierea de rapiță este bogată în glucoză (ceea ce explică cristalizarea rapidă), vitamina C, magneziu și antioxidanți. Este recomandată în special pentru energizare rapidă și este preferată de sportivi.\n\nFagurul de Aur produce mierea de rapiță fără tratamente cu antibiotice sau substanțe chimice, garantând puritatea unui produs 100% natural. Deoarece rapița înflorește devreme în primăvară, înainte de orice altă cultură, polenul albinelor nu este contaminat.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#E8D44A",
    badge: undefined,
    inStock: true,
    tags: ["rapita", "cremoasa", "cristalizata", "primavara"],
    benefits: ["Textură cremoasă", "Energizant natural", "Gust delicat"],
    origin: "Câmpiile de rapiță, Oltenia",
    harvest: "Aprilie–Mai 2024",
    rating: 4.6,
    reviewCount: 58,
    featured: false,
  },
  {
    id: "miere-capaceala",
    slug: "miere-capaceala",
    name: "Miere cu Capaceală",
    category: "miere",
    subcategory: "fagure",
    description:
      "Miere în fagure natural, neextrasă, cu capaceală de ceară. Forma sa cea mai pură — exact cum o lasă albinele.",
    longDescription:
      "Mierea cu capaceală (sau mierea în fagure) este forma supremă a mierii artizanale — niciun proces de extracție, nicio intervenție umană după ce albinele au sigilat celulele cu ceară naturală. Este mierea în starea sa cea mai pură și mai autentică, exact cum a lăsat-o natura.\n\nCapacele de ceară albă (sau ușor gălbuie) sigilează hermatic fiecare celulă plină cu miere matură, garantând că nu a intrat în contact cu aerul, umiditatea sau orice alt factor exterior. Atunci când rupi o secțiune de fagure, se eliberează un parfum intens de miere proaspătă și ceară naturală — o aromă de neegalat.\n\nSe consumă mâncând direct fagurele — ceara de albine este 100% naturală și comestibilă, de fapt are proprietăți antibacteriene proprii. Poți de asemenea să extragi mierea apăsând fagurele pe o sită, sau să ții ceara în gură ca pe o gumă naturală.\n\nProducția de miere cu capaceală este limitată (necesită faguri construiți special și o gestionare atentă a stupului) și reprezintă produsul cu cea mai mare valoare din gama Fagurul de Aur. Fiecare cutie conține aproximativ 1kg de fagure natural.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg fagure", price: 30, weightKg: 1.4 },
    ],
    color: "#D4A017",
    badge: "Autentică",
    badgeColor: "gold",
    inStock: true,
    tags: ["capaceala", "fagure", "ceara", "naturala"],
    benefits: ["Neprelucrată", "Ceară naturală comestibilă", "Maximă autenticitate"],
    origin: "Gorj, România",
    harvest: "August 2024",
    rating: 5.0,
    reviewCount: 31,
    featured: false,
  },
  {
    id: "tinctura-propolis",
    slug: "tinctura-propolis",
    name: "Tinctură de Propolis",
    category: "apicole",
    description:
      "Propolis pur din stupina noastră, dizolvat în alcool de 70°. Antibacterian și imunostimulator natural.",
    longDescription:
      "Tinctura de propolis este unul dintre cele mai puternice remedii naturale cunoscute. Propolisul este un material rășinos pe care albinele îl produc prin prelucrarea mugurilor de copac și a sevei plantelor, amestecate cu secreții proprii. Albinele îl folosesc pentru a izola și dezinfecta stupul.\n\nTinctura noastră este preparată din propolis brut, cules direct din stupii proprii, dizolvat în alcool de 70 de grade (concentrație 30% propolis). Acesta este standardul de calitate al tincturii terapeutice.\n\nPrincipalele proprietăți demonstrate clinic: antibacterian cu spectru larg, antifungic, antiviral (eficient inclusiv împotriva virusurilor respiratorii), antiinflamator și imunostimulator. Utilizat preventiv în sezonul rece sau curativ în infecții respiratorii ușoare, afte bucale, dureri în gât.\n\nMod de utilizare: 20-30 de picături în apă sau ceai, de 2-3 ori pe zi. Nu se administrează copiilor sub 2 ani sau persoanelor alergice la produse apicole.",
    price: 15,
    priceUnit: "20ml",
    variants: [
      { weight: "20ml", price: 15, weightKg: 0.2 },
    ],
    color: "#6B3A1F",
    visual: "bottle",
    badge: "Imunitate",
    badgeColor: "green",
    inStock: true,
    tags: ["propolis", "tinctura", "imunitate", "antibacterian"],
    benefits: ["Antibacterian natural", "Imunostimulator", "Antiviral"],
    origin: "Stupina Fagurul de Aur",
    harvest: "An 2024",
    rating: 4.9,
    reviewCount: 76,
    featured: false,
  },
];

export const reviews: Record<string, Review[]> = {
  "miere-salcam": [
    {
      id: "r1",
      author: "Maria P.",
      city: "Cluj-Napoca",
      rating: 5,
      text: "Cea mai bună miere de salcâm pe care am gustat-o. Aromă delicată, culoare transparentă, exact ce mă așteptam. Comand de 2 ani și nu schimb.",
      date: "2024-09-15",
    },
    {
      id: "r2",
      author: "Alexandru D.",
      city: "București",
      rating: 5,
      text: "Excepțională! Am cumpărat pentru copii — îi adoră. Nu cristalizează, rămâne lichidă luni în șir. Recomand cu toată convingerea.",
      date: "2024-10-02",
    },
    {
      id: "r3",
      author: "Elena M.",
      city: "Timișoara",
      rating: 5,
      text: "Comandă onorată rapid, ambalaj îngrijit, miere superioară. Aroma e subtilă și nobilă. Merită fiecare leu.",
      date: "2024-10-20",
    },
  ],
  "miere-munte": [
    {
      id: "r4",
      author: "Ionuț C.",
      city: "Brașov",
      rating: 5,
      text: "Gust puternic, complex, ca o plimbare prin munți. Se simte că e recoltată de sus, din pajiști adevărate. Incredibilă!",
      date: "2024-09-28",
    },
    {
      id: "r5",
      author: "Andreea S.",
      city: "Sibiu",
      rating: 5,
      text: "Am cumpărat pentru imunitate și am rămas uimită de gust. Complet diferită de ce se găsește în supermarket. Asta e miere adevărată.",
      date: "2024-10-10",
    },
  ],
};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.subcategory === product.subcategory)
    )
    .slice(0, limit);
}
