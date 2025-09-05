import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={clsx('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs rounded',
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-2.5 text-base rounded-md',
      xl: 'px-8 py-3 text-base rounded-lg',
    };

    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    const iconSize = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5',
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <LoadingSpinner className={clsx(iconSize[size], children && 'mr-2')} />
        )}
        
        {!loading && leftIcon && (
          <span className={clsx(iconSize[size], children && 'mr-2')}>
            {leftIcon}
          </span>
        )}

        {loading && loadingText ? loadingText : children}

        {!loading && rightIcon && (
          <span className={clsx(iconSize[size], children && 'ml-2')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
      xl: 'p-3',
    };

    const iconSize = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5',
    };

    return (
      <Button
        ref={ref}
        className={clsx(sizeClasses[size], className)}
        size={size}
        {...props}
      >
        <span className={iconSize[size]}>
          {icon}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
