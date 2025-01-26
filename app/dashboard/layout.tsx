'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserMenu from '../components/UserMenu'

// 导航菜单项配置
const navigation = [
  { name: '用户管理', href: '/dashboard/users' },
  { name: '车辆管理', href: '/dashboard/cars' },
  { name: '费用管理', href: '/dashboard/costs' },
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
      <nav className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center flex-shrink-0">
                <span className="text-xl font-bold text-gray-800">二手车管理系统</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      currentPath.startsWith(item.href)
                        ? 'text-indigo-600 border-b-2 border-indigo-500'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              {username && <UserMenu username={username} />}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
