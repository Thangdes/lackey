'use client'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProductSearch } from '@/hook/useProductSearch'
import { buildProductDetailPath, buildProductsWithParams } from '@/constant/route'

type Item = { label: string; icon: 'search' | 'clock' | 'popular' }

const buildDynamicSuggestions = (query: string): string[] => {
  const q = query.trim()
  return q.length ? [q, `${q} unisex`, `${q} chính hãng`] : []
}

const buildItems = (
  query: string,
  recentSearches: string[],
  popularSearches: string[]
): Item[] => {
  const items: Item[] = []
  const q = query.trim()
  if (q.length === 0) {
    for (const r of recentSearches) items.push({ label: r, icon: 'clock' })
    for (const p of popularSearches) items.push({ label: p, icon: 'popular' })
  } else {
    for (const s of buildDynamicSuggestions(q)) items.push({ label: s, icon: 'search' })
  }
  return items
}

type SearchInputProps = {
  placeholder?: string;
  buttonPaddingClass?: string;
  iconSizeClass?: string;
  containerClassName?: string;
  inputClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Tìm kiếm sản phẩm, thương hiệu, danh mục... ',
  buttonPaddingClass = 'px-4 py-2',
  iconSizeClass = 'text-2xl',
  containerClassName = '',
  inputClassName = '',
  open: openProp,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? (openProp as boolean) : internalOpen
  const setOpenSafe = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof value === 'function' ? (value as (prev: boolean) => boolean)(open) : value
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }, [isControlled, onOpenChange, open])
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])

  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const popularSearches = useMemo(() => ['Muji đồ gia dụng', 'Shiseido skincare', 'Nintendo Switch'], [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('op_recent_searches')
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) {
          if (arr.length > 0 && typeof arr[0] === 'string') {
            setRecentSearches((arr as string[]).slice(0, 12))
          } else {
            const items = (arr as Array<{ term?: string; t?: number }>)
              .filter((x) => typeof x?.term === 'string')
              .sort((a, b) => (b.t ?? 0) - (a.t ?? 0))
              .map((x) => x.term as string)
              .slice(0, 12)
            setRecentSearches(items)
          }
        }
      }
    } catch {}
  }, [])

  const pushRecent = useCallback((term: string) => {
    const val = term.trim()
    if (!val) return
    setRecentSearches((prev) => {
      const dedup = [val, ...prev.filter((x) => x.toLowerCase() !== val.toLowerCase())]
      const limited = dedup.slice(0, 12)
      try {
        const now = Date.now()
        const payload = limited.map((s) => ({ term: s, t: s.toLowerCase() === val.toLowerCase() ? now : now - 1 }))
        window.localStorage.setItem('op_recent_searches', JSON.stringify(payload))
      } catch {}
      return limited
    })
  }, [])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenSafe(false)
        setHighlightedIndex(-1)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSafe(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [setOpenSafe])

  const items: Item[] = useMemo(() => buildItems(query, recentSearches, popularSearches), [query, recentSearches, popularSearches])

  const [total] = useState<number | undefined>(undefined)
  const router = useRouter()
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [highlightedResult, setHighlightedResult] = useState<number>(-1)

  const { results, loading, error } = useProductSearch(query, 6)

  const selectItem = useCallback((value: string) => {
    setQuery(value)
    setOpenSafe(false)
    setHighlightedIndex(-1)
    const q = value.trim()
    if (q) {
      pushRecent(q)
      router.push(buildProductsWithParams({ q }))
    }
  }, [setOpenSafe, router, pushRecent])

  const handleInputFocus = useCallback(() => setOpenSafe(true), [setOpenSafe])
  const handleInputClick = useCallback(() => setOpenSafe(true), [setOpenSafe])
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])
  const handleClearClick = useCallback(() => {
    setQuery('')
  }, [])
  const handleSearchButtonClick = useCallback(() => {
    const v = query.trim()
    if (v) {
      setOpenSafe(false)
      pushRecent(v)
      router.push(buildProductsWithParams({ q: v }))
    } else setOpenSafe((prev) => !prev)
  }, [query, router, setOpenSafe, pushRecent])
  const handleItemMouseEnter = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const index = Number((e.currentTarget as HTMLLIElement).dataset.index)
    if (!Number.isNaN(index)) setHighlightedIndex(index)
  }, [])
  const handleItemMouseLeave = useCallback(() => setHighlightedIndex(-1), [])
  const handleItemClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const label = (e.currentTarget as HTMLLIElement).dataset.label
    if (label) selectItem(label)
  }, [selectItem])
  const setItemRefByDataset = useCallback((el: HTMLLIElement | null) => {
    if (el && typeof el.dataset.index !== 'undefined') {
      const idx = Number(el.dataset.index)
      if (!Number.isNaN(idx)) itemRefs.current[idx] = el
    }
  }, [])
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasQuery = query.trim().length > 0
    if (e.key === 'ArrowDown') {
      setOpenSafe(true)
      e.preventDefault()
      if (hasQuery && results.length > 0) {
        setHighlightedResult((prev) => {
          const next = Math.min((prev ?? -1) + 1, results.length - 1)
          const el = resultRefs.current[next]
          if (el) el.scrollIntoView({ block: 'nearest' })
          return next
        })
      } else if (!hasQuery && items.length > 0) {
        setHighlightedIndex((prev) => {
          const next = Math.min((prev ?? -1) + 1, items.length - 1)
          const el = itemRefs.current[next]
          if (el) el.scrollIntoView({ block: 'nearest' })
          return next
        })
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hasQuery && results.length > 0) {
        setHighlightedResult((prev) => {
          const next = Math.max((prev ?? 0) - 1, 0)
          const el = resultRefs.current[next]
          if (el) el.scrollIntoView({ block: 'nearest' })
          return next
        })
      } else if (!hasQuery && items.length > 0) {
        setHighlightedIndex((prev) => {
          const next = Math.max((prev ?? 0) - 1, 0)
          const el = itemRefs.current[next]
          if (el) el.scrollIntoView({ block: 'nearest' })
          return next
        })
      }
    } else if (e.key === 'Enter') {
      if (open) {
        e.preventDefault()
        if (hasQuery && highlightedResult >= 0 && highlightedResult < results.length) {
          const p = results[highlightedResult]
          if (p) {
            setOpenSafe(false)
            pushRecent(query.trim())
            router.push(buildProductDetailPath(p.slug || p.id))
          }
        } else if (!hasQuery && highlightedIndex >= 0 && highlightedIndex < items.length) {
          const item = items[highlightedIndex]
          if (item) selectItem(item.label)
        } else if (query.trim()) {
          selectItem(query.trim())
        }
      }
    }
  }, [items, open, highlightedIndex, query, selectItem, setOpenSafe, results, highlightedResult, router, pushRecent])

  return (
    <div ref={containerRef} className={`group flex relative items-center ${containerClassName}`}>
      <div className="pointer-events-none absolute left-2 sm:left-3 top-0 bottom-0 flex items-center md:hidden">
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
      </div>

      <Input
        placeholder={placeholder}
        className={`flex w-full rounded-full border-2 border-black bg-white/80 backdrop-blur-[2px] pl-8 md:pl-4 pr-10 sm:pr-12 md:pr-14 text-xs sm:text-sm md:text-sm h-9 sm:h-10 md:h-11 placeholder:text-gray-500 placeholder:font-medium shadow-xs hover:border-black focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:shadow-none transition-[colors,box-shadow] ${inputClassName} text-black`}
        aria-label="Tìm kiếm"
        onFocus={handleInputFocus}
        onClick={handleInputClick}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        aria-label="Thực hiện tìm kiếm"
        className="absolute right-0.5 sm:right-1 top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 inline-flex items-center justify-center rounded-full bg-black text-white shadow-md hover:shadow-lg hover:bg-black/90 active:bg-black/95 active:scale-[0.98] focus-visible:outline-none transition-transform px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2"
        onClick={handleSearchButtonClick}
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 font-extrabold text-white" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Gợi ý tìm kiếm"
          className="absolute left-0 right-0 top-full mt-1 z-[1000] overflow-hidden rounded-2xl border border-black bg-white shadow-lg transition-all duration-150 ease-out origin-top animate-in max-w-full"
        >
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-neutral-100 bg-white/80 backdrop-blur-sm">
            {query.trim().length === 0 ? (
              <p className="text-[10px] sm:text-xs font-semibold text-neutral-500">Khám phá ngay</p>
            ) : (
              <p className="text-[10px] sm:text-xs font-semibold text-neutral-500">Gợi ý cho "{query}"</p>
            )}
            {query.trim().length > 0 && (
              <button
                className="text-[10px] sm:text-xs text-neutral-500 hover:text-neutral-700"
                onClick={handleClearClick}
              >
                Xoá
              </button>
            )}
          </div>

          <div className="max-h-64 sm:max-h-80 overflow-auto py-1">
            {query.trim().length === 0 && (
              <>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-neutral-400 font-semibold">Gần đây</p>
                </div>
                <ul className="py-0">
                  {recentSearches.map((label, idx) => (
                    <li
                      key={`recent-${label}`}
                      ref={setItemRefByDataset}
                      data-index={idx}
                      data-label={label}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-pointer flex items-center gap-2 ${highlightedIndex === idx ? 'bg-neutral-50' : 'hover:bg-neutral-50'} text-neutral-800`}
                      onMouseEnter={handleItemMouseEnter}
                      onMouseLeave={handleItemMouseLeave}
                      onClick={handleItemClick}
                    >
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
                      <span className="line-clamp-1">{label}</span>
                    </li>
                  ))}
                </ul>

                <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-1.5 sm:pb-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-neutral-400 font-semibold">Phổ biến</p>
                </div>
                <ul className="py-0">
                  {popularSearches.map((label, idx) => (
                    <li
                      key={`popular-${label}`}
                      ref={setItemRefByDataset}
                      data-index={recentSearches.length + idx}
                      data-label={label}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-pointer flex items-center gap-2 ${highlightedIndex === (recentSearches.length + idx) ? 'bg-neutral-50' : 'hover:bg-neutral-50'} text-neutral-800`}
                      onMouseEnter={handleItemMouseEnter}
                      onMouseLeave={handleItemMouseLeave}
                      onClick={handleItemClick}
                    >
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
                      <span className="line-clamp-1">{label}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {query.trim().length > 0 && (
              <div className="py-0">
                <div className="px-3 sm:px-4 py-1.5 sm:py-2">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wide text-neutral-400 font-semibold">Sản phẩm</p>
                </div>
                <ul>
                  {loading && (
                    <li className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-neutral-500">Đang tải...</li>
                  )}
                  {error && !loading && (
                    <li className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-500">{error}</li>
                  )}
                  {!loading && !error && results.length === 0 && (
                    <li className="px-3 sm:px-4 py-4 sm:py-6 text-xs sm:text-sm text-neutral-500">Không có sản phẩm phù hợp</li>
                  )}
                  {!loading && !error && results.map((p, i) => (
                    <li key={p.id} className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-pointer ${highlightedResult === i ? 'bg-neutral-50' : ''}`}>
                      <Link
                        ref={(el) => { resultRefs.current[i] = el }}
                        href={buildProductDetailPath(p.slug || p.id)}
                        className={`flex items-center gap-2 sm:gap-3 text-black hover:bg-neutral-50 rounded-md px-1.5 sm:px-2 py-1 sm:py-1.5 ${p.inStock === false ? 'opacity-60' : ''}`}
                        onMouseEnter={() => setHighlightedResult(i)}
                      >
                        {p.thumbnailUrl ? (
                          <Image src={p.thumbnailUrl} alt={p.name} width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover bg-neutral-100" />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-neutral-100" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 font-medium text-xs sm:text-sm">{p.name}</div>
                          <div className="mt-0.5 text-[10px] sm:text-[12px] text-neutral-600">
                            {(() => {
                              const minEff = typeof p.minEffectivePrice === 'number' ? p.minEffectivePrice : undefined
                              const vcount = (p as unknown as { variantCount?: unknown })?.variantCount
                              const rating = typeof p.ratingAvg === 'number' ? p.ratingAvg.toFixed(1) : undefined
                              const rc = p.ratingCount
                              return (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {typeof minEff === 'number' && (
                                    <span className="text-red-600 font-semibold">{(typeof vcount === 'number' && vcount > 1) ? 'Giá từ ' : ''}₫{minEff.toLocaleString('vi-VN')}</span>
                                  )}
                                  {typeof rating !== 'undefined' && <span className="ml-1">★ {rating}</span>}
                                  {typeof rc === 'number' && <span className="text-neutral-500">({rc})</span>}
                                </div>
                              )
                            })()}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {p.category?.name && (
                              <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 px-2 py-[2px] text-[11px]">{p.category.name}</span>
                            )}
                            {p.supplier?.name && (
                              <span
                                title={p.supplier.name}
                                className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 px-2 py-[2px] text-[11px] max-w-[140px] truncate"
                              >{p.supplier.name}</span>
                            )}
                            {(() => {
                              const inStock = p.inStock !== false
                              return (
                                <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] ${inStock ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                  {inStock ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-3 sm:px-4 pt-1.5 sm:pt-2 pb-2 sm:pb-3">
                  <button
                    type="button"
                    className="w-full text-left text-[11px] sm:text-[13px] text-black hover:underline"
                    onClick={() => {
                      const v = query.trim(); if (!v) return; setOpenSafe(false); pushRecent(v); router.push(buildProductsWithParams({ q: v }))
                    }}
                  >
                    Xem tất cả kết quả{typeof total === 'number' ? ` (${total})` : ''}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 border-t border-neutral-100 bg-white/70">
            <p className="text-[10px] sm:text-xs text-neutral-500">Nhấn Enter để tìm "{query || '...'}"</p>
            <button
              className="text-[10px] sm:text-xs font-medium text-black hover:underline"
              onClick={handleSearchButtonClick}
            >
              Xem tất cả kết quả
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchInput
