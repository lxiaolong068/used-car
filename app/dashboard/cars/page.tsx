'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import VehicleFinancialModal from '../../components/cars/VehicleFinancialModal'
import RevenueDetailModal from '../../components/cars/RevenueDetailModal'
import CostDetailModal from '../../components/cars/CostDetailModal'
import { RevenueForm } from '../../components/revenue/RevenueForm'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

interface CarInfo {
  vehicle_id: number
  vin: string
  vehicle_model: string
  register_date: string
  purchase_date: string
  mileage: number
  sale_date: string | null
  customer_name: string | null
  create_time: string | null
  update_time: string | null
}

interface RevenueFormData {
  amount: string
  revenue_phase: string
  payment_date: string
  remark: string
}

interface PaginationInfo {
  current: number
  pageSize: number
  total: number
}

interface CostFormData {
  amount: string
  type: string
  payment_phase: string
  payment_date: string
  remark: string
}

interface Settlement {
  totalRevenue: number;
  totalCost: number;
  profit: number;
}

export default function CarsPage() {
  const [cars, setCars] = useState<CarInfo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false)
  const [isCostModalOpen, setIsCostModalOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null)
  const [editingCar, setEditingCar] = useState<CarInfo | null>(null)
  const [revenueFormData, setRevenueFormData] = useState<RevenueFormData>({
    amount: '',
    revenue_phase: '',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    remark: ''
  })
  const [searchVin, setSearchVin] = useState('')
  const [searchModel, setSearchModel] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    current: 1,
    pageSize: 5,
    total: 0
  })
  const [formData, setFormData] = useState({
    vin: '',
    vehicle_model: '',
    register_date: '',
    purchase_date: '',
    mileage: '',
    sale_date: '',
    customer_name: ''
  })
  const [loading, setLoading] = useState(true)
  const [costFormData, setCostFormData] = useState<CostFormData>({
    amount: '',
    type: '',
    payment_phase: '1',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    remark: ''
  })
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)
  const [settlements, setSettlements] = useState<Record<number, Settlement>>({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [isRevenueDetailModalOpen, setIsRevenueDetailModalOpen] = useState(false)
  const [selectedRevenueVehicleId, setSelectedRevenueVehicleId] = useState<number | null>(null)
  const [isCostDetailModalOpen, setIsCostDetailModalOpen] = useState(false)
  const [selectedCostVehicleId, setSelectedCostVehicleId] = useState<number | null>(null)

  // 获取车辆列表
  const fetchCars = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/cars?page=${page}&pageSize=${pagination.pageSize}${
          searchVin ? `&vin=${searchVin}` : ''
        }${searchModel ? `&model=${searchModel}` : ''}`
      )
      if (!response.ok) throw new Error('获取车辆列表失败')
      const data = await response.json()
      
      // 添加数据校验
      if (!Array.isArray(data?.data)) {
        throw new Error('返回数据格式错误')
      }
      
      setCars(data.data || [])  // 确保总是数组
      setPagination(data.pagination || {
        current: 1,
        pageSize: 5,
        total: 0
      })
    } catch (error) {
      console.error('获取车辆列表失败:', error)
      setCars([])  // 出错时重置为空数组
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // 打开新增/编辑模态框
  const openModal = (car?: CarInfo) => {
    if (car) {
      setEditingCar(car)
      setFormData({
        vin: car.vin,
        vehicle_model: car.vehicle_model,
        register_date: format(new Date(car.register_date), 'yyyy-MM-dd'),
        purchase_date: format(new Date(car.purchase_date), 'yyyy-MM-dd'),
        mileage: car.mileage.toString(),
        sale_date: car.sale_date ? format(new Date(car.sale_date), 'yyyy-MM-dd') : '',
        customer_name: car.customer_name || ''
      })
    } else {
      setEditingCar(null)
      setFormData({
        vin: '',
        vehicle_model: '',
        register_date: '',
        purchase_date: '',
        mileage: '',
        sale_date: '',
        customer_name: ''
      })
    }
    setIsModalOpen(true)
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCar 
        ? `/api/cars/${editingCar.vehicle_id}` 
        : '/api/cars'
      const method = editingCar ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(editingCar ? '更新车辆信息失败' : '添加车辆失败')
      }

      setIsModalOpen(false)
      fetchCars()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 删除车辆
  const handleDelete = async (vehicleId: number) => {
    if (!confirm('确定要删除这辆车吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/cars/${vehicleId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('删除车辆失败')
      }

      fetchCars()
    } catch (error) {
      console.error('删除车辆失败:', error)
    }
  }

  // 新增搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchCars(1)
  }

  // 新增分页处理
  const handlePageChange = (page: number) => {
    fetchCars(page)
  }

  // 打开收入表单模态框
  const openRevenueModal = (carId: number) => {
    setSelectedCarId(carId)
    setIsRevenueModalOpen(true)
  }

  // 处理点击车辆信息
  const handleVehicleClick = (vehicleId: number) => {
    setSelectedVehicleId(vehicleId)
    setIsFinancialModalOpen(true)
  }

  // 打开费用表单模态框
  const openCostModal = async (carId: number) => {
    setSelectedCarId(carId);
    
    try {
      // 获取最新付款阶段
      const response = await fetch(`/api/costs/latest-phase/${carId}`);
      if (!response.ok) throw new Error('获取付款阶段失败');
      const data = await response.json();
      
      setCostFormData({
        amount: '',
        type: '',
        payment_phase: String(data.nextPhase),
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        remark: ''
      });
    } catch (error) {
      console.error('获取付款阶段失败:', error);
      toast.error('获取付款阶段失败');
      setCostFormData({
        amount: '',
        type: '',
        payment_phase: '1',
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        remark: ''
      });
    }
    
    setIsCostModalOpen(true);
  };

  // 处理费用表单提交
  const handleCostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCarId) return

    try {
      const response = await fetch('/api/costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...costFormData,
          vehicle_id: selectedCarId,
          amount: parseFloat(costFormData.amount),
          payment_phase: parseInt(costFormData.payment_phase)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '添加费用记录失败')
      }

      toast.success('添加费用记录成功')
      setIsCostModalOpen(false)
    } catch (error: any) {
      console.error('添加费用记录失败:', error)
      toast.error(error.message || '添加费用记录失败')
    }
  }

  // 添加结算函数
  const handleCalculate = async () => {
    setIsCalculating(true)
    try {
      const results: Record<number, Settlement> = {}

      // 并行处理所有车辆的结算
      await Promise.all(cars.map(async (car) => {
        const response = await fetch(`/api/cars/${car.vehicle_id}/settlement`)
        if (response.ok) {
          const data = await response.json()
          results[car.vehicle_id] = {
            totalRevenue: data.totalRevenue,
            totalCost: data.totalCost,
            profit: data.totalRevenue - data.totalCost
          }
        }
      }))

      setSettlements(results)
      toast.success('结算完成')
    } catch (error) {
      console.error('结算失败:', error)
      toast.error('结算失败')
    } finally {
      setIsCalculating(false)
    }
  }

  // 打开收入明细模态框
  const openRevenueDetail = (vehicleId: number) => {
    setSelectedRevenueVehicleId(vehicleId)
    setIsRevenueDetailModalOpen(true)
  }

  // 打开费用明细模态框
  const openCostDetail = (vehicleId: number) => {
    setSelectedCostVehicleId(vehicleId)
    setIsCostDetailModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="sm:flex sm:items-start justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">车辆管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理系统中的所有车辆信息，包括车架号、车型、登记日期等。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            添加车辆
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50"
          >
            {isCalculating ? '结算中...' : '结算'}
          </button>
        </div>
      </div>

      {/* 新增搜索区域 */}
      <div className="mt-4 flex items-center gap-4">
        <div className="w-48">
          <input
            type="text"
            value={searchVin}
            onChange={(e) => setSearchVin(e.target.value)}
            placeholder="输入车架号"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="w-48">
          <input
            type="text"
            value={searchModel}
            onChange={(e) => setSearchModel(e.target.value)}
            placeholder="输入车型"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          搜索
        </button>
      </div>

      {/* 车辆列表表格 */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="p-4 text-center text-gray-500">加载中...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        车架号
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        车型
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        购买日期
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        销售日期
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        客户名称
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        总收入
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        总费用
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        利润
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {(cars || []).map((car) => (
                      <tr key={car.vehicle_id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <button
                            onClick={() => handleVehicleClick(car.vehicle_id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {car.vin}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleVehicleClick(car.vehicle_id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {car.vehicle_model}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(car.purchase_date), 'yyyy-MM-dd')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {car.sale_date ? format(new Date(car.sale_date), 'yyyy-MM-dd') : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {car.customer_name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                          <button
                            onClick={() => openRevenueDetail(car.vehicle_id)}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {settlements[car.vehicle_id]?.totalRevenue?.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }) || '-'}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                          <button
                            onClick={() => openCostDetail(car.vehicle_id)}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {settlements[car.vehicle_id]?.totalCost?.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }) || '-'}
                          </button>
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm text-right ${
                          settlements[car.vehicle_id]?.profit > 0 ? 'text-green-600' : 
                          settlements[car.vehicle_id]?.profit < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {settlements[car.vehicle_id]?.profit?.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }) || '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => openModal(car)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(car.vehicle_id)}
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openRevenueModal(car.vehicle_id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            添加收入
                          </button>
                          <button
                            onClick={() => openCostModal(car.vehicle_id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            添加费用
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 在表格后添加分页控件 */}
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
              {editingCar ? '编辑车辆信息' : '添加新车辆'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                    车架号
                  </label>
                  <input
                    type="text"
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vehicle_model" className="block text-sm font-medium text-gray-700">
                    车型
                  </label>
                  <input
                    type="text"
                    id="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="register_date" className="block text-sm font-medium text-gray-700">
                    登记日期
                  </label>
                  <input
                    type="date"
                    id="register_date"
                    value={formData.register_date}
                    onChange={(e) => setFormData({ ...formData, register_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                    购买日期
                  </label>
                  <input
                    type="date"
                    id="purchase_date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                    里程数
                  </label>
                  <input
                    type="number"
                    id="mileage"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="sale_date" className="block text-sm font-medium text-gray-700">
                    销售日期
                  </label>
                  <input
                    type="date"
                    id="sale_date"
                    value={formData.sale_date}
                    onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                    客户名称
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                >
                  {editingCar ? '更新' : '添加'}
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

      {/* 费用表单模态框 */}
      {isCostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">添加费用记录</h2>
            <form onSubmit={handleCostSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">金额</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={costFormData.amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCostFormData({ ...costFormData, amount: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">类型</label>
                  <select
                    required
                    value={costFormData.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      setCostFormData({ ...costFormData, type: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">请选择类型</option>
                    <option value="maintenance">维修</option>
                    <option value="service">保养</option>
                    <option value="insurance">保险</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">付款阶段</label>
                  <Input
                    type="number"
                    required
                    value={costFormData.payment_phase}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">付款日期</label>
                  <Input
                    type="date"
                    required
                    value={costFormData.payment_date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCostFormData({ ...costFormData, payment_date: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">备注</label>
                  <textarea
                    value={costFormData.remark}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      setCostFormData({ ...costFormData, remark: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCostModalOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  提交
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 收入表单模态框 */}
      {isRevenueModalOpen && selectedCarId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <RevenueForm
              vehicleId={selectedCarId}
              onSuccess={() => {
                setIsRevenueModalOpen(false)
                toast.success('添加收入记录成功')
              }}
              onCancel={() => setIsRevenueModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 财务信息模态框 */}
      {isFinancialModalOpen && selectedVehicleId && (
        <VehicleFinancialModal
          isOpen={isFinancialModalOpen}
          vehicleId={selectedVehicleId}
          onClose={() => setIsFinancialModalOpen(false)}
        />
      )}

      {/* 添加收入明细模态框 */}
      {isRevenueDetailModalOpen && selectedRevenueVehicleId && (
        <RevenueDetailModal
          isOpen={isRevenueDetailModalOpen}
          onClose={() => setIsRevenueDetailModalOpen(false)}
          vehicleId={selectedRevenueVehicleId}
        />
      )}

      {/* 添加费用明细模态框 */}
      {isCostDetailModalOpen && selectedCostVehicleId && (
        <CostDetailModal
          isOpen={isCostDetailModalOpen}
          onClose={() => setIsCostDetailModalOpen(false)}
          vehicleId={selectedCostVehicleId}
        />
      )}
    </div>
  )
} 