interface CacheOptions {
  ttl?: number; // 缓存生存时间（毫秒）
  key?: string; // 自定义缓存键
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 默认 5 分钟
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  private generateCacheKey(endpoint: string, params?: Record<string, any>): string {
    return `${endpoint}:${params ? JSON.stringify(params) : ''}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  set<T>(
    endpoint: string,
    data: T,
    options: CacheOptions = {}
  ): void {
    const key = options.key || this.generateCacheKey(endpoint);
    const ttl = options.ttl || this.defaultTTL;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(endpoint: string, options: CacheOptions = {}): T | null {
    const key = options.key || this.generateCacheKey(endpoint);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(endpoint: string, options: CacheOptions = {}): boolean {
    const key = options.key || this.generateCacheKey(endpoint);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(endpoint: string, options: CacheOptions = {}): void {
    const key = options.key || this.generateCacheKey(endpoint);
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // 清理过期缓存
  cleanup(): void {
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    });
  }
} 