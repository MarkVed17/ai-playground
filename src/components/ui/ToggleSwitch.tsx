import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red';
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    size = 'md',
    color = 'blue',
    checked, 
    disabled,
    id, 
    ...props 
  }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: {
        track: 'h-4 w-7',
        thumb: 'h-3 w-3 translate-x-0 checked:translate-x-3',
      },
      md: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4 translate-x-0 checked:translate-x-4',
      },
      lg: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5 translate-x-0 checked:translate-x-5',
      },
    };

    const colorClasses = {
      blue: 'checked:bg-blue-600 focus:ring-blue-500',
      green: 'checked:bg-green-600 focus:ring-green-500',
      purple: 'checked:bg-purple-600 focus:ring-purple-500',
      red: 'checked:bg-red-600 focus:ring-red-500',
    };

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <label htmlFor={toggleId} className="relative inline-flex items-center cursor-pointer">
              <input
                ref={ref}
                id={toggleId}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                className="sr-only peer"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                  error ? `${toggleId}-error` : 
                  description ? `${toggleId}-description` : undefined
                }
                {...props}
              />
              <div
                className={clsx(
                  'relative rounded-full transition-colors duration-200 ease-in-out',
                  'bg-gray-200 peer-checked:bg-current',
                  'peer-focus:ring-2 peer-focus:ring-offset-2',
                  'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                  sizeClasses[size].track,
                  colorClasses[color],
                  error && 'peer-focus:ring-red-500',
                  disabled && 'cursor-not-allowed',
                  className
                )}
              >
                <div
                  className={clsx(
                    'absolute left-0.5 top-0.5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out',
                    'peer-checked:translate-x-full peer-checked:rtl:-translate-x-full',
                    sizeClasses[size].thumb.split(' ').slice(0, 2).join(' '),
                    checked && sizeClasses[size].thumb.split('checked:')[1]
                  )}
                />
              </div>
            </label>
          </div>

          {(label || description) && (
            <div className="ml-3 text-sm">
              {label && (
                <label 
                  htmlFor={toggleId} 
                  className={clsx(
                    'font-medium cursor-pointer',
                    disabled ? 'text-gray-400' : 'text-gray-700'
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p 
                  id={`${toggleId}-description`} 
                  className={clsx(
                    disabled ? 'text-gray-300' : 'text-gray-500',
                    label && 'mt-1'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p id={`${toggleId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

ToggleSwitch.displayName = 'ToggleSwitch';
