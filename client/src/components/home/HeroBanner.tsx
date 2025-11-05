"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHeroSlides } from "@/hook/useSiteContent";


export default function HeroBanner() {
  const { data, isLoading } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = data || [];
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  if (isLoading || slides.length === 0) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-64 h-8 bg-gray-700 rounded mb-4 mx-auto" />
            <div className="w-48 h-6 bg-gray-700 rounded mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative h-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex items-center">
        <div className={`max-w-2xl ${currentSlide.textPosition === "center" ? "mx-auto text-center" : "text-left"}`}>
          <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 tracking-wider uppercase leading-tight whitespace-pre-line">
            {currentSlide.title}
          </h1>

          {currentSlide.subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 font-medium">
              {currentSlide.subtitle}
            </p>
          )}

          <Link
            href={currentSlide.ctaLink}
            className="inline-block px-8 py-4 bg-white text-black font-bold text-base md:text-lg uppercase tracking-wider hover:bg-black hover:text-white border-2 border-white transition-all"
          >
            {currentSlide.ctaText}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-4 z-10">
        <button
          onClick={goToPrev}
          className="w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white hover:text-black text-white border-2 border-white flex items-center justify-center transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={goToNext}
          className="w-12 h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white hover:text-black text-white border-2 border-white flex items-center justify-center transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-1 transition-all ${
              index === currentIndex
                ? "w-12 bg-white"
                : "w-6 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
