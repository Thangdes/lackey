import { http } from "@/utils/http";
import { API } from "@/constant/api";

export type BannerItem = {
  imageUrl: string;
  alt?: string;
  href?: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  content: string;
  rating?: number;
  role?: string;
  imageUrl?: string;
};

export type SiteContentDto = {
  id: string;
  type: "BANNER" | "TESTIMONIAL";
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

const mapBanner = (it: SiteContentDto): BannerItem => ({
  imageUrl: it.thumbnailUrl || "",
  alt: it.title,
});

const mapTestimonial = (it: SiteContentDto): TestimonialItem => ({
  id: it.id,
  name: it.authorName || it.testimonial_name || it.title,
  content: it.content || "",
  rating: typeof it.starNumber === "number" ? Math.max(1, Math.min(5, Math.round(it.starNumber))) : 5,
  role: it.authorTitle,
  imageUrl: it.thumbnailUrl,
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
};
