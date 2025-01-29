import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface CacheConfig {
  duration: number;  // 缓存持续时间（毫秒）
  maxSize: number;   // 最大缓存条目数
}

interface CacheEntry {
  data: any;
  expiry: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      duration: 5 * 60 * 1000,  // 默认5分钟
      maxSize: 100,             // 默认最多缓存100条
      ...config
    };
    this.cache = new Map();
  }

  set(key: string, data: any): void {
    // 如果缓存已满，删除最早的条目
    if (this.cache.size >= this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    // 在 Vercel 环境中，可以使用 Edge Config 或 KV 存储
    // TODO: 如果使用 Vercel KV，替换为 KV 操作
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.config.duration
    });
  }

  get(key: string): any {
    // TODO: 如果使用 Vercel KV，替换为 KV 操作
    const entry = this.cache.get(key);
    if (!entry) return null;

    // 如果缓存已过期，删除并返回null
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // 清理过期缓存
  cleanup(): void {
    // 在 Vercel 环境中不需要主动清理，KV 会自动处理过期
    if (process.env.VERCEL) {
      return;
    }

    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 创建全局缓存实例
const cacheManager = new CacheManager();

// 仅在非 Vercel 环境下设置清理定时器
if (!process.env.VERCEL) {
  setInterval(() => cacheManager.cleanup(), 60 * 60 * 1000);
}

// 中间件函数
export async function withCache(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // 只缓存GET请求
  if (request.method !== 'GET') {
    return handler();
  }

  const cacheKey = new URL(request.url).toString();
  const cachedResponse = cacheManager.get(cacheKey);

  // 添加环境标识到响应头
  const headers = {
    'Content-Type': 'application/json',
    'X-Cache': 'MISS',
    'X-Environment': process.env.VERCEL ? 'vercel' : 'development'
  };

  if (cachedResponse) {
    return new NextResponse(JSON.stringify(cachedResponse), {
      status: 200,
      headers: { ...headers, 'X-Cache': 'HIT' }
    });
  }

  const response = await handler();
  const data = await response.json();

  cacheManager.set(cacheKey, data);

  return new NextResponse(JSON.stringify(data), {
    status: response.status,
    headers
  });
} 