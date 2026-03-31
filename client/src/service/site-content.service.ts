import { http } from "@/utils/http";
import { API } from "@/constant/api";
import { unwrapDataArray } from "@/utils/response";
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
    try {
      const res = await http.get<unknown>(API.siteContent.banners);
      const data = unwrapDataArray<SiteContentDto>(res);
      return data
        .filter((d) => !!d?.thumbnailUrl)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(mapBanner);
    } catch {
      return [];
    }
  },
  getTestimonials: async (): Promise<TestimonialItem[]> => {
    try {
      const res = await http.get<unknown>(API.siteContent.testimonials);
      const data = unwrapDataArray<SiteContentDto>(res);
      return data
        .filter((d) => !!(d?.content) && (d?.authorName || d?.testimonial_name))
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(mapTestimonial);
    } catch {
      return [];
    }
  },
  getValueProps: async (): Promise<ValuePropItem[]> => {
    try {
      const res = await http.get<unknown>(`${API.siteContent.banners}?type=VALUE_PROP`);
      const data = unwrapDataArray<SiteContentDto>(res);
      return data
        .filter((d) => d?.type === "VALUE_PROP" && !!d?.title && !!d?.content)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(mapValueProp);
    } catch {
      return [];
    }
  },
  getHeroSlides: async (): Promise<HeroSlide[]> => {
    try {
      const res = await http.get<unknown>(API.siteContent.banners);
      const data = unwrapDataArray<SiteContentDto>(res);
      return data
        .filter((d) => d?.type === "BANNER" && !!d?.thumbnailUrl && !!d?.title)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(mapHeroSlide);
    } catch {
      return [];
    }
  },
  getProductGallery: async (): Promise<Array<{ imageUrl: string; title?: string }>> => {
    try {
      const res = await http.get<unknown>(API.siteContent.gallery);
      const data = unwrapDataArray<SiteContentDto>(res);
      return data
        .filter((d) => !!d?.thumbnailUrl)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((it) => ({ imageUrl: it.thumbnailUrl as string, title: it.title }));
    } catch {
      return [];
    }
  },
};
