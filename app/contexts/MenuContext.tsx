'use client'

import { createContext, useContext, useCallback, ReactNode } from 'react'
import useSWR from 'swr'

interface MenuItem {
  id: number
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
}

interface MenuContextType {
  menuItems: MenuItem[]
  loading: boolean
  error: Error | null
  refreshMenus: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

const fetchMenus = async (url: string): Promise<MenuItem[]> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch menus')
  }
  return res.json()
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const { data, error, mutate } = useSWR<MenuItem[]>('/api/menus', fetchMenus)

  const refreshMenus = useCallback(async () => {
    await mutate()
  }, [mutate])

  const value = {
    menuItems: data || [],
    loading: !error && !data,
    error: error || null,
    refreshMenus,
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
} 