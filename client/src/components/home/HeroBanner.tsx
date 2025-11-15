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
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gray-900 overflow-hidden">
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
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gray-900 overflow-hidden">
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

      <div className="relative h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex items-center">
        <div className={`max-w-2xl w-full ${currentSlide.textPosition === "center" ? "mx-auto text-center" : "text-left"}`}>
          <h1 className="font-[family-name:var(--font-retro)] text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-white mb-3 sm:mb-4 tracking-wider uppercase leading-tight whitespace-pre-line">
            {currentSlide.title}
          </h1>

          {currentSlide.subtitle && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-4 sm:mb-6 md:mb-8 font-medium">
              {currentSlide.subtitle}
            </p>
          )}

          <Link
            href={currentSlide.ctaLink}
            className="inline-block px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wider hover:bg-black hover:text-white border-2 border-white transition-all"
          >
            {currentSlide.ctaText}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 flex items-center gap-2 sm:gap-3 md:gap-4 z-10">
        <button
          onClick={goToPrev}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white hover:text-black text-white border-2 border-white flex items-center justify-center transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={goToNext}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 hover:bg-white hover:text-black text-white border-2 border-white flex items-center justify-center transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 md:bottom-8 flex items-center gap-1.5 sm:gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-0.5 sm:h-1 transition-all ${
              index === currentIndex
                ? "w-8 sm:w-10 md:w-12 bg-white"
                : "w-4 sm:w-5 md:w-6 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
