import React from 'react';
import clsx from 'clsx';
import { Checkbox, type CheckboxProps } from './Checkbox';

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  value = [],
  onChange,
  label,
  description,
  error,
  required,
  disabled,
  orientation = 'vertical',
}) => {
  const groupId = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (optionValue: string, checked: boolean) => {
    if (onChange && !disabled) {
      const newValue = checked
        ? [...value, optionValue]
        : value.filter(v => v !== optionValue);
      onChange(newValue);
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
            const isChecked = value.includes(option.value);

            return (
              <Checkbox
                key={option.value}
                id={optionId}
                label={option.label}
                description={option.description}
                checked={isChecked}
                disabled={isDisabled}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                error={error ? '' : undefined}
              />
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