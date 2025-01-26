'use client'

import { useState, useEffect } from 'react'
import Modal from '@/app/components/ui/Modal'

interface Role {
  role_id: number
  role_name: string
  role_key: string
  description: string
  create_time: string
}

interface FormData {
  role_name: string
  role_key: string
  description: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    role_name: '',
    role_key: '',
    description: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (!response.ok) {
        throw new Error('获取角色列表失败')
      }
      const data = await response.json()
      setRoles(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取角色列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingRole ? `/api/roles/${editingRole.role_id}` : '/api/roles'
      const method = editingRole ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(editingRole ? '更新角色失败' : '创建角色失败')
      }

      setIsModalOpen(false)
      setFormData({ role_name: '', role_key: '', description: '' })
      setEditingRole(null)
      fetchRoles()
    } catch (error) {
      setError(error instanceof Error ? error.message : '操作失败')
    }
  }

  // 处理删除
  const handleDelete = async (roleId: number) => {
    if (!confirm('确定要删除这个角色吗？')) {
      return
    }

    setIsDeleting(true)
    setDeleteRoleId(roleId)

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除角色失败')
      }

      fetchRoles()
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除角色失败')
    } finally {
      setIsDeleting(false)
      setDeleteRoleId(null)
    }
  }

  // 处理编辑
  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      role_name: role.role_name,
      role_key: role.role_key,
      description: role.description
    })
    setIsModalOpen(true)
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
          <h1 className="text-xl font-semibold text-gray-900">角色管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            系统中的所有角色列表，您可以添加新角色或管理现有角色。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingRole(null)
              setFormData({ role_name: '', role_key: '', description: '' })
              setIsModalOpen(true)
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            添加角色
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      角色名称
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      角色标识
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      描述
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      创建时间
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {roles.map((role) => (
                    <tr key={role.role_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {role.role_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {role.role_key}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {role.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(role.create_time).toLocaleString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex space-x-4 justify-end">
                          <button
                            onClick={() => handleEdit(role)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            编辑
                          </button>
                          {role.role_key !== 'super_admin' && (
                            <button
                              onClick={() => handleDelete(role.role_id)}
                              disabled={isDeleting && deleteRoleId === role.role_id}
                              className={`text-red-600 hover:text-red-900 disabled:opacity-50 ${
                                isDeleting && deleteRoleId === role.role_id ? 'cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              {isDeleting && deleteRoleId === role.role_id ? '删除中...' : '删除'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRole(null)
          setFormData({ role_name: '', role_key: '', description: '' })
        }}
        title={editingRole ? '编辑角色' : '添加角色'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="role_name" className="block text-sm font-medium text-gray-700">
              角色名称
            </label>
            <input
              type="text"
              name="role_name"
              id="role_name"
              required
              value={formData.role_name}
              onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="role_key" className="block text-sm font-medium text-gray-700">
              角色标识
            </label>
            <input
              type="text"
              name="role_key"
              id="role_key"
              required
              value={formData.role_key}
              onChange={(e) => setFormData({ ...formData, role_key: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            >
              {editingRole ? '更新' : '添加'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingRole(null)
                setFormData({ role_name: '', role_key: '', description: '' })
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
