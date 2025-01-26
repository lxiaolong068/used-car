'use client'

import { useState, useEffect } from 'react'
import Modal from '@/app/components/ui/Modal'

interface User {
  user_id: number
  username: string
  role: string
  create_time: string
}

interface Role {
  role_id: number
  role_name: string
  role_key: string
  description: string
}

interface FormData {
  username: string
  password: string
  role_id: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    role_id: 7
  })
  const [formError, setFormError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('获取用户列表失败')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (!response.ok) {
        throw new Error('获取角色列表失败')
      }
      const data = await response.json()
      setRoles(data)
    } catch (err: any) {
      console.error('获取角色列表失败:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role_id' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '创建用户失败')
      }

      // 重置表单并关闭模态框
      setFormData({
        username: '',
        password: '',
        role_id: 7
      })
      setIsModalOpen(false)

      // 刷新用户列表
      fetchUsers()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  const handleEdit = (user: User) => {
    // 找到用户对应的角色ID
    const userRole = roles.find(role => role.role_key === user.role)
    setFormData({
      username: user.username,
      password: '', // 编辑时密码为空
      role_id: userRole?.role_id || 7
    })
    setEditingUserId(user.user_id)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUserId) return
    setFormError('')

    try {
      const response = await fetch(`/api/users/${editingUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '更新用户失败')
      }

      // 重置表单并关闭模态框
      setFormData({
        username: '',
        password: '',
        role_id: 7
      })
      setIsEditModalOpen(false)
      setEditingUserId(null)

      // 刷新用户列表
      fetchUsers()
    } catch (err: any) {
      setFormError(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个用户吗？')) {
      return
    }

    setDeleteUserId(id)
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '删除用户失败')
      }

      // 刷新用户列表
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
      setDeleteUserId(null)
    }
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
          <h1 className="text-xl font-semibold text-gray-900">用户管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            系统中的所有用户列表，您可以添加新用户或删除现有用户。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            添加用户
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
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      用户名
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      角色
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
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.user_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.username}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(user.create_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-4">
                          {user.role !== 'super_admin' && (
                            <>
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(user.user_id)}
                                disabled={isDeleting && deleteUserId === user.user_id}
                                className={`text-red-600 hover:text-red-900 disabled:opacity-50 ${
                                  isDeleting && deleteUserId === user.user_id ? 'cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              >
                                {isDeleting && deleteUserId === user.user_id ? '删除中...' : '删除'}
                              </button>
                            </>
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

      {/* 添加用户弹窗 */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="添加新用户"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{formError}</div>
            </div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              角色
            </label>
            <select
              id="role"
              name="role_id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.role_id}
              onChange={handleInputChange}
            >
              {roles.map(role => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              确认添加
            </button>
          </div>
        </form>
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal 
        open={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingUserId(null)
          setFormData({
            username: '',
            password: '',
            role_id: 7
          })
        }}
        title="编辑用户"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{formError}</div>
            </div>
          )}
          <div>
            <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              type="text"
              name="username"
              id="edit-username"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              name="password"
              id="edit-password"
              placeholder="留空则不修改密码"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
              角色
            </label>
            <select
              id="edit-role"
              name="role_id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.role_id}
              onChange={handleInputChange}
            >
              {roles.map(role => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              确认修改
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
