import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

interface ErrorResponse {
  error: {
    message: string;
    code?: string;
  };
  status: number;
}

export const errorHandler = (error: Error | AppError): NextResponse<ErrorResponse> => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
        status: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  // 处理未知错误
  return NextResponse.json(
    {
      error: {
        message: '服务器内部错误',
        code: 'INTERNAL_SERVER_ERROR',
      },
      status: 500,
    },
    { status: 500 }
  );
};

// 用于包装 API 路由处理函数的高阶函数
export const withErrorHandler = (handler: Function) => async (...args: any[]) => {
  try {
    return await handler(...args);
  } catch (error) {
    return errorHandler(error as Error);
  }
}; 