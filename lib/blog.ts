// Blog metadata registry. Article bodies live in components/blog/articles.tsx,
// keyed by the same slug. Keeping metadata here (framework-neutral) lets the
// sitemap, listing page and article page share one source of truth.

export interface BlogPostMeta {
  slug: string;
  /** SEO <title> (50–60 chars). */
  title: string;
  /** Visible H1. */
  h1: string;
  /** Meta description (150–160 chars). */
  description: string;
  /** Short teaser for the listing page. */
  excerpt: string;
  /** ISO date published. */
  date: string;
  /** ISO date last updated (optional). */
  updated?: string;
  keywords: string[];
  readingMinutes: number;
  image: string;
  imageAlt: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "beneficii-miere-poliflora",
    title: "Beneficiile mierii poliflora: proprietăți și de ce să o alegi",
    h1: "Beneficiile mierii poliflora: de ce merită în alimentația ta",
    description:
      "Descoperă beneficiile mierii poliflora: enzime, antioxidanți, polen și minerale. Cum susține imunitatea și de ce mierea polifloră naturală e un superaliment românesc.",
    excerpt:
      "Enzime, antioxidanți, polen și minerale într-un singur borcan. Iată ce face din mierea polifloră unul dintre cele mai complete produse apicole naturale.",
    date: "2026-06-15",
    keywords: ["beneficii miere poliflora", "miere poliflora", "miere naturală", "antioxidanți", "polen"],
    readingMinutes: 5,
    image: "/images/musetel.png",
    imageAlt: "Flori de câmp poliflore, sursă de nectar pentru miere poliflora naturală",
  },
  {
    slug: "miere-cruda-vs-pasteurizata",
    title: "Miere crudă vs pasteurizată: diferențe și ce să alegi",
    h1: "Miere crudă vs miere pasteurizată: ce alegi și de ce",
    description:
      "Miere crudă (raw honey) sau pasteurizată? Află diferențele de enzime, antioxidanți și gust și de ce mierea neîncălzită, recoltată manual, este alegerea sănătoasă.",
    excerpt:
      "Pasteurizarea distruge enzimele vii din miere. Vezi de ce mierea crudă, neîncălzită și neprelucrată, păstrează toată valoarea naturală.",
    date: "2026-06-20",
    keywords: ["miere crudă", "raw honey", "miere pasteurizată", "miere neîncălzită", "miere neprelucrată"],
    readingMinutes: 6,
    image: "/images/fagure.jpg",
    imageAlt: "Fagure de miere căpăcit — miere crudă, neîncălzită, extrasă la rece",
  },
  {
    slug: "cum-recunosti-mierea-naturala",
    title: "Cum recunoști mierea naturală pură: 7 semne de autenticitate",
    h1: "Cum recunoști mierea naturală pură: 7 semne sigure",
    description:
      "7 metode simple prin care recunoști mierea naturală fără aditivi de cea falsificată: cristalizare, vâscozitate, aromă, etichetă. Ghid practic pentru miere naturală autentică.",
    excerpt:
      "Cristalizare, vâscozitate, aromă, etichetă — 7 semne practice prin care deosebești mierea naturală pură de cea cu zahăr sau sirop.",
    date: "2026-06-25",
    keywords: [
      "miere naturală fără aditivi",
      "cum recunoști mierea naturală",
      "miere pură",
      "miere falsificată",
      "miere naturală pură",
    ],
    readingMinutes: 7,
    image: "/images/products/miere-tei.webp",
    imageAlt: "Borcan de miere naturală de tei Fagurul de Aur, produsă în România",
  },
  {
    slug: "de-ce-cristalizeaza-mierea",
    title: "De ce cristalizează mierea naturală și ce înseamnă",
    h1: "De ce cristalizează mierea naturală și ce înseamnă",
    description:
      "Cristalizarea mierii este un semn de autenticitate, nu un defect. Află de ce cristalizează mierea, ce soiuri se zaharisesc mai repede și cum o readuci la consistență lichidă.",
    excerpt:
      "Mierea care se „zaharisește” nu e stricată — dimpotrivă. Iată de ce cristalizează mierea naturală și cum o folosești corect.",
    date: "2026-06-28",
    keywords: ["cristalizare miere", "miere zaharisită", "miere naturală", "miere de salcâm", "miere de munte"],
    readingMinutes: 5,
    image: "/images/products/miere-rapita.webp",
    imageAlt: "Borcan de miere de rapiță Fagurul de Aur, soi care cristalizează rapid și natural",
  },
  {
    slug: "beneficii-miere-de-salcam",
    title: "Miere de salcâm: beneficii, proprietăți și utilizări",
    h1: "Miere de salcâm: beneficii, proprietăți și utilizări",
    description:
      "Mierea de salcâm: beneficii, proprietăți și de ce cristalizează lent. Aromă delicată, ideală pentru copii, ceaiuri și deserturi. Miere de salcâm pură, recoltată manual.",
    excerpt:
      "Culoare deschisă, aromă delicată și cristalizare lentă — descoperă beneficiile mierii de salcâm și de ce este una dintre cele mai apreciate sortimente.",
    date: "2026-06-30",
    keywords: ["miere de salcâm", "beneficii miere salcâm", "miere salcâm cristalizare", "miere naturală"],
    readingMinutes: 5,
    image: "/images/products/miere-salcam.webp",
    imageAlt: "Borcan de miere de salcâm Fagurul de Aur, naturală, recoltată manual",
  },
  {
    slug: "propolis-ce-este-beneficii",
    title: "Propolis: ce este, beneficii și cum se folosește",
    h1: "Propolis: ce este, beneficii și cum se folosește",
    description:
      "Ce este propolisul, ce beneficii are și cum se folosește tinctura de propolis. Proprietăți antibacteriene naturale, sprijin pentru imunitate și gât, direct din stup.",
    excerpt:
      "Rășina prețioasă a stupului: află ce este propolisul, ce proprietăți are și cum folosești corect tinctura de propolis pentru imunitate.",
    date: "2026-07-02",
    keywords: ["propolis", "beneficii propolis", "tinctură de propolis", "propolis cum se folosește", "produse apicole"],
    readingMinutes: 6,
    image: "/images/products/tinctura-propolis.webp",
    imageAlt: "Tinctură de propolis Fagurul de Aur — produs apicol natural pentru imunitate",
  },
  {
    slug: "miere-pentru-tuse-si-imunitate",
    title: "Miere pentru tuse și imunitate: ce soiuri ajută",
    h1: "Miere pentru tuse și imunitate: ce soiuri te ajută",
    description:
      "Ce miere e bună pentru tuse și imunitate: tei, munte, polifloră și propolis. Cum folosești mierea naturală pentru gât iritat și apărarea organismului, fără a o încălzi.",
    excerpt:
      "Tei pentru gât iritat, munte pentru imunitate, propolis pentru apărare — vezi ce sortimente de miere naturală ajută la tuse și răceli.",
    date: "2026-07-04",
    keywords: ["miere pentru tuse", "miere pentru imunitate", "miere de tei tuse", "propolis imunitate", "miere naturală"],
    readingMinutes: 6,
    image: "/images/products/miere-tei.webp",
    imageAlt: "Miere de tei naturală, recomandată pentru gât iritat, tuse și imunitate",
  },
];

export function getPostMeta(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
