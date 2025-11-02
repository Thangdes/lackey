"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IoClose, IoChevronBack, IoChevronForward, IoExpand } from "react-icons/io5";

export type ProductGalleryProps = {
  name: string;
  images: string[];
  activeImg: number;
  onChangeActive: (index: number) => void;
  isSale?: boolean;
  discountPercent?: number | null;
  thumbColsClass?: string;
  thumbGapClass?: string;
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ 
  name, 
  images, 
  activeImg, 
  onChangeActive, 
  isSale, 
  discountPercent 
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenZoom, setFullscreenZoom] = useState(1);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);

  const displayImages = images.length > 0 ? images : ["/logo/logo.jpg"];
  const currentImage = displayImages[activeImg] || displayImages[0];

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!zoomed) return;
    const rect = mainRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handlePrevImage = () => {
    const newIndex = activeImg > 0 ? activeImg - 1 : displayImages.length - 1;
    onChangeActive(newIndex);
  };

  const handleNextImage = () => {
    const newIndex = activeImg < displayImages.length - 1 ? activeImg + 1 : 0;
    onChangeActive(newIndex);
  };

  const toggleFullscreenZoom = () => {
    setFullscreenZoom((prev) => (prev === 1 ? 2 : 1));
  };

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    if (!fullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreen(false);
        setFullscreenZoom(1);
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen, activeImg, displayImages.length]);

  // Lock body scroll when fullscreen is open
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  return (
    <div className="w-full " >
      <div className="flex gap-2 md:gap-3">
        {displayImages.length > 1 && (
          <div className="flex flex-col gap-2 md:gap-3 w-20 md:w-24">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onChangeActive(idx)}
                className={`relative aspect-square border-2 rounded-md transition-all overflow-hidden ${
                  idx === activeImg
                    ? "border-black scale-105 shadow-md"
                    : "border-neutral-300 hover:border-black hover:scale-105"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} - view ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex-1">
          <div 
            ref={mainRef}
            className="relative group w-full aspect-square bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_#B5CCBC] cursor-pointer"
            onClick={() => setFullscreen(true)}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => {
              setZoomed(false);
              setOrigin({ x: 50, y: 50 });
            }}
            onMouseMove={onMouseMove}
          >
            <Image
              src={currentImage}
              alt={name}
              fill
              priority
              className={`object-cover transition-all duration-200 ${
                zoomed ? "scale-150" : "scale-100"
              }`}
              style={zoomed ? { transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 900px"
            />
            
            {isSale && discountPercent ? (
              <div className="absolute top-4 left-4 z-20 bg-red-600 text-white border-2 border-black px-4 py-2 font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                -{discountPercent}% OFF
              </div>
            ) : null}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreen(true);
              }}
              className="absolute top-4 right-4 z-20 p-2 bg-white border-2 border-black opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
              aria-label="Xem ảnh toàn màn hình"
            >
              <IoExpand className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Hint - Hidden on mobile */}
      {zoomed && (
        <div className="hidden md:flex absolute inset-x-0 bottom-4 items-center justify-center pointer-events-none z-10">
          <span className="inline-flex items-center rounded-full bg-black/50 text-white px-3 py-1.5 text-xs font-medium shadow-md">
            🔍 Di chuột để zoom • Click để xem toàn màn hình
          </span>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
          onClick={() => {
            setFullscreen(false);
            setFullscreenZoom(1);
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setFullscreen(false);
              setFullscreenZoom(1);
            }}
            className="absolute top-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Đóng"
          >
            <IoClose className="w-7 h-7" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
            {activeImg + 1} / {displayImages.length}
          </div>

          {/* Zoom Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreenZoom();
            }}
            className="absolute top-20 right-4 z-50 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium"
            aria-label={fullscreenZoom === 1 ? "Phóng to" : "Thu nhỏ"}
          >
            {fullscreenZoom === 1 ? "🔍 Zoom 2x" : "↩️ Reset"}
          </button>

          {/* Main Fullscreen Image */}
          <div 
            ref={fullscreenRef}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-7xl max-h-full">
              <Image
                src={currentImage}
                alt={`${name} - Ảnh ${activeImg + 1}`}
                fill
                sizes="100vw"
                className="object-contain select-none"
                priority
                style={{
                  transform: `scale(${fullscreenZoom})`,
                  transition: "transform 300ms ease-out",
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Ảnh trước"
              >
                <IoChevronBack className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Ảnh sau"
              >
                <IoChevronForward className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Bottom Thumbnail Strip */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-full px-4">
              <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeActive(i);
                    }}
                    className={`
                      relative flex-none w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg transition-all duration-200
                      ${i === activeImg 
                        ? "ring-3 ring-white scale-110 shadow-lg" 
                        : "ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100 hover:scale-105"
                      }
                    `}
                    aria-label={`Xem ảnh ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 80px, 96px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard Hints */}
          <div className="absolute bottom-6 left-4 z-50 hidden md:flex flex-col gap-1 text-white/60 text-xs">
            <div>← → : Chuyển ảnh</div>
            <div>ESC : Đóng</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
