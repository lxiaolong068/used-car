'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

interface RevenueFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number;
}

export default function RevenueForm({ isOpen, onClose, vehicleId }: RevenueFormProps) {
  const [amount, setAmount] = useState('');
  const [revenuePhase, setRevenuePhase] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/revenues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          amount,
          revenue_phase: revenuePhase,
          payment_date: paymentDate,
          remark
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '添加收入失败');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加收入失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>添加收入</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">金额</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">收款阶段</label>
            <input
              type="number"
              value={revenuePhase}
              onChange={(e) => setRevenuePhase(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">收款日期</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              {loading ? '提交中...' : '提交'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
