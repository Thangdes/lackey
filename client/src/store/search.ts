'use client'

import { create, type StateCreator } from 'zustand'

export type SearchState = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const creator: StateCreator<SearchState> = (set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
})

export const useSearchStore = create<SearchState>(creator)
