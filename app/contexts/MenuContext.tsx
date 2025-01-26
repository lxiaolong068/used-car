'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Permission {
  permission_id: number
  parent_id: number | null
  permission_name: string
  permission_key: string
  permission_type: 'menu' | 'button' | 'api'
  path: string | null
  component: string | null
  icon: string | null
  sort_order: number
  status: number
  create_time: string
  children?: Permission[]
}

interface MenuContextType {
  menuItems: Permission[]
  setMenuItems: (items: Permission[]) => void
  refreshMenus: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<Permission[]>([])
  const router = useRouter()

  const refreshMenus = async () => {
    try {
      const permissionsResponse = await fetch('/api/permissions/menu')
      if (!permissionsResponse.ok) {
        if (permissionsResponse.status === 401) {
          router.push('/')
          return
        }
        throw new Error('获取菜单失败')
      }
      const permissionsData = await permissionsResponse.json()
      setMenuItems(permissionsData)
    } catch (error: any) {
      console.error('获取菜单失败:', error)
      if (error.message === '获取菜单失败') {
        router.push('/')
      }
    }
  }

  useEffect(() => {
    refreshMenus()
  }, [])

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems, refreshMenus }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
} 