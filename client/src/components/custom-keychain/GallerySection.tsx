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
    <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
            MẪU THIẾT KẾ
          </h2>
          <p className="text-lg md:text-xl text-black/70">Một số mẫu móc khóa custom đã thực hiện</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {(images.length ? images : loading ? Array.from({ length: 6 }).map(() => "") : []).map((img, index) => (
            <div
              key={index}
              className="aspect-square bg-white border-4 border-black overflow-hidden hover:-translate-y-2 transition-all"
              style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
            >
              {img ? (
                <Image
                  src={img}
                  alt={`Custom keychain ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products?custom=true"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-[#fff100] hover:text-black border-4 border-black font-bold text-lg uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5"
          >
            <span>XEM THÊM MẪU</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
