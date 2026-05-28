"use client";

import { useEffect, useState } from "react";

export type ViewportFlags = {
  isSmall: boolean; 
  isXs340: boolean; 
  isPhone: boolean; 
  isBelowMd: boolean; 
  isTablet: boolean; 
};

export function useViewportFlags(): ViewportFlags {
  const [flags, setFlags] = useState<ViewportFlags>({
    isSmall: false,
    isXs340: false,
    isPhone: false,
    isBelowMd: false,
    isTablet: false,
  });

  useEffect(() => {
    const update = () => {
      try {
        const w = window.innerWidth;
        setFlags({
          isSmall: w < 640,
          isXs340: w <= 340,
          isPhone: w < 480,
          isBelowMd: w < 768,
          isTablet: w >= 640 && w < 1024,
        });
      } catch {}
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return flags;
}
