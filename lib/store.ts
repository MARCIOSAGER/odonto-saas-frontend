"use client"
import { create } from "zustand"

type GlobalState = {
  mockMode: boolean
  setMockMode: (v: boolean) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  mockMode: false,
  setMockMode: (v) => set({ mockMode: v })
}))
