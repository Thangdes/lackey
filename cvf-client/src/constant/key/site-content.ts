// Query keys for site content
export const siteContentKeys = {
  root: ["site-content"] as const,
  banners: () => [...siteContentKeys.root, "banners"] as const,
  testimonials: () => [...siteContentKeys.root, "testimonials"] as const,
};
