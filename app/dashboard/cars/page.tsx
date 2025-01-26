'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

interface CarInfo {
  vehicle_id: number
  vin: string
  vehicle_model: string
  register_date: string
  purchase_date: string
  mileage: number
  create_time: string | null
  update_time: string | null
}

export default function CarsPage() {
  const [cars, setCars] = useState<CarInfo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<CarInfo | null>(null)
  const [formData, setFormData] = useState({
    vin: '',
    vehicle_model: '',
    register_date: '',
    purchase_date: '',
    mileage: ''
  })

  // 获取车辆列表
  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars')
      if (!response.ok) {
        throw new Error('获取车辆列表失败')
      }
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error('获取车辆列表失败:', error)
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
        mileage: car.mileage.toString()
      })
    } else {
      setEditingCar(null)
      setFormData({
        vin: '',
        vehicle_model: '',
        register_date: '',
        purchase_date: '',
        mileage: ''
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">车辆管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理系统中的所有车辆信息，包括车架号、车型、登记日期等。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            添加车辆
          </button>
        </div>
      </div>

      {/* 车辆列表表格 */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                      登记日期
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      购买日期
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      里程数
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cars.map((car) => (
                    <tr key={car.vehicle_id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{car.vin}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{car.vehicle_model}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(car.register_date), 'yyyy-MM-dd')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(car.purchase_date), 'yyyy-MM-dd')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{car.mileage}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => openModal(car)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.vehicle_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  )
} 