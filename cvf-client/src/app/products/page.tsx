"use client";

import PromoStripLoader from "@/components/home/PromoStripLoader";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export default function ProductsPage() {
  return (
    <>
      <PromoStripLoader />
      <main className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <ProductsPageClient />
      </main>
    </>
  );
}