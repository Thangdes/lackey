



import type { Product } from "./product";
import type { Category } from "@/service/category.service";

export type ProductCarouselProps = {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  products: Product[];
  loading?: boolean;
  showViewAll?: boolean;
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
};

export type NewsletterProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  submitText?: string;
  className?: string;
};

export type RetroNewsletterProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  submitText?: string;
  className?: string;
};

export type RetroFAQProps = {
  title?: string;
  subtitle?: string;
  items?: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
};

export type CategoriesGridProps = {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  showDescription?: boolean;
  mobileLayout?: "grid" | "carousel";
  fallbackCategories?: Category[];
};

export type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  className?: string;
};

export type TestimonialsSectionProps = {
  title?: string;
  subtitle?: string;
  testimonials?: Array<{
    name: string;
    role?: string;
    content: string;
    avatar?: string;
    rating?: number;
  }>;
  className?: string;
};

export type FeaturesSectionProps = {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  className?: string;
};
