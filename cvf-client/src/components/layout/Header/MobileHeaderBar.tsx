"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IoCartOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import CartMiniClient from '@/components/cart/CartMiniClient'
import SearchInput from './SearchInput'
import { useSmartCart } from '@/hook/useCart'
import { Menu, User as UserIcon, ClipboardList, ShoppingCart as ShoppingCartIcon, LayoutGrid, HelpCircle, Phone, Truck, Undo2, FileText, Shield, Info, ChevronDown, ChevronRight, Clock, Eye, Star, Flame, Sparkles, Bell } from 'lucide-react'
import { ROUTES } from '@/constant/route'
import { categoryService, type Category } from '@/service/category.service'
import { buildProductDetailPath, buildProductsWithParams } from '@/constant/route'
import { useAuthProfile } from '@/hook/useAuth'
import { useAuthModalStore } from '@/store/authModal'
import { useMyOrdersPaginated } from '@/hook/useOrder'
import { statusLabel } from '@/constant/order-status'

const MobileHeaderBar: React.FC = () => {
  const smartCart = useSmartCart()
  const cartQty = smartCart.totalItems

  const { data: user } = useAuthProfile()
  const openAuth = useAuthModalStore((s) => s.openWith)

  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement | null>(null)
  const notifBtnRef = useRef<HTMLButtonElement | null>(null)
  const notifItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])

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
    if (!notifOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (!notifRef.current) return
      if (!notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    const t = setTimeout(() => notifItemRefs.current[0]?.focus(), 0)
    return () => { document.removeEventListener('mousedown', onDocClick); clearTimeout(t) }
  }, [notifOpen])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="shrink-0">
          <Sheet modal={false}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full p-2 text-white hover:text-[var(--brand-secondary)] hover:bg-white/10"
                aria-label="Menu"
                title="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[82vw] max-w-sm">
              <SheetHeader className="pb-3">
                <SheetTitle className="text-base sm:text-lg truncate">Menu</SheetTitle>
              </SheetHeader>
              <MenuContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="LắcKey"
          >
            <Image
              src="/logo/logo.jpg"
              alt="LắcKey"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              priority
            />
            <span className="font-gumicons text-lg leading-none tracking-[-0.02em] select-none logo-strong text-white">
              LắcKey
            </span>
          </Link>
        </div>

        <div className="shrink-0 inline-flex items-center gap-1">
          {user ? (
            <Link
              href={ROUTES.profile}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-white hover:text-[var(--brand-secondary)] hover:bg-white/10 max-w-[140px]"
              aria-label="Hồ sơ của tôi"
              title={user?.username || user?.email || 'Hồ sơ của tôi'}
            >
              <UserIcon className="h-5 w-5" />
              <span className="text-sm truncate">{user?.username || user?.email}</span>
            </Link>
          ) : (
            <Button
              variant="ghost"
              className="rounded-full p-2 text-white hover:text-[var(--brand-secondary)] hover:bg-white/10"
              aria-label="Đăng nhập / Đăng ký"
              title="Đăng nhập / Đăng ký"
              onClick={() => openAuth('signin')}
            >
              <UserIcon className="h-5 w-5" />
            </Button>
          )}

          <div className="relative" ref={notifRef}>
            <Button
              ref={notifBtnRef}
              variant="ghost"
              className="relative rounded-full cursor-pointer px-2 py-2 shadow-none border-none text-white hover:text-[var(--brand-secondary)] hover:bg-white/10"
              aria-label="Thông báo"
              title="Thông báo"
              onClick={() => {
                setNotifOpen((v) => !v)
                try {
                  if (!notifOpen) window.localStorage.setItem('op_notif_last_seen', String(Date.now()))
                } catch {}
                setHasNewNotif(false)
                setNewNotifCount(0)
              }}
              aria-haspopup="menu"
              aria-expanded={notifOpen}
              aria-controls="mobile-notif-menu"
            >
              <span className="relative flex items-center">
                <Bell className="h-6 w-6" />
                {hasNewNotif && newNotifCount > 0 && (
                  <span className="absolute -top-1 left-3 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold leading-none h-4 min-w-4 px-1 rounded-full">{newNotifCount}</span>
                )}
              </span>
            </Button>
            {notifOpen && (
              <div
                id="mobile-notif-menu"
                role="menu"
                aria-label="Thông báo đơn hàng"
                className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-14 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-auto sm:min-w-[360px] sm:max-w-sm rounded-xl bg-white text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:shadow-2xl ring-1 ring-black/5 sm:ring-black/10 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200"
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
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-neutral-100 bg-gradient-to-r from-white to-neutral-50">
                  <div className="text-sm sm:text-base font-semibold text-black">Thông báo</div>
                  <div className="text-xs sm:text-sm text-neutral-500 mt-0.5">Cập nhật mới nhất về đơn hàng của bạn</div>
                </div>
                <ul className="max-h-[calc(100vh-180px)] sm:max-h-80 overflow-y-auto overscroll-contain">
                  {(notifOrders?.items ?? []).length === 0 && (
                    <li className="px-4 py-6 text-center">
                      <Bell className="h-8 w-8 mx-auto text-neutral-300 mb-2" />
                      <div className="text-sm text-neutral-500">Chưa có thông báo</div>
                    </li>
                  )}
                  {(notifOrders?.items ?? []).map((o, idx) => (
                    <li key={o.id} className="border-b border-neutral-50 last:border-b-0">
                      <Link
                        href={`/profile?section=orders&tab=all&page=1&limit=10`}
                        role="menuitem"
                        ref={(el) => { notifItemRefs.current[idx] = el }}
                        className="flex items-start gap-2.5 sm:gap-3 w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none active:bg-neutral-100 transition-colors"
                        onClick={() => setNotifOpen(false)}
                      >
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-sm" aria-hidden />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-semibold text-xs sm:text-sm text-black">Đơn hàng #{o.code || o.orderCode || o.id}</div>
                            <div className="text-[10px] sm:text-xs text-neutral-400 shrink-0 mt-0.5">{o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</div>
                          </div>
                          <div className="text-xs sm:text-sm text-neutral-600">
                            <span className="text-neutral-500">Trạng thái:</span> <span className="font-medium">{statusLabel(o.status)}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0 mt-2" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-neutral-100 bg-neutral-50">
                  <Link
                    href="/profile?section=orders&tab=all&page=1&limit=10"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-3 py-2 sm:py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-neutral-200 text-black"
                    onClick={() => setNotifOpen(false)}
                  >
                    Xem tất cả đơn hàng
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Sheet modal={false}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="relative rounded-full cursor-pointer px-2 py-2 shadow-none border-none text-white hover:text-[var(--brand-secondary)] hover:bg-white/10"
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
      </div>

      <div className="w-full">
        <SearchInput
          containerClassName="w-full"
          inputClassName="h-9"
          buttonPaddingClass="px-2.5 py-1.5"
          iconSizeClass="h-4 w-4"
        />
      </div>
    </div>
  )
}

export default MobileHeaderBar

const MenuContent: React.FC = () => {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [recentCats, setRecentCats] = useState<Array<{ slug: string; name: string }>>([])
  const [recentProducts, setRecentProducts] = useState<Array<{ idOrSlug: string; name: string; imageUrl?: string }>>([])
  useEffect(() => {
    let mounted = true
    categoryService
      .headerTop()
      .then((res) => {
        if (!mounted) return
        setCats(res || [])
      })
      .catch(() => {
        if (!mounted) return
        setError('Không thể tải danh mục')
      })
      .finally(() => mounted && setLoading(false))
    try {
      const rc = window.localStorage.getItem('op_recent_categories')
      const rp = window.localStorage.getItem('op_recent_products')
      if (rc) setRecentCats(JSON.parse(rc))
      if (rp) setRecentProducts(JSON.parse(rp))
    } catch {}
    return () => { mounted = false }
  }, [])

  const topCats = useMemo(() => cats, [cats])

  return (
    <nav className="mt-3 space-y-3 text-sm">
      <Section title="Tài khoản">
        <MenuLink href={ROUTES.profile} icon={<UserIcon className="h-4 w-4 text-neutral-600" />}>Đăng nhập / Hồ sơ</MenuLink>
        <MenuLink href={ROUTES.orders} icon={<ClipboardList className="h-4 w-4 text-neutral-600" />}>Đơn hàng của tôi</MenuLink>
        <MenuLink href={ROUTES.cart} icon={<ShoppingCartIcon className="h-4 w-4 text-neutral-600" />}>Giỏ hàng</MenuLink>
      </Section>

      <Section title="Danh mục" defaultOpen>
        {loading && <div className="px-2 py-1.5 text-neutral-500">Đang tải...</div>}
        {error && <div className="px-2 py-1.5 text-red-500">{error}</div>}
        {!loading && !error && (
          <ul className="grid grid-cols-2 gap-1">
            {topCats.map((c) => (
              <li key={c.id}>
                <Link
                  href={{ pathname: ROUTES.products, query: { category: c.slug } }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 text-black"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="truncate">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="pt-1">
          <Link href={ROUTES.products} className="inline-flex items-center gap-2 px-2 py-1.5 rounded text-[13px] font-medium text-black hover:bg-neutral-100">
            <LayoutGrid className="h-4 w-4 text-neutral-600" />
            <span>Xem tất cả sản phẩm</span>
          </Link>
        </div>
      </Section>

      <Section title="Đã xem gần đây">
        {recentCats.length === 0 && recentProducts.length === 0 && (
          <div className="px-2 py-1.5 text-neutral-500">Chưa có mục nào</div>
        )}
        {recentCats.length > 0 && (
          <div className="px-2 pb-2">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-neutral-500">
              <Eye className="h-3.5 w-3.5" />
              <span>Danh mục</span>
            </div>
            <ul className="flex flex-wrap gap-1">
              {recentCats.slice(0, 8).map((rc) => (
                <li key={rc.slug}>
                  <Link
                    href={{ pathname: ROUTES.products, query: { category: rc.slug } }}
                    className="inline-flex items-center gap-2 px-2 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-100 text-black"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="truncate max-w-[120px]">{rc.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {recentProducts.length > 0 && (
          <div className="px-2 pt-1">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-neutral-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Sản phẩm</span>
            </div>
            <ul className="space-y-1">
              {recentProducts.slice(0, 6).map((rp) => (
                <li key={rp.idOrSlug}>
                  <Link
                    href={buildProductDetailPath(rp.idOrSlug)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 text-black"
                  >
                    {rp.imageUrl ? (
                      <Image src={rp.imageUrl} alt={rp.name} width={28} height={28} className="h-7 w-7 rounded object-cover bg-neutral-100" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                    )}
                    <span className="truncate">{rp.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Bộ sưu tập nổi bật">
        <div className="grid grid-cols-2 gap-1 px-1">
          <CollectionLink label="Flash Sale" icon={<Flame className="h-4 w-4 text-neutral-700" />} params={{ sale: 'true' }} />
          <CollectionLink label="Bán chạy" icon={<Star className="h-4 w-4 text-neutral-700" />} params={{ sort: 'popular' }} />
          <CollectionLink label="Hàng mới" icon={<Sparkles className="h-4 w-4 text-neutral-700" />} params={{ sort: 'new' }} />
          <CollectionLink label="Giá tốt" icon={<TagPill />} params={{ sort: 'price_asc' }} />
        </div>
      </Section>

      <Section title="Hỗ trợ & Chính sách">
        <MenuLink href={ROUTES.help} icon={<HelpCircle className="h-4 w-4 text-neutral-600" />}>Trung tâm trợ giúp</MenuLink>
        <MenuLink href={ROUTES.contact} icon={<Phone className="h-4 w-4 text-neutral-600" />}>Liên hệ</MenuLink>
        <MenuLink href={ROUTES.shipping} icon={<Truck className="h-4 w-4 text-neutral-600" />}>Vận chuyển</MenuLink>
        <MenuLink href={ROUTES.return} icon={<Undo2 className="h-4 w-4 text-neutral-600" />}>Đổi trả</MenuLink>
        <MenuLink href={ROUTES.terms} icon={<FileText className="h-4 w-4 text-neutral-600" />}>Điều khoản</MenuLink>
        <MenuLink href={ROUTES.privacy} icon={<Shield className="h-4 w-4 text-neutral-600" />}>Quyền riêng tư</MenuLink>
        <MenuLink href={ROUTES.about} icon={<Info className="h-4 w-4 text-neutral-600" />}>Về chúng tôi</MenuLink>
      </Section>
    </nav>
  )
}

const Section: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen)
  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 font-semibold text-black hover:bg-neutral-50"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pb-3">
          {children}
        </div>
      </div>
    </div>
  )
}

const MenuLink: React.FC<{ href: import('next/link').LinkProps['href']; icon?: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
  <Link href={href} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 text-black">
    {icon && <span aria-hidden>{icon}</span>}
    <span className="truncate">{children}</span>
  </Link>
)

const CollectionLink: React.FC<{ label: string; icon: React.ReactNode; params: Record<string, string> }> = ({ label, icon, params }) => (
  <Link
    href={buildProductsWithParams(params)}
    className="flex items-center gap-2 px-2 py-2 rounded border border-neutral-200 hover:bg-neutral-100 text-black"
  >
    <span aria-hidden>{icon}</span>
    <span className="truncate text-[13px] font-medium">{label}</span>
  </Link>
)

const TagPill: React.FC = () => (
  <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-neutral-200 text-neutral-700 text-[11px] px-1.5">₫</span>
)
