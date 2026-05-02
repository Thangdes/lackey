import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type {
  BannerItem,
  HeroSlide,
  TestimonialItem,
  ValuePropItem,
  SiteContentDto,
} from "@/type/site-content";

// Re-export for consumers
export type { BannerItem, HeroSlide, TestimonialItem, ValuePropItem, SiteContentDto };

const mapBanner = (it: SiteContentDto): BannerItem => ({
  imageUrl: it.thumbnailUrl || "",
  alt: it.title,
});

const mapHeroSlide = (it: SiteContentDto): HeroSlide => ({
  id: it.id,
  title: it.title || "",
  subtitle: it.content,
  ctaText: it.authorTitle || "XEM THÊM",
  ctaLink: it.linkUrl || "/products",
  imageUrl: it.thumbnailUrl || "",
  textPosition: (it.authorName as "left" | "center" | "right") || "left",
});

const mapTestimonial = (it: SiteContentDto): TestimonialItem => ({
  id: it.id,
  name: it.authorName || it.testimonial_name || it.title,
  content: it.content || "",
  rating: typeof it.starNumber === "number" ? Math.max(1, Math.min(5, Math.round(it.starNumber))) : 5,
  role: it.authorTitle,
  imageUrl: it.thumbnailUrl,
});

const mapValueProp = (it: SiteContentDto): ValuePropItem => ({
  icon: it.authorName || "🎨",
  title: it.title || "",
  description: it.content || "",
  ctaHref: it.linkUrl,
  ctaLabel: it.authorTitle,
});

export const siteContentService = {
  getBanners: async (): Promise<BannerItem[]> => {
    const data = await http.get<SiteContentDto[]>(API.siteContent.banners);
    return (data || [])
      .filter((d) => !!d?.thumbnailUrl)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(mapBanner);
  },
  getTestimonials: async (): Promise<TestimonialItem[]> => {
    const data = await http.get<SiteContentDto[]>(API.siteContent.testimonials);
    return (data || [])
      .filter((d) => !!(d?.content) && (d?.authorName || d?.testimonial_name))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(mapTestimonial);
  },
  getValueProps: async (): Promise<ValuePropItem[]> => {
    try {
      const data = await http.get<SiteContentDto[]>(`${API.siteContent.banners}?type=VALUE_PROP`);
      return (data || [])
        .filter((d) => d?.type === "VALUE_PROP" && !!d?.title && !!d?.content)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(mapValueProp);
    } catch {
      return [];
    }
  },
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const data = await http.get<SiteContentDto[]>(API.siteContent.banners);
      return (data || [])
        .filter((d) => d?.type === "BANNER" && !!d?.thumbnailUrl && !!d?.title)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(mapHeroSlide);
    } catch {
      return [];
    }
  },
  getKeychainGallery: async (): Promise<Array<{ imageUrl: string; title?: string }>> => {
    try {
      const data = await http.get<SiteContentDto[]>(API.siteContent.gallery);
      return (data || [])
        .filter((d) => !!d?.thumbnailUrl)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((it) => ({ imageUrl: it.thumbnailUrl as string, title: it.title }));
    } catch {
      return [];
    }
  },
};
