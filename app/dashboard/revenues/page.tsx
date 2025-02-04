'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface RevenueInfo {
  revenue_id: number
  vehicle_id: number
  amount: number
  remark: string
  revenue_phase: number
  payment_date: string
  create_time: string | null
  update_time: string | null
  car_info?: {
    vehicle_model: string
    vin: string
  }
}

interface CarInfo {
  vehicle_id: number
  vehicle_model: string
  vin: string
}

interface PaginationInfo {
  current: number
  pageSize: number
  total: number
}

export default function RevenuesPage() {
  const [revenues, setRevenues] = useState<RevenueInfo[]>([])
  const [cars, setCars] = useState<CarInfo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRevenue, setEditingRevenue] = useState<RevenueInfo | null>(null)
  const [searchVin, setSearchVin] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [pagination, setPagination] = useState<PaginationInfo>({
    current: 1,
    pageSize: 5,
    total: 0
  })
  const [formData, setFormData] = useState({
    vehicle_id: '',
    amount: '',
    remark: '',
    revenue_phase: '1',
    payment_date: format(new Date(), 'yyyy-MM-dd')
  })

  // 获取收入列表
  const fetchRevenues = async (page = 1) => {
    try {
      const response = await fetch(
        `/api/revenues?page=${page}&pageSize=${pagination.pageSize}${
          searchVin ? `&vin=${searchVin}` : ''
        }${startDate ? `&startDate=${startDate}` : ''}${
          endDate ? `&endDate=${endDate}` : ''
        }`
      )
      if (!response.ok) {
        throw new Error('获取收入列表失败')
      }
      const data = await response.json()
      setRevenues(data.data)
      setPagination(data.pagination)
      setTotalAmount(data.totalAmount)
    } catch (error) {
      console.error('获取收入列表失败:', error)
    }
  }

  // 获取车辆列表
  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars')
      if (!response.ok) {
        throw new Error('获取车辆列表失败')
      }
      const data = await response.json()
      setCars(data.data)
    } catch (error) {
      console.error('获取车辆列表失败:', error)
    }
  }

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 })) // 重置到第一页
    fetchRevenues(1)
  }

  // 监听搜索框回车事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 处理日期变化
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(e.target.value)
    } else {
      setEndDate(e.target.value)
    }
  }

  useEffect(() => {
    fetchRevenues()
    fetchCars()
  }, [])

  // 打开新增/编辑模态框
  const openModal = (revenue?: RevenueInfo) => {
    if (revenue) {
      setEditingRevenue(revenue)
      setFormData({
        vehicle_id: revenue.vehicle_id.toString(),
        amount: revenue.amount.toString(),
        remark: revenue.remark,
        revenue_phase: revenue.revenue_phase.toString(),
        payment_date: format(new Date(revenue.payment_date), 'yyyy-MM-dd')
      })
    } else {
      setEditingRevenue(null)
      setFormData({
        vehicle_id: '',
        amount: '',
        remark: '',
        revenue_phase: '1',
        payment_date: format(new Date(), 'yyyy-MM-dd')
      })
    }
    setIsModalOpen(true)
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingRevenue 
        ? `/api/revenues/${editingRevenue.revenue_id}` 
        : '/api/revenues'
      const method = editingRevenue ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          vehicle_id: parseInt(formData.vehicle_id),
          amount: parseFloat(formData.amount),
          revenue_phase: parseInt(formData.revenue_phase)
        })
      })

      if (!response.ok) {
        throw new Error(editingRevenue ? '更新收入信息失败' : '添加收入失败')
      }

      setIsModalOpen(false)
      fetchRevenues(pagination.current)
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 删除收入
  const handleDelete = async (revenueId: number) => {
    if (!confirm('确定要删除这条收入记录吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/revenues/${revenueId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('删除收入失败')
      }

      // 如果当前页只有一条数据，且不是第一页，则删除后跳转到上一页
      if (revenues.length === 1 && pagination.current > 1) {
        fetchRevenues(pagination.current - 1)
      } else {
        fetchRevenues(pagination.current)
      }
    } catch (error) {
      console.error('删除收入失败:', error)
    }
  }

  // 处理页码变化
  const handlePageChange = (page: number) => {
    fetchRevenues(page)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-x-3">
            <h1 className="text-xl font-semibold text-gray-900">收入管理</h1>
            <p className="text-sm text-gray-700">
              管理系统中的所有收入记录。
            </p>
          </div>
        </div>
      </div>

      {/* 搜索区域 */}
      <div className="mt-4 flex items-center gap-4">
        {/* 车架号搜索 */}
        <div className="w-48">
          <div className="relative">
            <input
              type="text"
              value={searchVin}
              onChange={(e) => setSearchVin(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入车架号搜索"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 开始日期 */}
        <div className="w-40">
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e, 'start')}
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="开始日期"
          />
        </div>

        {/* 结束日期 */}
        <div className="w-40">
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(e, 'end')}
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="结束日期"
          />
        </div>

        {/* 查询按钮 */}
        <div>
          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            查询
          </button>
        </div>

        {/* 添加收入按钮 */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            添加收入
          </button>
        </div>
      </div>

      {/* 收入列表表格 */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      车型/车架号
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      金额
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      收款阶段
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      收款日期
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      备注
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {revenues.map((revenue) => (
                    <tr key={revenue.revenue_id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>{revenue.car_info?.vehicle_model}</div>
                        <div className="text-xs text-gray-400">{revenue.car_info?.vin}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">¥{revenue.amount}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">第 {revenue.revenue_phase} 期</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(revenue.payment_date), 'yyyy-MM-dd')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{revenue.remark}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => openModal(revenue)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(revenue.revenue_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* 添加收入总计行 */}
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={1} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      收入总计
                    </td>
                    <td className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ¥{Number(totalAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 分页 */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            上一页
          </button>
          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current * pagination.pageSize >= pagination.total}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示第{' '}
              <span className="font-medium">{(pagination.current - 1) * pagination.pageSize + 1}</span>
              {' '}到{' '}
              <span className="font-medium">
                {Math.min(pagination.current * pagination.pageSize, pagination.total)}
              </span>
              {' '}条，共{' '}
              <span className="font-medium">{pagination.total}</span>
              {' '}条记录
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">上一页</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pagination.current === index + 1
                      ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current * pagination.pageSize >= pagination.total}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">下一页</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 新增/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingRevenue ? '编辑收入信息' : '添加新收入'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700">
                    选择车辆
                  </label>
                  <select
                    id="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">请选择车辆</option>
                    {cars.map((car) => (
                      <option key={car.vehicle_id} value={car.vehicle_id}>
                        {car.vehicle_model} ({car.vin})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    金额
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">¥</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      required
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="revenue_phase" className="block text-sm font-medium text-gray-700">
                    收款阶段
                  </label>
                  <input
                    type="number"
                    id="revenue_phase"
                    value={formData.revenue_phase}
                    onChange={(e) => setFormData({ ...formData, revenue_phase: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                    收款日期
                  </label>
                  <input
                    type="date"
                    id="payment_date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="remark" className="block text-sm font-medium text-gray-700">
                    备注
                  </label>
                  <textarea
                    id="remark"
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                >
                  {editingRevenue ? '更新' : '添加'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 