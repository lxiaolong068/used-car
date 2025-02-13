import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { ErrorLogger } from '../errors/ErrorLogger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  additionalData?: Record<string, unknown>;
}

export function useErrorHandler() {
  const handleError = useCallback((error: unknown, options: ErrorHandlerOptions = {}) => {
    const { showToast = true, additionalData } = options;
    
    // 确保错误是 Error 类型
    const errorObject = error instanceof Error ? error : new Error(String(error));

    // 记录错误
    ErrorLogger.logError(errorObject, undefined, additionalData);

    // 显示错误提示
    if (showToast) {
      toast.error(errorObject.message || '发生了一个错误');
    }

    // 在开发环境下，将错误输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by useErrorHandler:', error);
    }
  }, []);

  return { handleError };
}

// 使用示例：
/*
function MyComponent() {
  const { handleError } = useErrorHandler();

  const handleSubmit = async () => {
    try {
      // 可能会抛出错误的代码
      await submitData();
    } catch (error) {
      handleError(error, {
        showToast: true,
        additionalData: {
          componentName: 'MyComponent',
          action: 'submitData'
        }
      });
    }
  };

  return <button onClick={handleSubmit}>提交</button>;
}
*/ 