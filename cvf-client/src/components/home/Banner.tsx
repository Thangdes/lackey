"use client"
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type BannerItem = {
  imageUrl: string
  alt?: string
  href?: string
}

type Props = {
  items?: BannerItem[]
  autoPlayMs?: number
  arrowDelayMs?: number
  disableFallback?: boolean
}

const defaultItems: BannerItem[] = [
  {
    imageUrl:
      'https://cdn.dribbble.com/userupload/18593430/file/original-584f68940e003859095420105796187c.png?resize=1024x768&vertical=center',
    alt: 'Nguyên liệu tươi ngon và thực phẩm',
    href: '/products',
  },
  {
    imageUrl:
      'https://cdn.dribbble.com/userupload/43042575/file/original-39a16b2b624c7e0e29de8f50ecc36e7f.png?format=webp&resize=450x338&vertical=center',
    alt: 'Các bữa ăn ngon và combo',
    href: '/products?sort=popularity',
  },
  {
    imageUrl:
      'https://cdn.dribbble.com/userupload/42700532/file/original-8a25e1e4d76982d94f3898ed09bc958f.png?format=webp&resize=450x338&vertical=center',
    alt: 'Đồ uống và nhiều hơn nữa',
    href: '/products?category=beverages',
  },
]

const Banner: React.FC<Props> = ({ items, autoPlayMs = 0, arrowDelayMs = 300, disableFallback = false }) => {
  const slides = useMemo(() => {
    const src = disableFallback ? (items || []) : (items && items.length ? items : defaultItems)
    return src.filter((it) => !!it && typeof it.imageUrl === 'string' && it.imageUrl.trim().length > 0)
  }, [items, disableFallback])
  const [index, setIndex] = useState(0)
  const [stepPercent, setStepPercent] = useState<number>(100)
  const [visibleCount, setVisibleCount] = useState<number>(1)
  const [transitioning, setTransitioning] = useState(false)
  const [layoutReady, setLayoutReady] = useState(false)
  const timerRef = useRef<number | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const navLockRef = useRef<boolean>(false)
  const pendingNavRef = useRef<number | null>(null)
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const restoredRef = useRef(false)
  const STORAGE_KEY = 'home_banner_index'
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null)

  const markLoaded = (url: string) => {
    setLoadedMap((prev) => (prev[url] ? prev : { ...prev, [url]: true }))
  }
  const markError = (url: string) => {
    setErrorMap((prev) => (prev[url] ? prev : { ...prev, [url]: true }))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const toLoad = slides.map((s) => s.imageUrl).filter((u) => !loadedMap[u] && !errorMap[u])
    const disposers: Array<() => void> = []
    toLoad.forEach((url) => {
      try {
        const img = new window.Image()
        img.decoding = 'async'
        img.loading = 'eager'
        img.src = url
        const onLoad = () => markLoaded(url)
        const onError = () => {
          markError(url)
        }
        img.addEventListener('load', onLoad)
        img.addEventListener('error', onError)
        disposers.push(() => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onError)
        })
      } catch  {
        markLoaded(url)
      }
    })
    return () => {
      disposers.forEach((fn) => fn())
    }
  }, [slides, loadedMap, errorMap])

  useEffect(() => {
    if (!layoutReady || !mounted) return
    if (!autoPlayMs) return 
    const current = slides[(index % slides.length + slides.length) % slides.length]
    if (!current) return
    const currentReady = !!loadedMap[current.imageUrl] || !!errorMap[current.imageUrl]
    if (!currentReady) return
    const schedule = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        setTransitioning(true)
        setIndex((prev) => prev + 1)
      }, Math.max(2500, autoPlayMs))
    }
    schedule()
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  }, [autoPlayMs, slides.length, index, layoutReady, loadedMap, errorMap, slides, mounted])

  const headTail = Math.min(slides.length || 1, Math.max(1, Math.ceil(visibleCount) + 2))
  const extendedSlides = useMemo(() => {
    const head = slides.slice(0, headTail)
    const tail = slides.slice(Math.max(0, slides.length - headTail), slides.length)
    return [...tail, ...slides, ...head]
  }, [slides, headTail])
  const baseIndex = index + headTail

  const containerRef = useRef<HTMLDivElement | null>(null)
  useLayoutEffect(() => {
    const compute = () => {
      if (typeof window === 'undefined') return { step: 100, visible: 1 }
      const w = window.innerWidth
      if (w >= 1024) return { step: 40, visible: 2.5 }
      if (w >= 768) return { step: 50, visible: 2 }
      return { step: 100, visible: 1 }
    }
    const apply = () => {
      const { step, visible } = compute()
      setStepPercent(step)
      setVisibleCount(visible)
      // Mark layout ready and only then re-enable transitions
      if (!layoutReady) {
        setLayoutReady(true)
        // ensure transform changes don't animate on first layout
        setTransitioning(false)
        const track = trackRef.current
        if (track) void track.offsetHeight
        requestAnimationFrame(() => setTransitioning(true))
      }
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [layoutReady])

  // Memoized navigation function (placed before effects that use it)
  const navigate = useCallback((delta: number) => {
    if (navLockRef.current) return
    if (!transitioning) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    if (pendingNavRef.current) {
      window.clearTimeout(pendingNavRef.current)
      pendingNavRef.current = null
    }
    navLockRef.current = true
    const delayMs = Math.max(0, arrowDelayMs)
    pendingNavRef.current = window.setTimeout(() => {
      setTransitioning(true)
      setIndex((prev) => {
        const next = prev + delta
        if (next > slides.length) return slides.length
        if (next < -1) return -1
        return next
      })
      pendingNavRef.current = null
      window.setTimeout(() => {
        navLockRef.current = false
      }, 900)
    }, delayMs)
  }, [arrowDelayMs, slides.length, transitioning])

  useEffect(() => {
    return () => {
      if (pendingNavRef.current) {
        window.clearTimeout(pendingNavRef.current)
        pendingNavRef.current = null
      }
    }
  }, [])
  useEffect(() => {
    if (!autoPlayMs) return 
    const el = containerRef.current
    if (!el) return
    const onEnter = () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
    const onLeave = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        setTransitioning(true)
        setIndex((prev) => prev + 1)
      }, Math.max(2500, autoPlayMs))
    }
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [autoPlayMs])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const t = e.touches[0]
      touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() }
    }
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchRef.current
      touchRef.current = null
      if (!start) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      const dt = Date.now() - start.t
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)
      if (absX < 40) return 
      if (absX <= absY) return  
      if (dt > 800) return 
      e.preventDefault()
      if (dx < 0) navigate(1)
      else navigate(-1)
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [navigate])

  const handleTransitionEnd = () => {
    navLockRef.current = false
    if (index >= slides.length) {
      setTransitioning(false)
      requestAnimationFrame(() => {
        setIndex(0)
        const track = trackRef.current
        if (track) void track.offsetHeight
        requestAnimationFrame(() => setTransitioning(true))
      })
    }
    if (index < 0) {
      setTransitioning(false)
      requestAnimationFrame(() => {
        setIndex(slides.length - 1)
        const track = trackRef.current
        if (track) void track.offsetHeight
        requestAnimationFrame(() => setTransitioning(true))
      })
    }
  }

  


  const preloadWindow = Math.ceil(visibleCount) + 3
  const isPreloadIndex = (extendedIndex: number) =>
    extendedIndex >= baseIndex - preloadWindow && extendedIndex <= baseIndex + preloadWindow

  const currentSlide = slides.length > 0 ? slides[(index % slides.length + slides.length) % slides.length] : undefined
  const currentReady = currentSlide ? !!loadedMap[currentSlide.imageUrl] || !!errorMap[currentSlide.imageUrl] : true
  const readyToShow = mounted && layoutReady && currentReady

  useEffect(() => {
    if (!mounted || restoredRef.current || slides.length === 0) return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved != null) {
        const idx = Math.max(0, Math.min(Number(saved) || 0, slides.length - 1))
        setTransitioning(false)
        setIndex(idx)
        const track = trackRef.current
        if (track) void track.offsetHeight
        requestAnimationFrame(() => setTransitioning(true))
      }
    } catch {}
    restoredRef.current = true
  }, [mounted, slides.length])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(index))
    } catch {}
  }, [index])

  return (
    <section aria-label="Banner trang chủ" className="relative w-full">
      <div ref={containerRef} className="relative w-full overflow-hidden group bg-neutral-900">
        <div className="relative h-[260px] md:h-[420px] lg:h-[500px] min-[1920px]:h-[640px] bg-neutral-900">
          {readyToShow ? (
            <div
              ref={trackRef}
              className={[
                'absolute inset-0 flex flex-nowrap will-change-transform transform-gpu select-none bg-neutral-900',
                transitioning ? 'transition-transform duration-700 ease-in-out' : '',
                'opacity-100',
                'transition-opacity duration-300',
              ].join(' ')}
              style={{ transform: `translate3d(-${baseIndex * stepPercent}%, 0, 0)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedSlides.map((s, i) => (
                <div
                  key={`${i}-${s.imageUrl}`}
                  className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-[40%] min-w-0 relative h-full bg-neutral-900 overflow-hidden"
                >
                  {s.href ? (
                    <Link href={s.href} aria-label={s.alt || 'Banner'} className="block relative h-full">
                      {!errorMap[s.imageUrl] && (
                        <Image
                          src={s.imageUrl}
                          alt={s.alt || 'Banner'}
                          fill
                          priority={isPreloadIndex(i)}
                          fetchPriority={isPreloadIndex(i) ? 'high' : 'auto'}
                          loading={isPreloadIndex(i) ? 'eager' : 'lazy'}
                          unoptimized
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMScgaGVpZ2h0PScxJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNkMWQ1ZGInIC8+PC9zdmc+"
                          onLoadingComplete={() => markLoaded(s.imageUrl)}
                          onError={() => markError(s.imageUrl)}
                          className="object-cover"
                          sizes="(min-width:1024px) 40vw, (min-width:768px) 50vw, 100vw"
                        />
                      )}
                      {!loadedMap[s.imageUrl] && !errorMap[s.imageUrl] && (
                        <div className="absolute inset-0 bg-neutral-700 animate-pulse" />
                      )}
                      {errorMap[s.imageUrl] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-300 text-sm">
                          Không tải được hình
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
                    </Link>
                  ) : (
                    <div className="relative h-full">
                      {!errorMap[s.imageUrl] && (
                        <Image
                          src={s.imageUrl}
                          alt={s.alt || 'Banner'}
                          fill
                          priority={isPreloadIndex(i)}
                          fetchPriority={isPreloadIndex(i) ? 'high' : 'auto'}
                          loading={isPreloadIndex(i) ? 'eager' : 'lazy'}
                          unoptimized
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMScgaGVpZ2h0PScxJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxJyBoZWlnaHQ9JzEnIGZpbGw9JyNkMWQ1ZGInIC8+PC9zdmc+"
                          onLoadingComplete={() => markLoaded(s.imageUrl)}
                          onError={() => markError(s.imageUrl)}
                          className="object-cover"
                          sizes="(min-width:1024px) 40vw, (min-width:768px) 50vw, 100vw"
                        />
                      )}
                      {!loadedMap[s.imageUrl] && !errorMap[s.imageUrl] && (
                        <div className="absolute inset-0 bg-neutral-700 animate-pulse" />
                      )}
                      {errorMap[s.imageUrl] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-300 text-sm">
                          Không tải được hình
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-nowrap bg-neutral-900">
              {Array.from({ length: Math.max(1, Math.ceil(visibleCount)) + 1 }).map((_, i) => (
                <div
                  key={`ph-${i}`}
                  className="shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-[40%] min-w-0 relative h-full"
                >
                  <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Banner trước"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto"
          onClick={() => navigate(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Banner tiếp theo"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto"
          onClick={() => navigate(1)}
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default Banner
