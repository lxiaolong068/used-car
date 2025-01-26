'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserMenu from '../components/UserMenu'
import Link from 'next/link'
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CurrencyYenIcon
} from '@heroicons/react/24/outline'

// 导航菜单项配置
const navigation = [
  { name: '仪表盘', href: '/dashboard', icon: HomeIcon },
  { name: '用户管理', href: '/dashboard/users', icon: UsersIcon },
  { name: '车辆管理', href: '/dashboard/cars', icon: TruckIcon },
  { name: '费用管理', href: '/dashboard/costs', icon: CurrencyYenIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    // 获取当前用户信息
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUsername(data.username)
        } else {
          // 如果未登录，重定向到登录页
          router.push('/')
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        router.push('/')
      }
    }

    fetchUserInfo()
    setCurrentPath(window.location.pathname)
  }, [router])

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
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      currentPath === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        currentPath === item.href
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-white'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
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
