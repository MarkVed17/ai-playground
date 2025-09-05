import React, { forwardRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';

export interface RangeSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  required?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ 
    className, 
    label, 
    error, 
    required, 
    showValue = true,
    formatValue,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    id,
    ...props 
  }, ref) => {
    const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;
    
    const [localValue, setLocalValue] = useState(() => {
      return Number(value ?? defaultValue ?? min);
    });

    const currentValue = value !== undefined ? Number(value) : localValue;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (value === undefined) {
        setLocalValue(newValue);
      }
      onChange?.(e);
    }, [onChange, value]);

    const displayValue = formatValue ? formatValue(currentValue) : currentValue.toString();
    
    const percentage = ((currentValue - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          {label && (
            <label htmlFor={sliderId} className="block text-sm font-medium text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-900">
              {displayValue}
            </span>
          )}
        </div>
        
        <div className="relative">
          <input
            ref={ref}
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            className={clsx(
              'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
              '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600',
              '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm',
              '[&::-webkit-slider-thumb]:hover:bg-blue-700 [&::-webkit-slider-thumb]:focus:bg-blue-700',
              '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer',
              '[&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:rounded-lg',
              error && 'focus:ring-red-500',
              className
            )}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${sliderId}-error` : undefined}
            {...props}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatValue ? formatValue(Number(min)) : min}</span>
          <span>{formatValue ? formatValue(Number(max)) : max}</span>
        </div>

        {error && (
          <p id={`${sliderId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';