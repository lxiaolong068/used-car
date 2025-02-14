'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import UserMenu from '../components/UserMenu'
import Link from 'next/link'
import { useMenu } from '@/hooks/useMenu'
import { useSession } from 'next-auth/react'
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
import { MenuProvider } from '../contexts/MenuContext'

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

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { menuItems, loading, error } = useMenu();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });

  // 如果正在加载 session，显示加载状态
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

    const isActive = pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.permission_id}>
        <Link
          href={item.path}
          className={`flex items-center p-2 text-base font-normal rounded-lg ${
            isActive
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          {Icon && (
            <Icon className="w-6 h-6 text-gray-500 transition duration-75" />
          )}
          <span className="ml-3">{item.permission_name}</span>
        </Link>
        {hasChildren && (
          <ul className="pl-4 mt-2 space-y-2">
            {item.children.map((child) => renderMenuItem(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <aside className="w-64 h-screen" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xl font-semibold">二手车管理系统</span>
          </div>
          <ul className="space-y-2">
            {menuItems?.map((item: MenuItem) => renderMenuItem(item))}
          </ul>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems?.find((item: MenuItem) => item.path === pathname)
                ?.permission_name || '仪表盘'}
            </h1>
            <UserMenu user={session?.user} />
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
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
  );
}
