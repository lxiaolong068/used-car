import { ApiClient } from '../ApiClient';
import { CacheManager } from '../CacheManager';

interface CostInfo {
  cost_id: number;
  vehicle_id: number;
  amount: number;
  remark: string;
  payment_phase: number;
  payment_date: string;
  create_time?: string;
  update_time?: string;
}

interface CostListParams {
  page?: number;
  pageSize?: number;
  vehicleId?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: string | number | boolean | undefined;
}

interface CostListResponse {
  data: CostInfo[];
  total: number;
  page: number;
  pageSize: number;
}

interface CostStatistics {
  totalAmount: number;
  costByPhase: Record<number, number>;
  costByVehicle: Record<number, number>;
}

class CostService {
  private api: ApiClient;
  private cache: CacheManager;

  constructor() {
    this.api = new ApiClient('/api/costs');
    this.cache = new CacheManager();
  }

  // 获取成本列表
  async getCostList(params: CostListParams = {}): Promise<CostListResponse> {
    const cacheKey = `costs:list:${JSON.stringify(params)}`;
    const cached = this.cache.get<CostListResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const { data } = await this.api.get<CostListResponse>('', { params });
    this.cache.set(cacheKey, data, { ttl: 30 * 1000 }); // 缓存 30 秒
    return data;
  }

  // 获取成本详情
  async getCostById(id: number): Promise<CostInfo> {
    const cacheKey = `costs:${id}`;
    const cached = this.cache.get<CostInfo>(cacheKey);

    if (cached) {
      return cached;
    }

    const { data } = await this.api.get<CostInfo>(`/${id}`);
    this.cache.set(cacheKey, data, { ttl: 5 * 60 * 1000 }); // 缓存 5 分钟
    return data;
  }

  // 创建成本记录
  async createCost(costInfo: Omit<CostInfo, 'cost_id' | 'create_time' | 'update_time'>): Promise<CostInfo> {
    const { data } = await this.api.post<CostInfo>('', costInfo);
    this.cache.delete(`costs:list`);
    return data;
  }

  // 更新成本记录
  async updateCost(id: number, costInfo: Partial<CostInfo>): Promise<CostInfo> {
    const { data } = await this.api.put<CostInfo>(`/${id}`, costInfo);
    this.cache.delete(`costs:${id}`);
    this.cache.delete(`costs:list`);
    return data;
  }

  // 删除成本记录
  async deleteCost(id: number): Promise<void> {
    await this.api.delete(`/${id}`);
    this.cache.delete(`costs:${id}`);
    this.cache.delete(`costs:list`);
  }

  // 批量创建成本记录
  async batchCreateCosts(costs: Omit<CostInfo, 'cost_id' | 'create_time' | 'update_time'>[]): Promise<CostInfo[]> {
    const { data } = await this.api.post<CostInfo[]>('/batch', costs);
    this.cache.delete('costs:list');
    return data;
  }

  // 获取车辆总成本
  async getVehicleTotalCost(vehicleId: number): Promise<number> {
    const cacheKey = `costs:total:${vehicleId}`;
    const cached = this.cache.get<number>(cacheKey);

    if (cached !== null) {
      return cached;
    }

    const { data } = await this.api.get<{ total: number }>(`/vehicle/${vehicleId}/total`);
    this.cache.set(cacheKey, data.total, { ttl: 5 * 60 * 1000 }); // 缓存 5 分钟
    return data.total;
  }

  // 导出成本数据
  async exportCosts(params: CostListParams = {}): Promise<Blob> {
    const { data } = await this.api.get<Blob>('/export', {
      params,
      headers: {
        Accept: 'application/vnd.ms-excel',
      },
      responseType: 'blob',
    });
    return data;
  }

  // 获取成本统计
  async getCostStatistics(startDate: string, endDate: string): Promise<CostStatistics> {
    const cacheKey = `costs:stats:${startDate}:${endDate}`;
    const cached = this.cache.get<CostStatistics>(cacheKey);

    if (cached) {
      return cached;
    }

    const { data } = await this.api.get<CostStatistics>('/statistics', {
      params: { startDate, endDate },
    });
    this.cache.set(cacheKey, data, { ttl: 5 * 60 * 1000 }); // 缓存 5 分钟
    return data;
  }
}

export const costService = new CostService(); 