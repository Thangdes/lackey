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
            <div className="w-64 h-8 bg-gray-700 rounded-full mb-4 mx-auto" />
            <div className="w-48 h-6 bg-gray-700 rounded-full mx-auto" />
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
          className="object-cover transition-transform duration-1000 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
      </div>

      <div className="relative h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex items-center">
        <div className={`max-w-3xl w-full ${currentSlide.textPosition === "center" ? "mx-auto text-center" : "text-left"} transition-all duration-700 animate-in fade-in slide-in-from-bottom-8`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight whitespace-pre-line drop-shadow-md">
            {currentSlide.title}
          </h1>

          {currentSlide.subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-10 font-medium max-w-2xl drop-shadow">
              {currentSlide.subtitle}
            </p>
          )}

          <Link
            href={currentSlide.ctaLink}
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-900 font-semibold text-sm sm:text-base rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            {currentSlide.ctaText}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 flex items-center gap-3 z-10">
        <button
          onClick={goToPrev}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md flex items-center justify-center transition-all shadow-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
        <button
          onClick={goToNext}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md flex items-center justify-center transition-all shadow-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-12 flex items-center gap-2 sm:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-1.5 sm:h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 sm:w-10 bg-white"
                : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
