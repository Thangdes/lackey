import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClientView from "@/components/products/ProductClientView";
import { productService } from "@/service/product.service";
import { getProductSeo } from "@/config/seo";
import { siteConfig } from "@/constant/site";
 

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  try {
    const product = await productService.getBySlug(slug);
    if (!product || !product.id) return notFound();
    return <ProductClientView product={product} />;
  } catch {
    return notFound();
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await productService.getBySlug(slug);
    if (product) return getProductSeo(product);
  } catch {}
  const url = `${siteConfig.url}/products/${slug}`;
  return {
    title: `Sản phẩm`,
    description: siteConfig.default.description,
    alternates: { canonical: url },
    openGraph: {
      url,
      siteName: siteConfig.name,
      title: `Sản phẩm`,
      description: siteConfig.default.description,
    },
  };
}



