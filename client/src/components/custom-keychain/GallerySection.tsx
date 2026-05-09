'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteContentService } from "@/service/site-content.service";

export function GallerySection() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await siteContentService.getProductGallery();
        if (!mounted) return;
        setImages((list || []).map((it) => it.imageUrl).filter(Boolean));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="container mx-auto px-4 md:px-6 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            MẪU THIẾT KẾ
          </h2>
          <p className="text-lg text-gray-600">Một số mẫu móc khóa custom đã thực hiện</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {(images.length ? images : loading ? Array.from({ length: 6 }).map(() => "") : []).map((img, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
            >
              {img ? (
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Custom keychain ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-300" />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/products?custom=true"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>XEM THÊM MẪU</span>
            <ArrowRight className="w-5 h-5 opacity-70" />
          </Link>
        </div>
      </div>
    </section>
  );
}
