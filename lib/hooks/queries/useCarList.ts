import { useQuery } from '@tanstack/react-query';
import { carService } from '@/lib/api/services/carService';
import type { CarListParams } from '@/lib/api/services/carService';

export function useCarList(params: CarListParams = {}) {
  return useQuery({
    queryKey: ['cars', params],
    queryFn: () => carService.getCarList(params),
    placeholderData: keepPreviousData => {
      // 在加载新数据时保持显示旧数据
      if (keepPreviousData) {
        return keepPreviousData;
      }
      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };
    },
  });
} 