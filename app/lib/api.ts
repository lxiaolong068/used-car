import { getQueryParams } from './utils';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const DEFAULT_TIMEOUT = 30000; // 30秒超时
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * 处理API响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      code: response.status,
      message: response.statusText,
    }));
    
    throw new ApiError(error.code || response.status, error.message || response.statusText, error.data);
  }
  
  const data = await response.json();
  
  if (data.code !== 0 && data.code !== 200) {
    throw new ApiError(data.code, data.message, data.data);
  }
  
  return data.data;
}

/**
 * 超时处理
 */
function timeoutPromise<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new ApiError(408, '请求超时'));
      }, timeout);
    }),
  ]);
}

/**
 * 构建URL
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * 请求拦截器
 */
async function requestInterceptor(config: RequestConfig): Promise<RequestConfig> {
  // 这里可以添加token等通用处理
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  
  return config;
}

/**
 * 响应拦截器
 */
async function responseInterceptor<T>(response: T): Promise<T> {
  // 这里可以添加响应拦截逻辑
  return response;
}

/**
 * 创建请求函数
 */
async function request<T = any>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const {
    params,
    timeout = DEFAULT_TIMEOUT,
    ...requestConfig
  } = await requestInterceptor(config);
  
  const url = buildUrl(path, params);
  
  try {
    const response = await timeoutPromise(
      fetch(url, {
        ...requestConfig,
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig.headers,
        },
      }),
      timeout
    );
    
    const data = await handleResponse<T>(response);
    return responseInterceptor(data);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, (error as Error)?.message || '请求失败');
  }
}

/**
 * GET请求
 */
export function get<T = any>(
  path: string,
  config: Omit<RequestConfig, 'method'> = {}
): Promise<T> {
  return request<T>(path, { ...config, method: 'GET' });
}

/**
 * POST请求
 */
export function post<T = any>(
  path: string,
  data?: any,
  config: Omit<RequestConfig, 'method' | 'body'> = {}
): Promise<T> {
  return request<T>(path, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT请求
 */
export function put<T = any>(
  path: string,
  data?: any,
  config: Omit<RequestConfig, 'method' | 'body'> = {}
): Promise<T> {
  return request<T>(path, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE请求
 */
export function del<T = any>(
  path: string,
  config: Omit<RequestConfig, 'method'> = {}
): Promise<T> {
  return request<T>(path, { ...config, method: 'DELETE' });
}

/**
 * PATCH请求
 */
export function patch<T = any>(
  path: string,
  data?: any,
  config: Omit<RequestConfig, 'method' | 'body'> = {}
): Promise<T> {
  return request<T>(path, {
    ...config,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * 上传文件
 */
export function upload<T = any>(
  path: string,
  file: File | FormData,
  config: Omit<RequestConfig, 'method' | 'body' | 'headers'> = {}
): Promise<T> {
  const formData = file instanceof FormData ? file : new FormData();
  
  if (file instanceof File) {
    formData.append('file', file);
  }
  
  return request<T>(path, {
    ...config,
    method: 'POST',
    body: formData,
    headers: {
      // 不设置Content-Type，让浏览器自动设置
    },
  });
}

/**
 * 下载文件
 */
export async function download(
  path: string,
  filename?: string,
  config: Omit<RequestConfig, 'method'> = {}
): Promise<void> {
  const response = await fetch(buildUrl(path), {
    ...config,
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename || getFilenameFromResponse(response) || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 从响应头中获取文件名
 */
function getFilenameFromResponse(response: Response): string | null {
  const disposition = response.headers.get('content-disposition');
  if (!disposition) return null;
  
  const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (!filenameMatch) return null;
  
  return decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
}

export const api = {
  get,
  post,
  put,
  delete: del,
  patch,
  upload,
  download,
}; 