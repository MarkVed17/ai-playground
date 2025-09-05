import React from 'react';
import clsx from 'clsx';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioButtonGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  description,
  error,
  required,
  disabled,
  orientation = 'vertical',
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (optionValue: string) => {
    if (onChange && !disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      
      <fieldset
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${groupId}-error` : undefined}
      >
        <div
          className={clsx(
            'space-y-2',
            orientation === 'horizontal' && 'flex flex-wrap gap-4 space-y-0'
          )}
        >
          {options.map((option, index) => {
            const optionId = `${name}-${index}`;
            const isDisabled = disabled || option.disabled;
            const isSelected = value === option.value;

            return (
              <div
                key={option.value}
                className={clsx(
                  'flex items-start',
                  orientation === 'horizontal' && 'items-center'
                )}
              >
                <div className="flex items-center h-5">
                  <input
                    id={optionId}
                    name={name}
                    type="radio"
                    value={option.value}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => handleChange(option.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleChange(option.value);
                      }
                    }}
                    className={clsx(
                      'h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      error && 'border-red-500 text-red-600 focus:ring-red-500'
                    )}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={optionId}
                    className={clsx(
                      'font-medium cursor-pointer',
                      isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                    )}
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <p
                      className={clsx(
                        'mt-1',
                        isDisabled ? 'text-gray-300' : 'text-gray-500'
                      )}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p id={`${groupId}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
