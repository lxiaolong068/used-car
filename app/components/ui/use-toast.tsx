'use client';

import { useState, useEffect, useCallback } from 'react';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface ToastState extends ToastProps {
  id: number;
  visible: boolean;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback(({ 
    title, 
    description, 
    variant = 'default',
    duration = 3000 
  }: ToastProps) => {
    const id = ++toastId;
    
    setToasts(prev => [
      ...prev,
      { id, title, description, variant, visible: true }
    ]);

    setTimeout(() => {
      setToasts(prev => 
        prev.map(toast => 
          toast.id === id ? { ...toast, visible: false } : toast
        )
      );

      setTimeout(() => removeToast(id), 300);
    }, duration);
  }, [removeToast]);

  return { toast, toasts };
}

export function Toaster() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            transform transition-all duration-300 ease-in-out
            ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            ${
              toast.variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground'
                : toast.variant === 'success'
                ? 'bg-success text-success-foreground'
                : 'bg-background text-foreground'
            }
            rounded-lg border p-4 shadow-lg
          `}
        >
          {toast.title && (
            <div className="font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
} 