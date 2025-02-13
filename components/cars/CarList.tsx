'use client';

import { useCarList } from '@/lib/hooks/queries/useCarList';
import { useUpdateCar } from '@/lib/hooks/mutations/useUpdateCar';
import { useState } from 'react';

export function CarList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useCarList({
    page,
    pageSize: 10,
  });

  const updateCar = useUpdateCar();

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>加载失败: {error instanceof Error ? error.message : '未知错误'}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((car) => (
          <div
            key={car.vehicle_id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{car.vehicle_model}</h3>
            <p className="text-gray-600">VIN: {car.vin}</p>
            <p className="text-gray-600">里程: {car.mileage}万公里</p>
            <p className="text-gray-600">
              状态: {car.sale_status === 0 ? '在售' : '已售'}
            </p>
            <button
              onClick={() =>
                updateCar.mutate({
                  id: car.vehicle_id,
                  data: { sale_status: car.sale_status === 0 ? 1 : 0 },
                })
              }
              className="mt-2 px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              disabled={updateCar.isPending}
            >
              {updateCar.isPending ? '更新中...' : '切换状态'}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          上一页
        </button>
        <span>
          第 {page} 页，共 {Math.ceil((data?.total || 0) / 10)} 页
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil((data?.total || 0) / 10)}
          className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
} 