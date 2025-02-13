import { ErrorLogger } from '../errors/ErrorLogger';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  retries?: number;
  retryDelay?: number;
  responseType?: 'json' | 'blob' | 'text';
  body?: BodyInit | null | undefined;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private defaultOptions: RequestOptions;

  constructor(
    baseUrl: string = '/api',
    defaultHeaders: HeadersInit = {},
    defaultOptions: RequestOptions = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.defaultOptions = {
      retries: 3,
      retryDelay: 1000,
      ...defaultOptions,
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: T;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text() as T;
    }

    if (!response.ok) {
      const error = new Error(response.statusText) as ApiError;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(this.baseUrl + endpoint, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async retryRequest<T>(
    request: () => Promise<ApiResponse<T>>,
    retries: number,
    delay: number
  ): Promise<ApiResponse<T>> {
    try {
      return await request();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(request, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    // 只重试网络错误和 5xx 错误
    if (error instanceof TypeError) return true; // 网络错误
    if (error.status && error.status >= 500) return true; // 服务器错误
    return false;
  }

  private async executeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      retries = this.defaultOptions.retries,
      retryDelay = this.defaultOptions.retryDelay,
      headers,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint, params);
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    };

    const request = () =>
      fetch(url, requestOptions).then(response => this.handleResponse<T>(response));

    try {
      return await this.retryRequest(request, retries!, retryDelay!);
    } catch (error) {
      // 记录错误
      ErrorLogger.logError(error instanceof Error ? error : new Error(String(error)), undefined, {
        endpoint,
        params,
        method: options.method || 'GET',
      });
      throw error;
    }
  }

  // HTTP 方法封装
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }
} 