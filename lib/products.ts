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
      "Mierea de salcâm este una dintre cele mai apreciate și rafinate soiuri de miere naturală din lume. Recoltată din florile albe, parfumate, ale salcâmilor din câmpiile și dealurile României, se distinge prin culoarea aproape transparentă și gustul delicat floral care persistă subtil pe palat.\n\n## Proprietățile mierii de salcâm\n\nDatorită conținutului ridicat de fructoză, mierea de salcâm cristalizează foarte lent, menținându-și forma lichidă ani întregi. Această caracteristică o face ideală pentru îndulcit ceaiuri, preparate culinare și băuturi reci, fără a altera gustul rețetei. Aroma fină și aciditatea scăzută o fac blândă cu stomacul.\n\n## Recoltată manual, extrasă la rece\n\nFagurul de Aur recoltează mierea de salcâm exclusiv în perioada înfloririi, între mai și iunie, când florile sunt la apogeu. Extracția este manuală, prin centrifugare la rece, fără procesare chimică sau termică — astfel mierea rămâne crudă și neîncălzită, cu enzimele, polenul și aromele naturale intacte.\n\n## Beneficii și pentru cine este potrivită\n\nBogată în antioxidanți, flavonoide și compuși cu rol antibacterian natural, mierea de salcâm susține organismul și oferă energie de durată. Este ideală pentru copii, sportivi și pentru oricine face trecerea de la zahăr la o miere naturală pură. Comandă miere de salcâm direct de la stupină, cu livrare în 24–48h.",
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
      "Mierea de tei este celebră pentru aroma sa unică, inconfundabilă — o combinație de flori de tei, mentă ușoară și un fond dulce-aromatic care rămâne în memorie la prima degustare. Recoltată din livezile seculare de tei din România, în luna iulie când florile sunt în plină floare, mierea de tei captează esența verii românești.\n\n## Aromă și textură\n\nCuloarea mierii proaspete variază de la galben-pai deschis la auriu, iar la cristalizare devine albă-cremoasă — un semn al autenticității și al naturaleței. Structura cristalelor fine îi conferă o textură apetisantă, perfectă pentru tartine sau pentru îndulcit ceaiul.\n\n## Efectul calmant al mierii de tei\n\nApreciată de generații pentru efectul său calmant, mierea de tei este alegerea preferată seara, înainte de culcare. O linguriță într-un ceai călduț (nu fierbinte) ajută la liniștirea gâtului iritat și la un somn mai odihnitor. Conține enzime și compuși bioactivi specifici culesului de tei.\n\n## Recoltare manuală, miere crudă\n\nFagurul de Aur recoltează mierea de tei direct de lângă pădurile seculare de tei, unde albinele au acces aproape exclusiv la florile de tei, garantând autenticitatea soiului. Extracția se face la rece, fără încălzire, pentru o miere naturală pură, neprelucrată. Comandă miere de tei cu livrare în 24–48h.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#D4A827",
    image: "/images/products/miere-tei.webp",
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
      "Mierea polifloră este expresia cea mai bogată a diversității florale a României — o compoziție naturală complexă, rezultată din nectarul a zeci de specii de flori sălbatice și cultivate: trifoi, mentă, lavandă, sunătoare, floarea-soarelui, cicoare, salvie și multe altele.\n\n## De ce fiecare borcan este unic\n\nFiecare borcan de miere polifloră poartă amprenta sezonului și a locului în care a fost recoltată. Această variație nu este un minus, ci dovada autenticității și a unui proces complet natural. Gustul este complex, cu note florale, ușor caramelizate, o dulceață echilibrată și un postgust cald.\n\n## Valoare nutritivă și beneficii\n\nBogată în enzime, vitamine din grupul B, vitamina C și minerale (calciu, magneziu, potasiu), mierea polifloră are o valoare nutritivă remarcabilă. Diversitatea culesului înseamnă o paletă largă de antioxidanți și flavonoide, motiv pentru care este apreciată ca tonic general, consumată dimineața, pe stomacul gol.\n\n## Miere crudă, recoltată manual\n\nMierea noastră polifloră este recoltată manual din pajiștile înflorite ale României și extrasă la rece, fără încălzire. Cristalizarea este medie spre rapidă, iar textura finală devine cremoasă și ușor granulată — semnul unei mieri naturale, neprelucrate. Comandă miere polifloră cu livrare rapidă în toată țara.",
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
      "Mierea de munte este cea mai valoroasă și complexă producție a stupinei noastre. Recoltată din florile pajiștilor alpine de la 800 de metri altitudine, în zona Retezat–Hunedoara, mierea de munte reprezintă un adevărat concentrat de biodiversitate montană.\n\n## Un cules din plante alpine\n\nAlbinele noastre culeg nectarul din plante de munte rare: cimbrișor de munte, sunătoare, anghelică, isop, arnică și zeci de alte specii care cresc la altitudini ridicate, departe de culturi agricole sau surse de poluare. De aici provine profilul ei aromatic unic.\n\n## Gust, culoare și cristalizare\n\nCuloarea intensă, brun-aurie, și gustul puternic, aromatic, cu note de rășină și ierburi montane, fac din această miere o experiență gustativă de neuitat. Cristalizarea este medie, cu o textură grosieră, caracteristică mierii naturale de calitate superioară.\n\n## Tonic apreciat tradițional\n\nMierea de munte este apreciată de generații în zonele montane ale Europei ca tonic general și sprijin natural pentru organism, mai ales în sezonul rece. Bogată în antioxidanți și compuși bioactivi, este o miere crudă, neîncălzită, recoltată manual. Comandă miere de munte premium direct de la stupină.",
    price: 30,
    priceUnit: "1kg",
    variants: [
      { weight: "1kg", price: 30, weightKg: 1.4 },
    ],
    color: "#8B5E0A",
    image: "/images/products/miere-munte.webp",
    badge: "Premium",
    badgeColor: "gold",
    inStock: true,
    tags: ["munte", "montana", "medicinala", "premium"],
    benefits: ["Cules din plante alpine rare", "Apreciată ca tonic", "Biodiversitate montană"],
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
      "Mierea de mană este un produs apicol cu totul special, diferit de toate celelalte soiuri de miere. Spre deosebire de mierea florală, care provine din nectar, mierea de mană este produsă de albine din secrețiile dulci ale plantelor — în principal conifere și foioase precum bradul, molidul și stejarul.\n\n## O miere ușor de recunoscut\n\nCuloarea sa este imediat recognoscibilă: brun-închis, aproape negru, cu reflexe verzui sau roșiatice. Gustul este intens, ușor amărui, cu note de caramel, rășini și ierburi — o experiență gustativă pentru cunoscători, foarte diferită de mierea de salcâm sau de tei.\n\n## Bogată în minerale\n\nDin punct de vedere nutritiv, mierea de mană este superioară majorității soiurilor florale: conține cantități semnificativ mai mari de minerale (magneziu, calciu, potasiu, fier), oligoelemente și antioxidanți de tip polifenoli. Este apreciată tradițional în Austria, Germania și Elveția ca tonic și pentru proprietățile sale prebiotice naturale.\n\n## Producție limitată\n\nCantitățile disponibile sunt mici — stupina noastră produce miere de mană doar în anii cu condiții climatice favorabile. Este o miere crudă, neîncălzită, recoltată manual și extrasă la rece. O miere naturală rară, pentru cei care caută autenticul.",
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
      "Mierea de rapiță se recunoaște ușor prin culoarea albă sau galben-pai deschis și textura cremoasă rezultată din cristalizarea rapidă — de obicei în câteva săptămâni de la extracție. Departe de a fi un defect, această cristalizare este o dovadă a autenticității sale.\n\n## Gust delicat, ideal pentru început\n\nRecoltată din câmpurile de rapiță înflorită din jurul stupinei noastre în lunile aprilie–mai, mierea de rapiță are un gust dulce, fin, ușor vanilat, fără notele puternice ale mierii de tei sau de mană. Este o miere naturală accesibilă ca gust, perfectă pentru cei care fac trecerea de la zahăr la miere.\n\n## Energie și valoare nutritivă\n\nDin punct de vedere nutrițional, mierea de rapiță este bogată în glucoză (de aici cristalizarea rapidă și textura cremoasă), vitamina C, magneziu și antioxidanți. Oferă energie rapidă, fiind preferată de sportivi și de cei activi.\n\n## Recoltată curat, fără tratamente chimice\n\nFagurul de Aur produce mierea de rapiță fără antibiotice și fără substanțe chimice. Deoarece rapița înflorește devreme în primăvară, înaintea altor culturi, culesul albinelor rămâne curat. O miere crudă, recoltată manual și extrasă la rece — comandă cu livrare în 24–48h.",
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
      "Mierea cu capaceală (sau mierea în fagure) este forma cea mai pură a mierii artizanale — niciun proces de extracție, nicio intervenție umană după ce albinele au sigilat celulele cu ceară naturală. Este mierea exact așa cum a lăsat-o natura, direct din fagure.\n\n## Maximă autenticitate\n\nCapacele de ceară albă (sau ușor gălbuie) sigilează ermetic fiecare celulă plină cu miere matură, fără ca aceasta să intre în contact cu aerul sau umiditatea. Când rupi o secțiune de fagure, se eliberează un parfum intens de miere proaspătă și ceară naturală — o aromă de neegalat.\n\n## Cum se consumă\n\nSe consumă mâncând direct fagurele: ceara de albine este 100% naturală și comestibilă. Poți și să extragi mierea apăsând fagurele pe o sită, sau să mesteci ceara ca pe o gumă naturală. Este o experiență completă a mierii crude, neprelucrate.\n\n## Producție limitată\n\nMierea cu capaceală necesită faguri construiți special și o gestionare atentă a stupului, motiv pentru care producția este redusă. Reprezintă produsul cu cea mai mare valoare din gama Fagurul de Aur. Fiecare cutie conține aproximativ 1kg de fagure natural, recoltat manual în Gorj.",
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
      "Propolis pur din stupina noastră, dizolvat în alcool de 70°. Produs apicol apreciat tradițional pentru gât și imunitate.",
    longDescription:
      "Tinctura de propolis este unul dintre cele mai apreciate produse apicole din tradiția populară. Propolisul este o substanță rășinoasă pe care albinele o produc prelucrând mugurii copacilor și seva plantelor, amestecate cu secreții proprii. În stup, albinele îl folosesc pentru a izola și a proteja fagurele.\n\n## Cum este preparată tinctura\n\nTinctura noastră este preparată din propolis brut, cules direct din stupii proprii, dizolvat în alcool de 70 de grade. Concentrația ridicată păstrează intacți compușii naturali ai propolisului — flavonoide, acizi fenolici și uleiuri esențiale.\n\n## Proprietăți apreciate tradițional\n\nPropolisul este apreciat de secole pentru proprietățile sale antibacteriene și antioxidante naturale. Este folosit tradițional în sezonul rece, pentru confortul gâtului iritat și al cavității bucale, precum și ca sprijin general pentru organism. Informațiile au caracter general și nu înlocuiesc sfatul medicului.\n\n## Mod de utilizare\n\n20–30 de picături în apă sau ceai, de 2–3 ori pe zi. Nu se administrează copiilor sub 2 ani sau persoanelor alergice la produse apicole. Se combină excelent cu o linguriță de miere de tei sau de munte.",
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
    benefits: ["Proprietăți antibacteriene naturale", "Apreciat pentru imunitate", "Folosit tradițional pentru gât"],
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
