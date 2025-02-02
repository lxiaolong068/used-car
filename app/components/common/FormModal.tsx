'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
  preventCloseOnLoading?: boolean;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  hideFooter?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
} as const;

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = '确定',
  cancelText = '取消',
  loading = false,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true,
  preventCloseOnLoading = true,
  className = '',
  bodyClassName = '',
  footerClassName = '',
  hideFooter = false,
}: FormModalProps) {
  // 处理ESC键关闭
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && (!loading || !preventCloseOnLoading)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, loading, preventCloseOnLoading]);

  const handleClose = () => {
    if (!loading || !preventCloseOnLoading) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className={cn('relative z-50', className)}
        onClose={closeOnOverlayClick ? handleClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={cn(
                  'w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                  sizeClasses[size]
                )}
              >
                <Dialog.Title as="div" className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </h3>
                  {showClose && (
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={handleClose}
                      disabled={loading && preventCloseOnLoading}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  )}
                </Dialog.Title>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (onSubmit) {
                      try {
                        await onSubmit();
                      } catch (error) {
                        console.error('Form submission error:', error);
                      }
                    }
                  }}
                  className={cn('mt-4', bodyClassName)}
                >
                  <div className="space-y-4">
                    {children}
                  </div>

                  {!hideFooter && (
                    <div className={cn('mt-6 flex justify-end space-x-3', footerClassName)}>
                      <button
                        type="button"
                        className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        onClick={handleClose}
                        disabled={loading && preventCloseOnLoading}
                      >
                        {cancelText}
                      </button>
                      {onSubmit && (
                        <button
                          type="submit"
                          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          {loading ? '处理中...' : submitText}
                        </button>
                      )}
                    </div>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 