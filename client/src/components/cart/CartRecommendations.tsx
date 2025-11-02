"use client";

import React, { useEffect, useState } from "react";
import ProductCarousel from "@/components/home/ProductCarousel";

export default function CartRecommendations() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <section className="mt-10 -mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 2xl:-mx-24">
        <ProductCarousel title={undefined} pageSize={12} />
    </section>
  );
}
