export type BannerItem = {
  imageUrl: string;
  alt?: string;
  href?: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  textPosition?: "left" | "center" | "right";
};

export type TestimonialItem = {
  id: string;
  name: string;
  content: string;
  rating?: number;
  role?: string;
  imageUrl?: string;
};

export type ValuePropItem = {
  icon: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type SiteContentDto = {
  id: string;
  type: "BANNER" | "TESTIMONIAL" | "VALUE_PROP" | "GALLERY";
  title: string;
  content?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  authorName?: string;
  authorTitle?: string;
  displayOrder: number;
  isPublished: boolean;
  starNumber?: number;
  testimonial_name?: string;
};
