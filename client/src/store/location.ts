'use client'

import { create, type StateCreator } from 'zustand'

export type LocationState = {
  // Back-compat generic fields
  city?: string
  country?: string
  countryCode?: string
  // Vietnam granular fields
  province?: string
  district?: string
  ward?: string
  loading: boolean
  error?: string
  manual?: boolean
  recent: Array<{ city?: string; country?: string }>
  // actions
  setManualLocation: (city?: string, country?: string) => void
  setVNLocation: (province?: string, district?: string, ward?: string) => void
  requestLocation: () => void
  hydrateFromLocal: () => void
  addRecent: (city?: string, country?: string) => void
}

const LS_KEY = 'op_user_location'

type Persisted = { city?: string; country?: string; manual?: boolean; t?: number, countryCode?: string, province?: string, district?: string, ward?: string }

const reverseGeocode = async (latitude: number, longitude: number): Promise<{ city?: string; country?: string }> => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'lackey.vn/1.0 (contact: support@lackey.vn)'
    },
  })
  const data = await res.json()
  const addr = data?.address || {}
  const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county
  const country = addr.country
  return { city, country }
}

function saveLocal(data: Persisted) {
  try {
    const value = JSON.stringify({ ...data, t: Date.now() })
    window.localStorage.setItem(LS_KEY, value)
  } catch {}
}

function readLocal(): Persisted | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return undefined
    const obj = JSON.parse(raw)
    return obj || undefined
  } catch {
    return undefined
  }
}

const RECENT_KEY = 'op_user_location_recent'

function saveRecent(list: Array<{ city?: string; country?: string }>) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch {}
}

function readRecent(): Array<{ city?: string; country?: string }> {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(RECENT_KEY) || '[]'
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

const creator: StateCreator<LocationState> = (set, get) => ({
  city: undefined,
  country: undefined,
  countryCode: undefined,
  province: undefined,
  district: undefined,
  ward: undefined,
  loading: false,
  error: undefined,
  manual: undefined,
  recent: [],
  setManualLocation: (city, country) => {
    set({ city, country, province: city, district: undefined, ward: undefined, countryCode: country === 'Việt Nam' ? 'VN' : undefined, manual: true, error: undefined, loading: false })
    saveLocal({ city, country, province: city, district: undefined, ward: undefined, manual: true, countryCode: country === 'Việt Nam' ? 'VN' : undefined })
    get().addRecent(city, country)
  },
  setVNLocation: (province, district, ward) => {
    const city = province
    const country = province ? 'Việt Nam' : undefined
    set({ city, country, countryCode: country ? 'VN' : undefined, province, district, ward, manual: true, error: undefined, loading: false })
    saveLocal({ city, country, countryCode: country ? 'VN' : undefined, province, district, ward, manual: true })
    get().addRecent(city, country)
  },
  requestLocation: () => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      set({ loading: false, error: 'Không hỗ trợ định vị' })
      return
    }
    set({ loading: true, error: undefined })
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const { city, country } = await reverseGeocode(latitude, longitude)
          const countryCode = country === 'Vietnam' || country === 'Việt Nam' ? 'VN' : undefined
          set({ loading: false, city, country, countryCode, province: countryCode === 'VN' ? city : undefined, district: undefined, ward: undefined, manual: false, error: undefined })
          saveLocal({ city, country, countryCode, province: countryCode === 'VN' ? city : undefined, district: undefined, ward: undefined, manual: false })
          get().addRecent(city, country)
        } catch {
          set({ loading: false, error: 'Không thể lấy vị trí' })
        }
      },
      (err) => {
        set({ loading: false, error: err?.message || 'Quyền truy cập bị từ chối' })
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    )
  },
  hydrateFromLocal: () => {
    const data = readLocal()
    if (data && (data.city || data.country)) {
      set({ city: data.city, country: data.country, manual: data.manual, countryCode: data.countryCode, province: data.province, district: data.district, ward: data.ward })
    }
    const r = readRecent()
    if (r.length) set({ recent: r })
  },
  addRecent: (city, country) => {
    const curr = get().recent
    const next = [{ city, country }, ...curr.filter((x) => x.city !== city || x.country !== country)]
      .slice(0, 6)
    set({ recent: next })
    saveRecent(next)
  },
})

export const useLocationStore = create<LocationState>((set, get, api) => {
  const store = creator(set, get, api)
  if (typeof window !== 'undefined') {
    // hydrate on load
    store.hydrateFromLocal()
    // listen to storage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) store.hydrateFromLocal()
    }
    window.addEventListener('storage', onStorage)
    // optional: attempt auto-detect in background if nothing set
    setTimeout(() => {
      const s = get()
      if (!s.city && !s.country && !s.loading) store.requestLocation()
    }, 300)
  }
  return store
})
