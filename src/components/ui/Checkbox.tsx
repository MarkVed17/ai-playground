import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    React.useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate, ref]);

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={clsx(
                'h-4 w-4 rounded border-gray-300 text-blue-600',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-red-500 text-red-600 focus:ring-red-500',
                className
              )}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${checkboxId}-error` : 
                description ? `${checkboxId}-description` : undefined
              }
              {...props}
            />
          </div>
          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label htmlFor={checkboxId} className="font-medium text-gray-700 cursor-pointer">
                  {label}
                </label>
              )}
              {description && (
                <p 
                  id={`${checkboxId}-description`} 
                  className={clsx('text-gray-500', label && 'mt-1')}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
