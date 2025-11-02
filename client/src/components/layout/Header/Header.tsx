'use client'
import React, { useState, useEffect, useRef } from 'react'
import DesktopHeaderBar from './DesktopHeaderBar'
import MobileHeaderBar from './MobileHeaderBar'
import { useIsMobile } from '@/hook/useIsMobile'
import { useSearchStore } from '@/store/search'
import { useMegaMenuStore } from '@/store/megaMenu'
import { Megaphone, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import CategoryBar from './CategoryBar'


const Header: React.FC = (): React.ReactElement => {
  const isMobile = useIsMobile();
  const { open: searchOpen, setOpen: setSearchOpen } = useSearchStore()
  const { open: megaOpen } = useMegaMenuStore()
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const [lockedHeaderHeight, setLockedHeaderHeight] = useState<number | null>(null)
  

  const promos = [
    '🔥 Khuyến mãi: Giảm 15% cho đơn đầu tiên! Nhập mã WELCOME15',
    '🎁 Flash sale cuối tuần – giảm đến 30% nhiều mặt hàng',
  ] as const
  const [promoIndex, setPromoIndex] = useState<number>(0)
  const [fading, setFading] = useState<boolean>(false)
  const [promoDismissed, setPromoDismissed] = useState<boolean>(false)
  useEffect(() => {
    try {
      const days = Number(process.env.NEXT_PUBLIC_PROMO_DISMISS_DAYS || 14)
      const ttlMs = Math.max(1, days) * 24 * 60 * 60 * 1000
      const now = Date.now()
      const rawNew = window.localStorage.getItem('op_promo_dismissed_v2')
      if (rawNew) {
        const data = JSON.parse(rawNew) as { t: number }
        setPromoDismissed(!!data?.t && now - data.t < ttlMs)
        return
      }
      const legacy = window.localStorage.getItem('op_promo_dismissed')
      setPromoDismissed(legacy === '1')
    } catch {}
  }, [])

  const handleDismissPromo = () => {
    try {
      const payload = JSON.stringify({ t: Date.now() })
      window.localStorage.setItem('op_promo_dismissed_v2', payload)
    } catch {}
    setPromoDismissed(true)
  }
  const bannerVisible = !promoDismissed && promos.length > 0

  useEffect(() => {
    if (!bannerVisible) return
    const showDuration = 4000
    const fadeDuration = 200
    let fadeTimeout: number | undefined
    const interval = window.setInterval(() => {
      setFading(true)
      fadeTimeout = window.setTimeout(() => {
        setPromoIndex((prev) => (prev + 1) % promos.length)
        setFading(false)
      }, fadeDuration)
    }, showDuration)
    return () => {
      window.clearInterval(interval)
      if (fadeTimeout) window.clearTimeout(fadeTimeout)
    }
  }, [bannerVisible, promos.length])
  const bannerHeight = bannerVisible ? 56 : 0
  const topOffset = bannerHeight > 0 ? bannerHeight : 0


  useEffect(() => {
    if (!headerRef.current) return
    const el = headerRef.current
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height
        setHeaderHeight(h)
      }
    })
    ro.observe(el)
    const rect = el.getBoundingClientRect()
    setHeaderHeight(rect.height)
    return () => {
      ro.disconnect()
    }
  }, [])


  useEffect(() => {
    if (megaOpen) {
      const h = headerRef.current?.getBoundingClientRect().height
      setLockedHeaderHeight(h ?? headerHeight)
    } else {
      setLockedHeaderHeight(null)
    }
  }, [megaOpen, headerHeight])

  return (
    <>
      {bannerVisible && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-[#AE1C2C] via-[#C92A3A] to-[#AE1C2C] shadow-md overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full animate-[shimmer_3s_ease-in-out_infinite]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            />
          </div>
          
          <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
                <Megaphone className="size-4 text-white animate-pulse" />
              </div>
              
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Sparkles className="size-3.5 text-yellow-300 shrink-0 animate-pulse" />
                <span className={cn(
                  'text-sm md:text-base font-bold tracking-tight text-white transition-all duration-300 truncate',
                  fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                )}>
                  {promos[promoIndex]}
                </span>
                <Sparkles className="size-3.5 text-yellow-300 shrink-0 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1">
                {promos.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      i === promoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                    )}
                  />
                ))}
              </div>
              
              <button
                type="button"
                aria-label="Đóng thông báo"
                onClick={handleDismissPromo}
                className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white hover:scale-110 transition-all duration-200"
              >
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={headerRef}
        style={{
          top: topOffset,
          backgroundColor: '#ffffff',
        }}
        className={cn(
          'fixed inset-x-0 z-50 text-neutral-900',
          megaOpen ? 'border-transparent' : 'border-neutral-200'
        )}
      >
        <div
          className={cn(
            'relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-3',
            searchOpen && 'z-50 border-b border-neutral-200'
          )}
        >
          {isMobile ? (
            <MobileHeaderBar />
          ) : (
            <DesktopHeaderBar open={searchOpen} onOpenChange={setSearchOpen} />
          )}
        </div>
        {!isMobile && searchOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={() => setSearchOpen(false)}
          />
        )}
        {!isMobile && <CategoryBar />}
      </div>

      {(() => {
        const spacerHeight = (lockedHeaderHeight ?? headerHeight) || 0;
        const fallback = isMobile ? 80 : 64;
        const finalHeight = Math.max(spacerHeight, fallback) + topOffset;
        return <div aria-hidden style={{ height: finalHeight }} />;
      })()}
    </>
  );
};

export default Header

