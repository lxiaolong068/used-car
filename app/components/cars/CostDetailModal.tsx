'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { format } from 'date-fns';

interface Cost {
  cost_id: number;
  amount: string;
  payment_date: string;
  payment_phase: number;
  remark: string;
  create_time: string;
}

interface CostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number | null;
}

export default function CostDetailModal({
  isOpen,
  onClose,
  vehicleId,
}: CostDetailModalProps) {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (isOpen && vehicleId) {
      loadCosts();
    }
  }, [isOpen, vehicleId]);

  const loadCosts = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/costs/details/${vehicleId}`);
      if (!response.ok) {
        throw new Error('加载费用数据失败');
      }
      const data = await response.json();
      console.log('Received costs data:', data);
      
      // API 直接返回费用数组
      setCosts(data || []);
      // 计算总费用
      const total = data.reduce((sum: number, cost: Cost) => sum + parseFloat(cost.amount), 0);
      setTotalCost(total);
    } catch (err) {
      console.error('Error loading costs:', err);
      setError(err instanceof Error ? err.message : '加载失败');
      setCosts([]);
      setTotalCost(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>费用明细</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading && (
            <div className="text-center py-4">加载中...</div>
          )}
          
          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          
          {!loading && !error && costs.length === 0 && (
            <div className="text-center text-gray-500 py-4">暂无费用记录</div>
          )}
          
          {!loading && !error && costs.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        付款阶段
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
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
                    {costs.map((cost) => (
                      <tr key={cost.cost_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          第 {cost.payment_phase} 期
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{parseFloat(cost.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(cost.payment_date), 'yyyy-MM-dd')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cost.remark || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(cost.create_time), 'yyyy-MM-dd HH:mm:ss')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <div className="text-lg font-semibold">
                  总计: ¥{totalCost.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
