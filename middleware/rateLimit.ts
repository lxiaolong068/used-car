import { NextResponse } from 'next/server';
import { AppError } from './errorHandler';

interface RateLimitConfig {
  windowMs: number;  // 时间窗口（毫秒）
  max: number;       // 在时间窗口内允许的最大请求数
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100                  // 每个IP最多100个请求
};

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }>;
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.requests = new Map();

    // 在 Vercel 环境中，建议使用 Redis 或 Upstash
    if (process.env.VERCEL) {
      console.warn(
        'Warning: Using in-memory rate limiting in Vercel environment. ' +
        'For production, consider using Upstash Redis or other distributed rate limiting solution.'
      );
    }
  }

  async check(ip: string): Promise<void> {
    const now = Date.now();
    
    // TODO: 在生产环境中替换为 Redis 实现
    // 如果使用 Redis，可以使用 INCR 和 EXPIRE 命令实现原子操作
    const record = this.requests.get(ip);

    if (!record) {
      this.requests.set(ip, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return;
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.config.windowMs;
      return;
    }

    if (record.count >= this.config.max) {
      throw new AppError('请求过于频繁，请稍后再试', 429, 'RATE_LIMIT_EXCEEDED');
    }

    record.count += 1;
  }

  cleanup(): void {
    // 在 Vercel 环境中跳过清理
    if (process.env.VERCEL) {
      return;
    }

    const now = Date.now();
    for (const [ip, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(ip);
      }
    }
  }
}

// 创建全局实例
const limiter = new RateLimiter();

// 仅在非 Vercel 环境下设置清理定时器
if (!process.env.VERCEL) {
  setInterval(() => limiter.cleanup(), 60 * 60 * 1000);
}

export const rateLimit = async (ip: string | null): Promise<void> => {
  if (!ip) {
    throw new AppError('无法识别客户端IP', 400);
  }

  // 在 Vercel Edge Functions 中获取真实 IP
  const clientIp = process.env.VERCEL 
    ? ip.split(',')[0].trim()  // 处理 X-Forwarded-For
    : ip;

  await limiter.check(clientIp);
}; 