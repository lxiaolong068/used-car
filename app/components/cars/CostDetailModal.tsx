import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface CostDetail {
  cost_id: number
  amount: number
  payment_phase: number
  payment_date: string
  remark: string
  create_time: string | null
}

interface CostDetailModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleId: number
}

export default function CostDetailModal({ isOpen, onClose, vehicleId }: CostDetailModalProps) {
  const [details, setDetails] = useState<CostDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && vehicleId) {
      fetchCostDetails()
    }
  }, [isOpen, vehicleId])

  const fetchCostDetails = async () => {
    try {
      const response = await fetch(`/api/cars/${vehicleId}/costs`)
      if (!response.ok) {
        throw new Error('获取费用详情失败')
      }
      const data = await response.json()
      setDetails(data)
    } catch (error) {
      console.error('获取费用详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">费用详情</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-4">加载中...</div>
        ) : (
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    费用金额
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    付款阶段
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    付款日期
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    备注
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {details.map((detail) => (
                  <tr key={detail.cost_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {detail.amount.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      第 {detail.payment_phase} 期
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(detail.payment_date), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {detail.remark}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {detail.create_time ? format(new Date(detail.create_time), 'yyyy-MM-dd HH:mm:ss') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 