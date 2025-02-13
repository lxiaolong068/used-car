import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '@/lib/api/services/carService';
import type { CarInfo } from '@/lib/api/services/carService';
import { toast } from 'react-hot-toast';

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CarInfo> }) =>
      carService.updateCar(id, data),
    
    onSuccess: (updatedCar) => {
      // 更新缓存中的数据
      queryClient.setQueryData(['cars', updatedCar.vehicle_id], updatedCar);
      
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({
        queryKey: ['cars'],
        exact: false,
      });
      
      toast.success('车辆信息更新成功');
    },
    
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '更新失败');
    },
  });
} 