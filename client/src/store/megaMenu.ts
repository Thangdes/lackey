import { create } from 'zustand'

export type MegaMenuState = {
  open: boolean
  setOpen: (open: boolean) => void
  activeMainKey: string
  setActiveMainKey: (key: string) => void
  _timer: number | null
  closeWithDelay: (ms?: number) => void
  cancelClose: () => void
}

export const useMegaMenuStore = create<MegaMenuState>((set, get) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  activeMainKey: 'clothing',
  setActiveMainKey: (key: string) => set({ activeMainKey: key }),
  _timer: null,
  closeWithDelay: (ms = 250) => {
    const { _timer } = get()
    if (_timer) window.clearTimeout(_timer)
    const id = window.setTimeout(() => set({ open: false, _timer: null }), ms)
    set({ _timer: id })
  },
  cancelClose: () => {
    const { _timer } = get()
    if (_timer) window.clearTimeout(_timer)
    set({ _timer: null })
  },
}))
