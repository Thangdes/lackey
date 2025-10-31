"use client";

import Banner from "@/components/home/Banner";
import { useBanners } from "@/hook/useSiteContent";

export default function BannerLoader() {
  const { data } = useBanners();
  const items = data ?? [];
  return <Banner items={items} disableFallback />;
}
