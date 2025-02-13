'use client'

import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import UserMenu from '../components/UserMenu'
import Link from 'next/link'
import { useMenu } from '@/hooks/useMenu'
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CurrencyYenIcon,
  KeyIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { MenuProvider, useMenu as useMenuContext } from '../contexts/MenuContext'
import { jwtVerify } from 'jose'

// 图标映射
const iconMap: { [key: string]: any } = {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CurrencyYenIcon,
  KeyIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  DocumentTextIcon
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

interface UserInfo {
  username: string;
  role: string;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { menuItems, loading, error } = useMenu();
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 从 API 获取用户信息
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('获取用户信息失败');
        }
      } catch (error) {
        console.error('获取用户信息出错:', error);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          加载中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">加载出错：{error}</div>
      </div>
    );
  }

  // 递归渲染菜单项
  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon ? iconMap[item.icon] : null;

    if (!item.path) {
      return null;
    }

    return (
      <div key={item.permission_id}>
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
        {item.children && item.children.length > 0 && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => renderMenuItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="fixed inset-y-0 left-0 flex w-64 flex-col">
        {/* 侧边栏内容 */}
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-bold text-white">二手车管理系统</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {menuItems?.map((item: MenuItem) => renderMenuItem(item))}
            </nav>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pl-64 flex flex-1 flex-col">
        {/* 顶部导航栏 */}
        <div className="sticky top-0 z-10 bg-white pl-4 pr-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex-1"></div>
          <div className="flex items-center">
            {user && <UserMenu username={user.username} role={user.role} />}
          </div>
        </div>

        {/* 主要内容 */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
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
