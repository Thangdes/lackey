'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react'
import { User, Bell, HelpCircle, ShoppingBag, LogOut, ChevronRight, Phone, Truck, Undo2, FileText, Shield, Info, Search } from 'lucide-react'
import { IoCartOutline } from 'react-icons/io5'
import Image from 'next/image'
import SearchModal from './SearchModal'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useAuthModalStore } from '@/store/authModal'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import CartMiniClient from '@/components/cart/CartMiniClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constant/route'
import { useSmartCart } from '@/hook/useCart'
import { useAuthProfile, useLogout } from '@/hook/useAuth'
import { useMyOrdersPaginated } from '@/hook/useOrder'
import { statusLabel } from '@/constant/order-status'
import CategoryDropdown from './CategoryDropdown'


type DesktopHeaderBarProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DesktopHeaderBar: React.FC<DesktopHeaderBarProps> = ({ open: openProp, onOpenChange }) => {
  const router = useRouter()
  const [lang, setLang] = useState<'en' | 'vi' | 'ja'>('vi')
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openProp !== undefined
  const searchOpen = isControlled ? (openProp as boolean) : internalOpen
  const setSearchOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof value === 'function' ? (value as (p: boolean) => boolean)(searchOpen) : value
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }, [isControlled, onOpenChange, searchOpen])

  const handleLangChange = useCallback((v: string) => {
    setLang(v as 'en' | 'vi' | 'ja')
  }, [])

  const openAuth = useAuthModalStore((s) => s.openWith)
  const handleAuthClick = useCallback(() => openAuth('signin'), [openAuth])
  const { data: user } = useAuthProfile()
  const logout = useLogout()
  const [acctOpen, setAcctOpen] = useState(false)
  const acctRef = useRef<HTMLDivElement | null>(null)
  const acctBtnRef = useRef<HTMLButtonElement | null>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([null, null, null])

  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement | null>(null)
  const notifBtnRef = useRef<HTMLButtonElement | null>(null)
  const notifItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])

  const [supportOpen, setSupportOpen] = useState(false)
  const supportRef = useRef<HTMLDivElement | null>(null)
  const supportBtnRef = useRef<HTMLButtonElement | null>(null)
  const supportItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])

  const { data: notifOrders } = useMyOrdersPaginated({ page: 1, limit: 5 })
  const latestCreatedAt = useMemo<number | null>(() => {
    const items = notifOrders?.items ?? []
    if (!items || items.length === 0) return null
    const times = items
      .map((o) => (o.createdAt ? new Date(o.createdAt).getTime() : 0))
      .filter((t) => Number.isFinite(t) && t > 0)
    if (times.length === 0) return null
    return Math.max(...times)
  }, [notifOrders])
  const [hasNewNotif, setHasNewNotif] = useState(false)
  const [newNotifCount, setNewNotifCount] = useState<number>(0)
  const [adminTapCount, setAdminTapCount] = useState(0) 
  const adminTapTimerRef = useRef<number | null>(null)
  const triggerAdminNav = useCallback(() => {
    try {
      startTransition(() => {
        router.push('/admin')
      })
    } catch {
      try { setTimeout(() => router.push('/admin'), 0) } catch {}
    }
  }, [router])
  const onHiddenAdminTap = useCallback(() => {
    setAdminTapCount((c) => {
      const next = c + 1
      if (next >= 5) {
        if (adminTapTimerRef.current) { window.clearTimeout(adminTapTimerRef.current); adminTapTimerRef.current = null }
        triggerAdminNav()
        return 0
      }
      if (adminTapTimerRef.current) window.clearTimeout(adminTapTimerRef.current)
      adminTapTimerRef.current = window.setTimeout(() => { setAdminTapCount(0); adminTapTimerRef.current = null }, 4000)
      return next
    })
  }, [triggerAdminNav])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        triggerAdminNav()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [triggerAdminNav])
  useEffect(() => {
    try {
      const items = notifOrders?.items ?? []
      if (!items || items.length === 0) { setHasNewNotif(false); setNewNotifCount(0); return }
      const lastSeenRaw = window.localStorage.getItem('op_notif_last_seen')
      const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : 0
      const count = items.filter((o) => (o.createdAt ? new Date(o.createdAt).getTime() : 0) > lastSeen).length
      setHasNewNotif(count > 0)
      setNewNotifCount(count)
    } catch {
    }
  }, [latestCreatedAt, notifOrders])

  useEffect(() => {
    if (!acctOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (!acctRef.current) return
      if (!acctRef.current.contains(e.target as Node)) setAcctOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    const t = setTimeout(() => itemRefs.current[0]?.focus(), 0)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      clearTimeout(t)
    }
  }, [acctOpen])

  useEffect(() => {
    if (!notifOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (!notifRef.current) return
      if (!notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    const t = setTimeout(() => notifItemRefs.current[0]?.focus(), 0)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      clearTimeout(t)
    }
  }, [notifOpen])

  useEffect(() => {
    if (!supportOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (!supportRef.current) return
      if (!supportRef.current.contains(e.target as Node)) setSupportOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    const t = setTimeout(() => supportItemRefs.current[0]?.focus(), 0)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      clearTimeout(t)
    }
  }, [supportOpen])

  const disableLanguage = '1'
  const smartCart = useSmartCart()
  const cartQty = smartCart.totalItems

  return (
    <div className="flex items-center justify-between w-full max-h-14 relative">
      {/* Logo - Left */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-2 group"
          aria-label="LắcKey"
        >
          <Image
            src="/logo/logo.jpg"
            alt="LắcKey"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-[family-name:var(--font-retro)] text-2xl text-neutral-900 whitespace-nowrap tracking-wide">
            LắcKey
          </span>
        </Link>
      </div>

      {/* Navigation - Center */}
      <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        <Link href={ROUTES.products} className="text-sm font-medium text-neutral-900 hover:text-[var(--brand-secondary)] transition-colors uppercase tracking-wide">
          Tất Cả
        </Link>
        <Link href={ROUTES.blog} className="text-sm font-medium text-neutral-900 hover:text-[var(--brand-secondary)] transition-colors uppercase tracking-wide">
          Blog
        </Link>
        <Link href="/about" className="text-sm font-medium text-neutral-900 hover:text-[var(--brand-secondary)] transition-colors uppercase tracking-wide">
          Giới thiệu
        </Link>
        <Link href="/contact" className="text-sm font-medium text-neutral-900 hover:text-[var(--brand-secondary)] transition-colors uppercase tracking-wide">
          Liên hệ
        </Link>
        <Link href={ROUTES.products + '?sale=true'} className="text-sm font-medium text-neutral-900 hover:text-[var(--brand-secondary)] transition-colors uppercase tracking-wide">
          Khuyến mãi
        </Link>
      </nav>

      {/* Actions - Right */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full text-neutral-900 hover:bg-black/5"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Tìm kiếm"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* User Account */}
        {user ? (
          <div className="relative" ref={acctRef}>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full text-neutral-900 hover:bg-black/5"
              aria-label="Tài khoản"
              onClick={() => setAcctOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={acctOpen}
              aria-controls="user-menu"
              ref={acctBtnRef}
                onKeyDown={(e) => {
                  if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !acctOpen) {
                    e.preventDefault();
                    setAcctOpen(true);
                  } else if (e.key === 'Escape' && acctOpen) {
                    e.preventDefault();
                    setAcctOpen(false);
                  }
                }}
            >
              <User className="h-5 w-5" />
            </Button>
              {acctOpen && (
                <div
                  id="user-menu"
                  role="menu"
                  aria-label="Tài khoản"
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-black shadow-lg ring-1 ring-black/10 py-1 overflow-hidden z-50"
                  onKeyDown={(e) => {
                    const idx = itemRefs.current.findIndex((el) => el === document.activeElement)
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      const next = (idx + 1) % itemRefs.current.length
                      itemRefs.current[next]?.focus()
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      const prev = (idx - 1 + itemRefs.current.length) % itemRefs.current.length
                      itemRefs.current[prev]?.focus()
                    } else if (e.key === 'Home') {
                      e.preventDefault();
                      itemRefs.current[0]?.focus()
                    } else if (e.key === 'End') {
                      e.preventDefault();
                      itemRefs.current[itemRefs.current.length - 1]?.focus()
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setAcctOpen(false)
                      acctBtnRef.current?.focus()
                    }
                  }}
                >
                  <button
                    type="button"
                    role="menuitem"
                    ref={(el) => { itemRefs.current[0] = el }}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-md relative z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      setAcctOpen(false);
                      router.push(ROUTES.profile);
                    }}
                  >
                    <User className="h-4 w-4" />
                    <span>Tài khoản của tôi</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    ref={(el) => { itemRefs.current[1] = el }}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-md relative z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      setAcctOpen(false);
                      router.push(`${ROUTES.profile}?section=orders&tab=all&page=1&limit=10`);
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Đơn mua</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    ref={(el) => { itemRefs.current[2] = el }}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-md"
                    onClick={() => { setAcctOpen(false); logout.mutate(); }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 rounded-full text-neutral-900 hover:bg-black/5"
            aria-label="Đăng nhập"
            onClick={handleAuthClick}
          >
            <User className="h-5 w-5" />
          </Button>
        )}

        {/* Cart */}
        <Sheet modal={false}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="relative rounded-full cursor-pointer px-2 md:px-3 py-2 shadow-none border-none text-neutral-900 hover:bg-black/5"
              aria-label="Giỏ hàng"
            >
              <span className="relative flex items-center">
                <ShoppingBag className="h-5 w-5" />
                {cartQty > 0 && (
                  <span className="absolute -top-2 left-3 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold leading-none h-4 min-w-4 px-1 rounded-full">
                    {cartQty}
                  </span>
                )}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader className="pb-3">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <SheetTitle className="text-base sm:text-lg">Giỏ hàng</SheetTitle>
                <span className="inline-flex items-center justify-center text-black text-[10px] sm:text-xs font-semibold h-4 sm:h-5 min-w-4 sm:min-w-5 px-1.5 sm:px-2">
                  {"(" + cartQty + " SP" + ")"}
                </span>
              </div>
            </SheetHeader>
            <div className="mt-4 flex-1 flex flex-col">
              <CartMiniClient />
            </div>
            
          </SheetContent>
        </Sheet>
      </div>
      <button
        type="button"
        aria-label="hidden-admin"
        title=" "
        onClick={onHiddenAdminTap}
        className="absolute top-0 -right-8 w-6 h-6 opacity-0 active:opacity-100 focus:opacity-100 select-none"
        tabIndex={-1}
      />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </div>
  )
}

export default DesktopHeaderBar



