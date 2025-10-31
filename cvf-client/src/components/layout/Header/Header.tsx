'use client'
import React, { useState, useEffect, useRef } from 'react'
import DesktopHeaderBar from './DesktopHeaderBar'
import MobileHeaderBar from './MobileHeaderBar'
import { useIsMobile } from '@/hook/useIsMobile'
import { useSearchStore } from '@/store/search'
import { useMegaMenuStore } from '@/store/megaMenu'
import { Megaphone } from 'lucide-react'
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
  const bannerHeight = bannerVisible ? 48 : 0
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
        <div
          className="fixed top-0 inset-x-0 z-[60] text-white"
          style={{
            backgroundColor: 'var(--brand-accent)',
          }}
        >
          <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 h-12 flex items-center justify-between gap-4">
            <span className="truncate text-sm md:text-base font-semibold tracking-tight inline-flex items-center gap-2">
              <Megaphone className="size-4 md:size-5 text-white/90" />
              <span className={cn('transition-opacity duration-200', fading ? 'opacity-0' : 'opacity-100')}>
                {promos[promoIndex]}
              </span>
            </span>
            <button
              type="button"
              aria-label="Đóng thông báo"
              onClick={handleDismissPromo}
              className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full text-white/80 hover:text-[var(--brand-secondary)]"
              style={{ backgroundColor: 'transparent' }}
            >
              ×
            </button>
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
          'fixed inset-x-0 z-50 border-b-2 text-neutral-900',
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

