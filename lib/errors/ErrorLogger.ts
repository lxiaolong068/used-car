import { ErrorInfo } from 'react';

interface ErrorLogData {
  error: Error;
  errorInfo?: ErrorInfo;
  timestamp: string;
  userAgent: string;
  url: string;
  additionalData?: Record<string, unknown>;
}

export class ErrorLogger {
  private static readonly LOG_ENDPOINT = '/api/logs/error';

  static async logError(
    error: Error,
    errorInfo?: ErrorInfo,
    additionalData?: Record<string, unknown>
  ): Promise<void> {
    try {
      const errorLogData: ErrorLogData = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: errorInfo ? {
          componentStack: errorInfo.componentStack,
        } : undefined,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : '',
        additionalData,
      };

      // 开发环境下在控制台输出错误信息
      if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorLogData);
      }

      // 发送错误日志到服务器
      await fetch(this.LOG_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLogData),
      });
    } catch (loggingError) {
      // 如果日志记录失败，在开发环境下输出错误
      if (process.env.NODE_ENV === 'development') {
        console.error('Error logging failed:', loggingError);
      }
    }
  }

  static logWarning(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, data);
    }
    // 可以选择是否将警告也发送到服务器
  }

  static logInfo(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(message, data);
    }
    // 可以选择是否将信息日志也发送到服务器
  }
} 