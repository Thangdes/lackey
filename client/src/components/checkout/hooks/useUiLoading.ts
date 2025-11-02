"use client";

import { useEffect, useState } from "react";

export function useUiLoading(pending: boolean, delayMs = 300): boolean {
  const [uiLoading, setUiLoading] = useState(false);

  useEffect(() => {
    if (pending) {
      setUiLoading(true);
      return;
    }
    const t = setTimeout(() => setUiLoading(false), delayMs);
    return () => clearTimeout(t);
  }, [pending, delayMs]);

  return uiLoading;
}
