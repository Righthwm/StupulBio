export interface ProductVariant {
  weight?: string;
  type?: string;
  price: number;
  /** Shipping weight in kg (gross, incl. jar + packaging). Used for courier tariff. */
  weightKg?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "miere" | "apicole";
  subcategory?: string;
  description: string;
  longDescription: string;
  price: number;
  priceUnit: string;
  variants: ProductVariant[];
  color: string;
  badge?: string;
  badgeColor?: "gold" | "green" | "amber";
  /** Optional promo badge shown in the opposite corner (e.g. a bundle offer). */
  offerBadge?: string;
  inStock: boolean;
  tags: string[];
  benefits: string[];
  origin: string;
  harvest: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  text: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: ProductVariant;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  author: string;
  city: string;
  rating: number;
  text: string;
}

export type FilterCategory = "toate" | "miere" | "apicole";
export type SortOption = "recomandate" | "pret-asc" | "pret-desc" | "nou";
