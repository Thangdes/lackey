'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react'
import { User, Bell, HelpCircle, ShoppingBag, LogOut, ChevronRight, Phone, Truck, Undo2, FileText, Shield, Info } from 'lucide-react'
import { IoCartOutline } from 'react-icons/io5'
import Image from 'next/image'
import SearchInput from './SearchInput'
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
    <div className={`flex items-center gap-3 lg:gap-4 xl:gap-6 max-h-11 relative`}>
      <div className="flex items-center gap-2 lg:gap-3 text-neutral-900 shrink-0">
        <Link
          href={ROUTES.home}
          className="flex items-center flex-shrink-0"
          aria-label="LắcKey"
        >
          <Image
            src="/logo/logo.jpg"
            alt="LắcKey"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            priority
          />
          <span className="ml-2 font-retro text-xl xl:text-2xl leading-none tracking-[-0.02em] select-none logo-strong whitespace-nowrap text-neutral-900">
            LacKey
          </span>
        </Link>
        <div className="ml-1 sm:ml-2 shrink-0 min-w-[120px]">
          <CategoryDropdown />
        </div>
      </div>

      <div className="flex-1 min-w-[280px] w-full max-w-[600px] h-full mx-4">
        <SearchInput open={searchOpen} onOpenChange={setSearchOpen} />
      </div>

      <div className="flex-1 flex justify-end items-center gap-2 lg:gap-3 h-full text-neutral-900">
        <div className="h-full flex items-center">
          {user ? (
            <div className="relative" ref={acctRef}>
              <Button
                variant="ghost"
                className="h-9 px-2 md:px-3 rounded-full cursor-pointer text-neutral-900 hover:text-[var(--brand-secondary)] hover:bg-black/5 inline-flex items-center gap-2"
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
                <User />
                <span className="text-sm hidden md:inline">{user?.username || user?.email || 'Tài khoản'}</span>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 px-2 md:px-3 rounded-full cursor-pointer text-neutral-900 hover:text-[var(--color-seagull-300)] hover:bg-black/5"
                  aria-label="Đăng nhập / Đăng ký"
                  onClick={handleAuthClick}
                >
                  <User className="2xl:mr-2" />
                  <span className="text-sm hidden md:inline">Đăng nhập / Đăng ký</span>
                  <span className="sr-only">Đăng nhập / Đăng ký</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white">
                Đăng nhập / Đăng ký
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {!disableLanguage && (
          <div className="flex items-center gap-2 h-full min-w-20 text-neutral-900">
            <Select value={lang} onValueChange={handleLangChange}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="rounded-full hover:bg-black/5 border-none shadow-none cursor-pointer hover:py-3 text-neutral-900 hover:text-[var(--brand-secondary)]">
                    <span className="inline-flex items-center gap-2">
                      {lang === 'en' && (
                        <>
                          <Image src="/images/flags/us.svg" alt="English" width={24} height={16} className="h-4 w-6" />
                          <span className="text-sm hidden 2xl:inline">English</span>
                        </>
                      )}
                      {lang === 'vi' && (
                        <>
                          <Image src="/images/flags/vi.svg" alt="Vietnamese" width={24} height={16} className="h-4 w-6" />
                          <span className="text-sm hidden 2xl:inline">Tiếng Việt</span>
                        </>
                      )}
                      {lang === 'ja' && (
                        <>
                          <Image src="/images/flags/ja.svg" alt="Japanese" width={24} height={16} className="h-4 w-6" />
                          <span className="text-sm hidden 2xl:inline">日本語</span>
                        </>
                      )}
                      <span className="sr-only">Language</span>
                    </span>
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black text-white">
                  {lang === 'en' ? 'English' : lang === 'vi' ? 'Tiếng Việt' : '日本語'}
                </TooltipContent>
              </Tooltip>
              <SelectContent className='bg-white'>
                <SelectItem value="en">
                  <span className="inline-flex items-center gap-2">
                    <Image src="/images/flags/us.svg" alt="English" width={24} height={16} className="h-4 w-6" />
                    <span>English</span>
                  </span>
                </SelectItem>
                <SelectItem value="vi">
                  <span className="inline-flex items-center gap-2">
                    <Image src="/images/flags/vi.svg" alt="Vietnamese" width={24} height={16} className="h-4 w-6" />
                    <span>Tiếng Việt</span>
                  </span>
                </SelectItem>
                <SelectItem value="ja">
                  <span className="inline-flex items-center gap-2">
                    <Image src="/images/flags/ja.svg" alt="Japanese" width={24} height={16} className="h-4 w-6" />
                    <span>日本語</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative" ref={supportRef}>
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer px-2 md:px-3 py-2 shadow-none border-none text-neutral-900 hover:text-[var(--brand-secondary)] hover:bg-black/5"
                aria-label="Hỗ trợ"
                title="Hỗ trợ"
                onClick={() => setSupportOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={supportOpen}
                aria-controls="support-menu"
                ref={supportBtnRef}
                onKeyDown={(e) => {
                  if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !supportOpen) {
                    e.preventDefault()
                    setSupportOpen(true)
                  } else if (e.key === 'Escape' && supportOpen) {
                    e.preventDefault()
                    setSupportOpen(false)
                    supportBtnRef.current?.focus()
                  }
                }}
              >
                <HelpCircle className="size-5" />
                <span className="hidden 2xl:inline ml-2 text-sm font-medium">Hỗ trợ</span>
              </Button>
              {supportOpen && (
                <div
                  id="support-menu"
                  role="menu"
                  aria-label="Hỗ trợ & Chính sách"
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white text-black shadow-lg ring-1 ring-black/10 py-1"
                  onKeyDown={(e) => {
                    const idx = supportItemRefs.current.findIndex((el) => el === document.activeElement)
                    const len = Math.max(1, supportItemRefs.current.length)
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      const next = (idx + 1) % len
                      supportItemRefs.current[next]?.focus()
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      const prev = (idx - 1 + len) % len
                      supportItemRefs.current[prev]?.focus()
                    } else if (e.key === 'Home') {
                      e.preventDefault()
                      supportItemRefs.current[0]?.focus()
                    } else if (e.key === 'End') {
                      e.preventDefault()
                      supportItemRefs.current[len - 1]?.focus()
                    } else if (e.key === 'Escape') {
                      e.preventDefault()
                      setSupportOpen(false)
                      supportBtnRef.current?.focus()
                    }
                  }}
                >
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <div className="text-sm font-semibold">Hỗ trợ & Chính sách</div>
                    <div className="text-xs text-neutral-500">Chúng tôi luôn sẵn sàng giúp bạn</div>
                  </div>
                  <ul>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.help} role="menuitem" ref={(el) => { supportItemRefs.current[0] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <HelpCircle className="h-4 w-4" />
                        <span>Trung tâm trợ giúp</span>
                      </Link>
                    </li>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.contact} role="menuitem" ref={(el) => { supportItemRefs.current[1] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <Phone className="h-4 w-4" />
                        <span>Liên hệ</span>
                      </Link>
                    </li>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.shipping} role="menuitem" ref={(el) => { supportItemRefs.current[2] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <Truck className="h-4 w-4" />
                        <span>Vận chuyển</span>
                      </Link>
                    </li>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.return} role="menuitem" ref={(el) => { supportItemRefs.current[3] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <Undo2 className="h-4 w-4" />
                        <span>Đổi trả</span>
                      </Link>
                    </li>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.terms} role="menuitem" ref={(el) => { supportItemRefs.current[4] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <FileText className="h-4 w-4" />
                        <span>Điều khoản</span>
                      </Link>
                    </li>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.privacy} role="menuitem" ref={(el) => { supportItemRefs.current[5] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <Shield className="h-4 w-4" />
                        <span>Quyền riêng tư</span>
                      </Link>
                    </li>
                    <li className="px-2 py-1.5">
                      <Link href={ROUTES.about} role="menuitem" ref={(el) => { supportItemRefs.current[6] = el }} className="flex items-center gap-2 w-full text-left text-sm px-2 py-2 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-lg">
                        <Info className="h-4 w-4" />
                        <span>Về chúng tôi</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-black text-white">Hỗ trợ</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full cursor-pointer px-2 md:px-3 py-2 shadow-none border-none text-neutral-900 hover:text-[var(--brand-secondary)] hover:bg-black/5"
              aria-label="Tra cứu đơn hàng"
              title="Tra cứu đơn hàng"
              asChild
            >
              <Link href={ROUTES.ordersLookup} className="inline-flex">
                <FileText className="size-5" />
                <span className="hidden 2xl:inline ml-2 text-sm font-medium">Tra cứu đơn</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-black text-white">Tra cứu đơn hàng</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                className="rounded-full cursor-pointer px-2 md:px-3 py-2 shadow-none border-none text-white hover:text-[var(--brand-secondary)] hover:bg-white/10"
                aria-label="Thông báo"
                title="Thông báo"
                onClick={() => {
                  setNotifOpen((v) => !v)
                  try {
                    // Mark as seen when opening menu
                    if (!notifOpen) window.localStorage.setItem('op_notif_last_seen', String(Date.now()))
                  } catch {}
                  setHasNewNotif(false)
                  setNewNotifCount(0)
                }}
                aria-haspopup="menu"
                aria-expanded={notifOpen}
                aria-controls="notif-menu"
                ref={notifBtnRef}
                onKeyDown={(e) => {
                  if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !notifOpen) {
                    e.preventDefault()
                    setNotifOpen(true)
                  } else if (e.key === 'Escape' && notifOpen) {
                    e.preventDefault()
                    setNotifOpen(false)
                    notifBtnRef.current?.focus()
                  }
                }}
              >
                <span className="relative flex items-center">
                  <Bell className="size-5" />
                  {hasNewNotif && newNotifCount > 0 && (
                    <span className="absolute -top-2 left-3 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold leading-none h-4 min-w-4 px-1 rounded-full">{newNotifCount}
                    </span>
                  )}
                </span>
                <span className="hidden 2xl:inline ml-2 text-sm font-medium">Thông báo</span>
              </Button>
              {notifOpen && (
                <div
                  id="notif-menu"
                  role="menu"
                  aria-label="Thông báo đơn hàng"
                  className="absolute right-0 mt-2 w-[360px] max-w-[90vw] rounded-lg sm:rounded-xl bg-white text-black shadow-lg ring-1 ring-black/10 py-0.5 sm:py-1"
                  onKeyDown={(e) => {
                    const idx = notifItemRefs.current.findIndex((el) => el === document.activeElement)
                    const len = Math.max(1, notifItemRefs.current.length)
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      const next = (idx + 1) % len
                      notifItemRefs.current[next]?.focus()
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      const prev = (idx - 1 + len) % len
                      notifItemRefs.current[prev]?.focus()
                    } else if (e.key === 'Home') {
                      e.preventDefault()
                      notifItemRefs.current[0]?.focus()
                    } else if (e.key === 'End') {
                      e.preventDefault()
                      notifItemRefs.current[len - 1]?.focus()
                    } else if (e.key === 'Escape') {
                      e.preventDefault()
                      setNotifOpen(false)
                      notifBtnRef.current?.focus()
                    }
                  }}
                >
                  <div className="px-2.5 sm:px-3 py-2 sm:py-2.5 border-b border-neutral-100">
                    <div className="text-xs sm:text-sm font-semibold truncate">Thông báo</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 line-clamp-1">Cập nhật mới nhất về đơn hàng của bạn</div>
                  </div>
                  <ul className="max-h-[65vh] sm:max-h-80 overflow-auto">
                    {(notifOrders?.items ?? []).length === 0 && (
                      <li className="px-2.5 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm text-neutral-500">Chưa có thông báo</li>
                    )}
                    {(notifOrders?.items ?? []).map((o, idx) => (
                      <li key={o.id} className="px-1.5 sm:px-2 py-1">
                        <Link
                          href={`/profile?section=orders&tab=all&page=1&limit=10`}
                          role="menuitem"
                          ref={(el) => { notifItemRefs.current[idx] = el }}
                          className="flex items-start gap-1.5 sm:gap-2 w-full text-left px-1.5 sm:px-2 py-2 sm:py-2.5 hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none rounded-md sm:rounded-lg"
                        >
                          <div className="mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
                              <div className="font-medium text-[11px] sm:text-sm truncate">Đơn {o.code || o.orderCode || o.id}</div>
                              <div className="text-[10px] sm:text-[11px] text-neutral-500 shrink-0">{o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit' }) : ''}</div>
                            </div>
                            <div className="text-[10px] sm:text-[13px] text-neutral-600 truncate">Trạng thái: {statusLabel(o.status)}</div>
                          </div>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-400 shrink-0 mt-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-1.5 sm:px-2 pt-1 pb-1.5 sm:pb-2 border-t border-neutral-100">
                    <Link
                      href={`${ROUTES.profile}?section=orders&tab=all&page=1&limit=10`}
                      className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-neutral-100 font-medium"
                    >
                      Xem tất cả đơn hàng
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-black text-white">Thông báo</TooltipContent>
        </Tooltip>

        <Sheet modal={false}>
          <Tooltip>
            <SheetTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                className="relative rounded-full cursor-pointer px-2 md:px-3 py-2 shadow-none border-none text-neutral-900 hover:text-[var(--color-seagull-300)] hover:bg-black/5"
                  aria-label="Giỏ hàng"
                  title="Giỏ hàng"
                >
                  <span className="relative flex items-center">
                    <IoCartOutline className="h-7 w-7" />
                    <span className="absolute -top-2 left-3 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold leading-none h-4 min-w-4 px-1 rounded-full">
                      {cartQty}
                    </span>
                  </span>
                  <span className="sr-only">Số sản phẩm trong giỏ: {cartQty}</span>
                </Button>
              </TooltipTrigger>
            </SheetTrigger>
            <TooltipContent side="bottom" className="bg-black text-white">
              Giỏ hàng
            </TooltipContent>
          </Tooltip>
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
    </div>
  )
}

export default DesktopHeaderBar



