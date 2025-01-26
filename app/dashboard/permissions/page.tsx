'use client'

import React, { useState, useEffect } from 'react'
import Modal from '@/app/components/ui/Modal'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  CurrencyYenIcon,
  KeyIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon,
  FolderIcon,
  InboxIcon,
  ListBulletIcon,
  PhotoIcon,
  TableCellsIcon,
  WrenchIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

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

interface FormData {
  parent_id: number | null
  permission_name: string
  permission_key: string
  permission_type: 'menu' | 'button' | 'api'
  path: string
  component: string
  icon: string
  sort_order: number
  status: number
}

const availableIcons = {
  HomeIcon,           // 首页
  UsersIcon,         // 用户
  UserGroupIcon,     // 用户组/团队
  TruckIcon,         // 车辆
  CurrencyYenIcon,   // 费用/金额
  KeyIcon,           // 权限
  ShieldCheckIcon,   // 角色
  Cog6ToothIcon,     // 设置
  DocumentTextIcon,  // 文档/报表
  ChartBarIcon,      // 图表/统计
  BellIcon,          // 通知/提醒
  CalendarIcon,      // 日历/日期
  FolderIcon,        // 文件夹/分类
  InboxIcon,         // 收件箱/消息
  ListBulletIcon,    // 列表
  PhotoIcon,         // 图片/相册
  TableCellsIcon,    // 表格/数据
  WrenchIcon,        // 工具/维修
  BuildingOfficeIcon, // 公司/部门
  ClipboardDocumentListIcon // 清单/检查
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    parent_id: null,
    permission_name: '',
    permission_key: '',
    permission_type: 'menu',
    path: '',
    component: '',
    icon: '',
    sort_order: 0,
    status: 1
  })
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)

  // 获取权限列表
  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions')
      if (!response.ok) {
        throw new Error('获取权限列表失败')
      }
      const data = await response.json()
      // 将扁平结构转换为树形结构
      const transformToTree = (items: Permission[], parentId: number | null = null): Permission[] => {
        return items
          .filter(item => item.parent_id === parentId)
          .map(item => ({
            ...item,
            children: transformToTree(items, item.permission_id)
          }))
      }
      setPermissions(transformToTree(data))
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取权限列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPermission 
        ? `/api/permissions/${editingPermission.permission_id}` 
        : '/api/permissions'
      const method = editingPermission ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(editingPermission ? '更新权限失败' : '创建权限失败')
      }

      setIsModalOpen(false)
      setFormData({
        parent_id: null,
        permission_name: '',
        permission_key: '',
        permission_type: 'menu',
        path: '',
        component: '',
        icon: '',
        sort_order: 0,
        status: 1
      })
      setEditingPermission(null)
      fetchPermissions()
    } catch (error) {
      setError(error instanceof Error ? error.message : '操作失败')
    }
  }

  // 处理删除
  const handleDelete = async (permissionId: number) => {
    if (!confirm('确定要删除这个权限吗？这可能会影响到相关的角色和用户。')) {
      return
    }

    try {
      const response = await fetch(`/api/permissions/${permissionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除权限失败')
      }

      fetchPermissions()
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除权限失败')
    }
  }

  // 处理编辑
  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setFormData({
      parent_id: permission.parent_id,
      permission_name: permission.permission_name,
      permission_key: permission.permission_key,
      permission_type: permission.permission_type,
      path: permission.path || '',
      component: permission.component || '',
      icon: permission.icon || '',
      sort_order: permission.sort_order,
      status: permission.status
    })
    setIsModalOpen(true)
  }

  // 渲染权限树
  const renderPermissionTree = (items: Permission[]) => {
    return items.map((item) => (
      <div key={item.permission_id} className="ml-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{item.permission_name}</span>
            <span className="text-xs text-gray-500">({item.permission_key})</span>
            <span className={`text-xs px-2 py-1 rounded ${
              item.permission_type === 'menu' ? 'bg-blue-100 text-blue-800' :
              item.permission_type === 'button' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {item.permission_type}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(item.permission_id)}
              className="text-red-600 hover:text-red-900"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        {item.children && item.children.length > 0 && (
          <div className="border-l border-gray-200">
            {renderPermissionTree(item.children)}
          </div>
        )}
      </div>
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">{error}</div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">权限管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理系统的权限，包括菜单、按钮和API权限。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingPermission(null)
              setFormData({
                parent_id: null,
                permission_name: '',
                permission_key: '',
                permission_type: 'menu',
                path: '',
                component: '',
                icon: '',
                sort_order: 0,
                status: 1
              })
              setIsModalOpen(true)
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            添加权限
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {renderPermissionTree(permissions)}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPermission(null)
          setFormData({
            parent_id: null,
            permission_name: '',
            permission_key: '',
            permission_type: 'menu',
            path: '',
            component: '',
            icon: '',
            sort_order: 0,
            status: 1
          })
        }}
        title={editingPermission ? '编辑权限' : '添加权限'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
              父级权限
            </label>
            <select
              id="parent_id"
              name="parent_id"
              value={formData.parent_id || ''}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">无</option>
              {permissions.map((p) => (
                <option key={p.permission_id} value={p.permission_id}>
                  {p.permission_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="permission_name" className="block text-sm font-medium text-gray-700">
              权限名称
            </label>
            <input
              type="text"
              name="permission_name"
              id="permission_name"
              required
              value={formData.permission_name}
              onChange={(e) => setFormData({ ...formData, permission_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="permission_key" className="block text-sm font-medium text-gray-700">
              权限标识
            </label>
            <input
              type="text"
              name="permission_key"
              id="permission_key"
              required
              value={formData.permission_key}
              onChange={(e) => setFormData({ ...formData, permission_key: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="permission_type" className="block text-sm font-medium text-gray-700">
              权限类型
            </label>
            <select
              id="permission_type"
              name="permission_type"
              value={formData.permission_type}
              onChange={(e) => setFormData({ ...formData, permission_type: e.target.value as 'menu' | 'button' | 'api' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="menu">菜单</option>
              <option value="button">按钮</option>
              <option value="api">接口</option>
            </select>
          </div>

          {formData.permission_type === 'menu' && (
            <>
              <div>
                <label htmlFor="path" className="block text-sm font-medium text-gray-700">
                  路由路径
                </label>
                <input
                  type="text"
                  name="path"
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="/dashboard/example"
                />
                <p className="mt-1 text-sm text-gray-500">
                  请输入以/dashboard开头的路由路径，例如：/dashboard/users
                </p>
              </div>

              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                  图标
                </label>
                <select
                  id="icon"
                  name="icon"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">无图标</option>
                  {Object.keys(availableIcons).map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
                {formData.icon && availableIcons[formData.icon as keyof typeof availableIcons] && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">预览：</span>
                    {React.createElement(availableIcons[formData.icon as keyof typeof availableIcons], {
                      className: "h-6 w-6 text-gray-600 inline-block ml-2"
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
              排序
            </label>
            <input
              type="number"
              name="sort_order"
              id="sort_order"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              状态
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={1}>启用</option>
              <option value={0}>禁用</option>
            </select>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            >
              {editingPermission ? '更新' : '添加'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingPermission(null)
                setFormData({
                  parent_id: null,
                  permission_name: '',
                  permission_key: '',
                  permission_type: 'menu',
                  path: '',
                  component: '',
                  icon: '',
                  sort_order: 0,
                  status: 1
                })
              }}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            >
              取消
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
} 