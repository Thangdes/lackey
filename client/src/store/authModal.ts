'use client'
import { create } from 'zustand'

export type AuthModalView = 'signin' | 'signup'

export type AuthModalState = {
  open: boolean
  view: AuthModalView
  setOpen: (open: boolean) => void
  openWith: (view: AuthModalView) => void
  close: () => void
  setView: (view: AuthModalView) => void
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  open: false,
  view: 'signin',
  setOpen: (open) => set({ open }),
  openWith: (view) => set({ open: true, view }),
  close: () => set({ open: false }),
  setView: (view) => set({ view }),
}))
