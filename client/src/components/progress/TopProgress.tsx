"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopProgress() {
  const pathname = usePathname();
  
  const urlKey = useMemo(() => `${pathname}`, [pathname]);

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const startedRef = useRef(false);
  const urlKeyRef = useRef(urlKey);
  const incTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const showDelayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<() => void>(() => {});
  const doneRef = useRef<() => void>(() => {});

  function clearTimers() {
    if (incTimer.current) { clearInterval(incTimer.current); incTimer.current = null; }
    if (showDelayTimer.current) { clearTimeout(showDelayTimer.current); showDelayTimer.current = null; }
    if (finishTimer.current) { clearTimeout(finishTimer.current); finishTimer.current = null; }
  }

  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    clearTimers();
    showDelayTimer.current = setTimeout(() => {
      setVisible(true);
      setProgress(12); 
      incTimer.current = setInterval(() => {
        setProgress((p) => {
          if (p < 80) return p + Math.max(1, (80 - p) * 0.02);
          if (p < 90) return p + 0.2; 
          return p;
        });
        return;
      }, 100);
    }, 120);
  }, []);

  const done = useCallback(() => {
    clearTimers();
    setProgress(100);
    finishTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      startedRef.current = false;
    }, 300);
  }, []);

  
  useEffect(() => {
    startRef.current = start;
  }, [start]);
  useEffect(() => {
    doneRef.current = done;
  }, [done]);

  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      try {
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
        if (!anchor) return;
        const href = anchor.getAttribute('href') || '';
        if (!href || href.startsWith('#')) return;
        if (anchor.getAttribute('target') === '_blank') return;
        if (anchor.getAttribute('download') !== null) return;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        
        const nextKey = `${url.pathname}`;
        if (nextKey === urlKeyRef.current) return;
        start();
      } catch {}
    };
    
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [start]);

  useEffect(() => {
    const onPopState = () => start();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [start]);

  useEffect(() => {
    if (urlKeyRef.current !== urlKey) {
      
      urlKeyRef.current = urlKey;
      if (startedRef.current) {
        
        doneRef.current();
      } else {
        
        
        startRef.current();
        setTimeout(() => {
          if (startedRef.current) doneRef.current();
        }, 200);
      }
    }
  }, [urlKey]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[1100]"
      suppressHydrationWarning
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 150ms ease' }}
    >
      {mounted && (
        <div
          className="h-[3px] bg-red-600 shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
          style={{ width: `${progress}%`, transition: 'width 120ms ease' }}
          suppressHydrationWarning
        />
      )}
    </div>
  );
}
