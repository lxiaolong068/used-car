'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    error?: string;
    label?: string;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
  }
>(({ 
  className, 
  error,
  label,
  wrapperClassName,
  labelClassName,
  errorClassName,
  ...props 
}, ref) => (
  <div className={cn('space-y-2', wrapperClassName)}>
    {label && (
      <label
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          labelClassName
        )}
      >
        {label}
      </label>
    )}
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
    {error && (
      <p className={cn('text-sm text-destructive', errorClassName)}>
        {error}
      </p>
    )}
  </div>
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    label?: string;
    labelClassName?: string;
  }
>(({ className, label, labelClassName, children, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
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
    {children}
  </div>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem }; 