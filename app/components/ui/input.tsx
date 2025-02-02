'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type,
    error,
    label,
    wrapperClassName,
    labelClassName,
    errorClassName,
    leftIcon,
    rightIcon,
    leftIconClassName,
    rightIconClassName,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === 'password';

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={cn('absolute left-3 top-2.5', leftIconClassName)}>
              {leftIcon}
            </div>
          )}
          <input
            type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive',
              leftIcon && 'pl-10',
              (rightIcon || isPasswordType) && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {(rightIcon || isPasswordType) && (
            <div 
              className={cn(
                'absolute right-3 top-2.5 cursor-pointer',
                rightIconClassName
              )}
              onClick={isPasswordType ? togglePasswordVisibility : undefined}
            >
              {isPasswordType ? (
                showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {error && (
          <p className={cn('text-sm text-destructive', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input }; 