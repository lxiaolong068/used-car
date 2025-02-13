import { ApiClient } from '../ApiClient';
import { CacheManager } from '../CacheManager';

interface CarInfo {
  vehicle_id: number;
  vin: string;
  vehicle_model: string;
  register_date: string;
  purchase_date: string;
  mileage: number;
  customer_name?: string;
  sale_date?: string;
  sale_status: number;
}

interface CarListParams {
  page?: number;
  pageSize?: number;
  vin?: string;
  model?: string;
  saleStatus?: number;
  [key: string]: string | number | boolean | undefined;
}

interface CarListResponse {
  data: CarInfo[];
  total: number;
  page: number;
  pageSize: number;
}

class CarService {
  private api: ApiClient;
  private cache: CacheManager;

  constructor() {
    this.api = new ApiClient('/api/cars');
    this.cache = new CacheManager();
  }

  // 获取车辆列表
  async getCarList(params: CarListParams = {}): Promise<CarListResponse> {
    const cacheKey = `cars:list:${JSON.stringify(params)}`;
    const cached = this.cache.get<CarListResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    const { data } = await this.api.get<CarListResponse>('', { params });
    this.cache.set(cacheKey, data, { ttl: 30 * 1000 }); // 缓存 30 秒
    return data;
  }

  // 获取车辆详情
  async getCarById(id: number): Promise<CarInfo> {
    const cacheKey = `cars:${id}`;
    const cached = this.cache.get<CarInfo>(cacheKey);

    if (cached) {
      return cached;
    }

    const { data } = await this.api.get<CarInfo>(`/${id}`);
    this.cache.set(cacheKey, data, { ttl: 5 * 60 * 1000 }); // 缓存 5 分钟
    return data;
  }

  // 创建车辆
  async createCar(carInfo: Omit<CarInfo, 'vehicle_id'>): Promise<CarInfo> {
    const { data } = await this.api.post<CarInfo>('', carInfo);
    this.cache.clear(); // 清除所有缓存
    return data;
  }

  // 更新车辆信息
  async updateCar(id: number, carInfo: Partial<CarInfo>): Promise<CarInfo> {
    const { data } = await this.api.put<CarInfo>(`/${id}`, carInfo);
    this.cache.delete(`cars:${id}`);
    this.cache.delete(`cars:list`);
    return data;
  }

  // 删除车辆
  async deleteCar(id: number): Promise<void> {
    await this.api.delete(`/${id}`);
    this.cache.delete(`cars:${id}`);
    this.cache.delete(`cars:list`);
  }

  // 更新车辆销售状态
  async updateSaleStatus(id: number, saleStatus: number): Promise<CarInfo> {
    const { data } = await this.api.patch<CarInfo>(`/${id}/sale-status`, { saleStatus });
    this.cache.delete(`cars:${id}`);
    this.cache.delete(`cars:list`);
    return data;
  }

  // 批量导入车辆
  async importCars(cars: Omit<CarInfo, 'vehicle_id'>[]): Promise<CarInfo[]> {
    const { data } = await this.api.post<CarInfo[]>('/batch', cars);
    this.cache.clear(); // 清除所有缓存
    return data;
  }

  // 导出车辆数据
  async exportCars(params: CarListParams = {}): Promise<Blob> {
    const { data } = await this.api.get<Blob>('/export', {
      params,
      headers: {
        Accept: 'application/vnd.ms-excel',
      },
      responseType: 'blob',
    });
    return data;
  }
}

export const carService = new CarService(); 