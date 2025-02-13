import { cookies } from 'next/headers';
import { ApiResponse, RequestOptions } from './ApiClient';

export type RequestInterceptor = (
  options: RequestOptions
) => RequestOptions | Promise<RequestOptions>;

export type ResponseInterceptor = <T>(
  response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>;

export type ErrorInterceptor = (
  error: any
) => any | Promise<any>;

// 认证拦截器
export const authInterceptor: RequestInterceptor = (options) => {
  const token = cookies().get('token')?.value;
  
  if (token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  
  return options;
};

// 响应处理拦截器
export const responseInterceptor: ResponseInterceptor = async <T>(
  response: ApiResponse<T>
) => {
  // 这里可以处理通用的响应转换
  return response;
};

// 错误处理拦截器
export const errorInterceptor: ErrorInterceptor = async (error) => {
  if (error.status === 401) {
    // 处理未授权错误
    window.location.href = '/login';
    return;
  }
  
  if (error.status === 403) {
    // 处理权限不足错误
    throw new Error('您没有权限执行此操作');
  }
  
  throw error;
}; 