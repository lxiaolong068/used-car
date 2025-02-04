import { Fragment, useEffect, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { format } from 'date-fns'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface FinancialData {
  vehicle_info: {
    vin: string
    vehicle_model: string
    register_date: string
    purchase_date: string
    mileage: number
  }
  financial_summary: {
    total_revenue: number
    total_cost: number
    profit: number
    cost_breakdown: Record<string, number>
  }
  details: {
    revenues: Array<{
      amount: number
      date: string
      remark: string
    }>
    costs: Array<{
      amount: number
      type: string
      date: string
      remark: string
    }>
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  vehicleId: number | null
}

// 添加费用类型映射
const COST_TYPE_MAP: Record<string, string> = {
  'maintenance': '维修保养',
  'insurance': '保险费用',
  'tax': '税费',
  'other': '其他费用'
}

export default function VehicleFinancialModal({ isOpen, onClose, vehicleId }: Props) {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (isOpen && vehicleId) {
      const fetchData = async () => {
        try {
          // 如果有正在进行的请求，取消它
          if (abortControllerRef.current) {
            abortControllerRef.current.abort()
          }

          // 创建新的 AbortController
          const abortController = new AbortController()
          abortControllerRef.current = abortController

          setLoading(true)
          setError(null)
          const response = await fetch(`/api/cars/${vehicleId}/summary`, {
            signal: abortController.signal
          })
          if (!response.ok) {
            throw new Error('获取数据失败')
          }
          const data = await response.json()
          setData(data)
        } catch (error) {
          // 如果是取消请求导致的错误，不显示错误提示
          if (error instanceof Error && error.name === 'AbortError') {
            return
          }
          setError(error instanceof Error ? error.message : '获取数据失败')
        } finally {
          setLoading(false)
        }
      }

      fetchData()

      // 清理函数：组件卸载或依赖项变化时取消正在进行的请求
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
      }
    }
  }, [isOpen, vehicleId])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      车辆财务汇总
                    </Dialog.Title>

                    {loading && (
                      <div className="mt-4 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                      </div>
                    )}

                    {error && (
                      <div className="mt-4 text-red-500">
                        {error}
                      </div>
                    )}

                    {data && (
                      <div className="mt-4">
                        {/* 车辆基本信息 */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">车辆信息</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">车型：{data.vehicle_info.vehicle_model}</p>
                              <p className="text-sm text-gray-500">车架号：{data.vehicle_info.vin}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                注册日期：{format(new Date(data.vehicle_info.register_date), 'yyyy-MM-dd')}
                              </p>
                              <p className="text-sm text-gray-500">
                                购买日期：{format(new Date(data.vehicle_info.purchase_date), 'yyyy-MM-dd')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 财务汇总 */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">财务汇总</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">总收入</p>
                              <p className="text-xl font-semibold text-green-600">
                                ¥{data.financial_summary.total_revenue.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">总支出</p>
                              <p className="text-xl font-semibold text-red-600">
                                ¥{data.financial_summary.total_cost.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">利润</p>
                              <p className={`text-xl font-semibold ${
                                data.financial_summary.profit >= 0 ? 'text-blue-600' : 'text-red-600'
                              }`}>
                                ¥{data.financial_summary.profit.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 收入记录 */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">收入记录</h4>
                          <div className="bg-white shadow rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    日期
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    金额
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    备注
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {data.details.revenues.length === 0 ? (
                                  <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                      暂无收入记录
                                    </td>
                                  </tr>
                                ) : (
                                  data.details.revenues.map((revenue, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(revenue.date), 'yyyy-MM-dd')}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                                        ¥{revenue.amount.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {revenue.remark}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 支出记录 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">支出记录</h4>
                          <div className="bg-white shadow rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    日期
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    类型
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    金额
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    备注
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {data.details.costs.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                      暂无支出记录
                                    </td>
                                  </tr>
                                ) : (
                                  data.details.costs.map((cost, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(cost.date), 'yyyy-MM-dd')}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {COST_TYPE_MAP[cost.type] || cost.type}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                                        ¥{cost.amount.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cost.remark}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 