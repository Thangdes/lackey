"use client";

import Testimonials, { type Testimonial as UITestimonial } from "@/components/home/Testimonials";
import { useTestimonials } from "@/hook/useSiteContent";

export default function TestimonialsLoader() {
  const { data } = useTestimonials();
  const items = data ?? [];
  const uiItems: UITestimonial[] = (items || []).map((it, idx) => ({
    id: it.id || `t-${idx}`,
    name: it.name,
    content: it.content,
    rating: typeof it.rating === "number" ? Math.max(1, Math.min(5, Math.round(it.rating))) : 5,
    role: it.role,
    imageUrl: it.imageUrl,
    avatarUrl: undefined,
  }));
  return <Testimonials items={uiItems} disableFallback />;
}
