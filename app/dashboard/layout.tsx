'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import UserMenu from '../components/UserMenu'
import Link from 'next/link'
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CurrencyYenIcon,
  KeyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { MenuProvider, useMenu } from '../contexts/MenuContext'

// 图标映射
const iconMap: { [key: string]: any } = {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CurrencyYenIcon,
  KeyIcon,
  ShieldCheckIcon
}

interface MenuItem {
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
  children?: MenuItem[]
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [username, setUsername] = useState('')
  const { menuItems, loading } = useMenu()

  useEffect(() => {
    // 获取当前用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          throw new Error('获取用户信息失败')
        }
        const data = await response.json()
        setUsername(data.username)
      } catch (error: any) {
        console.error('获取用户信息失败:', error)
        // 只有在确实是未登录的情况下才跳转
        if (error.message === '获取用户信息失败') {
          router.push('/')
        }
      }
    }

    fetchUserInfo()
  }, [router])

  // 递归渲染菜单项
  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon ? iconMap[item.icon] : null

    return (
      <div key={item.permission_id}>
        {item.path && (
          <Link
            href={item.path}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              pathname === item.path
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {Icon && (
              <Icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  pathname === item.path
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
            )}
            {item.permission_name}
          </Link>
        )}
        {item.children && item.children.length > 0 && (
          <div className="ml-4 mt-1">
            {item.children
              .sort((a, b) => b.sort_order - a.sort_order)
              .map((child) => renderMenuItem(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="fixed inset-y-0 left-0 flex w-64 flex-col">
        {/* 侧边栏内容 */}
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-bold text-white">二手车管理系统</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {loading ? (
                <div className="text-gray-300 text-center py-4">加载中...</div>
              ) : menuItems && menuItems.length > 0 ? (
                menuItems
                  .sort((a, b) => b.sort_order - a.sort_order)
                  .map((item) => renderMenuItem(item))
              ) : (
                <div className="text-gray-300 text-center py-4">暂无菜单项</div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pl-64">
        {/* 顶部状态栏 */}
        <div className="sticky top-0 z-10 bg-gray-100 pl-4 pr-4 py-2 flex items-center justify-end border-b border-gray-200">
          <div className="flex items-center">
            {username && <UserMenu username={username} />}
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MenuProvider>
      <DashboardContent>{children}</DashboardContent>
    </MenuProvider>
  )
}
