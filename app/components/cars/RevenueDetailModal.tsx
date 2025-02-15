'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { format } from 'date-fns';

interface RevenueDetail {
  revenue_id: number;
  vehicle_id: number;
  amount: string;
  revenue_phase: number;
  payment_date: string;
  remark: string;
  create_time: string | null;
}

interface RevenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number;
}

export default function RevenueDetailModal({ isOpen, onClose, vehicleId }: RevenueDetailModalProps) {
  const [details, setDetails] = useState<RevenueDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (isOpen && vehicleId) {
      fetchDetails();
    }
  }, [isOpen, vehicleId]);

  const fetchDetails = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/revenues/details/${vehicleId}`);
      if (!response.ok) {
        throw new Error('获取收入明细失败');
      }
      const data = await response.json();
      console.log('Received revenues data:', data);
      
      // 检查数据是否是数组
      if (Array.isArray(data)) {
        setDetails(data);
        // 计算总收入
        const total = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        setTotalRevenue(total);
      } else if (data.data && Array.isArray(data.data)) {
        setDetails(data.data);
        setTotalRevenue(parseFloat(data.totalAmount) || 0);
      } else {
        throw new Error('返回数据格式错误');
      }
    } catch (error) {
      console.error('获取收入明细失败:', error);
      setError(error instanceof Error ? error.message : '获取失败');
      setDetails([]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>收入明细</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading && (
            <div className="text-center py-4">加载中...</div>
          )}
          
          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          
          {!loading && !error && details.length === 0 && (
            <div className="text-center text-gray-500 py-4">暂无收入记录</div>
          )}
          
          {!loading && !error && details.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        收入金额
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        收款阶段
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        收款日期
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
                      <tr key={detail.revenue_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{parseFloat(detail.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          第 {detail.revenue_phase} 期
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
              
              <div className="flex justify-end pt-4 border-t">
                <div className="text-lg font-semibold">
                  总计: ¥{totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}