'use client';

import { useEffect, useState, useRef } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import toast from 'react-hot-toast';

interface RevenueFormProps {
  vehicleId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RevenueForm({ vehicleId, onSuccess, onCancel }: RevenueFormProps) {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    remark: '',
    revenue_phase: '',
    payment_date: new Date().toISOString().split('T')[0]
  });

  // 获取最新收款阶段
  useEffect(() => {
    const fetchLatestPhase = async () => {
      try {
        // 如果有正在进行的请求，取消它
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // 创建新的 AbortController
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const response = await fetch(`/api/revenues/latest-phase/${vehicleId}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) throw new Error('获取收款阶段失败');
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          revenue_phase: String(data.nextPhase)
        }));
      } catch (error) {
        // 如果是取消请求导致的错误，不显示错误提示
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('获取收款阶段失败:', error);
        toast.error('获取收款阶段失败');
      }
    };

    fetchLatestPhase();

    // 清理函数：组件卸载时取消正在进行的请求
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [vehicleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/revenues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          ...formData,
          amount: parseFloat(formData.amount),
          revenue_phase: parseInt(formData.revenue_phase)
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '添加收入失败');
      }

      onSuccess?.();
    } catch (error) {
      console.error('添加收入失败:', error);
      toast.error(error instanceof Error ? error.message : '添加收入失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-24">收款金额</label>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">¥</span>
          </div>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="请输入收款金额"
            required
            min="0"
            step="0.01"
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-24">备注</label>
        <Input
          type="text"
          name="remark"
          value={formData.remark}
          onChange={handleChange}
          placeholder="请输入备注信息"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-24">收款阶段</label>
        <Input
          type="number"
          name="revenue_phase"
          value={formData.revenue_phase}
          onChange={handleChange}
          placeholder="收款阶段"
          required
          min="1"
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50"
        />
      </div>

      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-24">收款日期</label>
        <Input
          type="date"
          name="payment_date"
          value={formData.payment_date}
          onChange={handleChange}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          取消
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? '提交中...' : '确定'}
        </Button>
      </div>
    </form>
  );
} 