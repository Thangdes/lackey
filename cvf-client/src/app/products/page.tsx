"use client";

import PromoStripLoader from "@/components/home/PromoStripLoader";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export default function ProductsPage() {
  return (
    <>
      <PromoStripLoader />
      <main className="">
        <ProductsPageClient />
      </main>
    </>
  );
}