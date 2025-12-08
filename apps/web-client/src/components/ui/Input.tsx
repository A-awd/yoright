import React, { useState, useId } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  floatingLabel?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  floatingLabel = false,
  helperText,
  className = '',
  id,
  value,
  placeholder,
  onFocus,
  onBlur,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== undefined && value !== '';
  const showFloatingLabel = floatingLabel && (isFocused || hasValue);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && !floatingLabel && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-charcoal-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          value={value}
          placeholder={floatingLabel ? '' : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full px-4 py-3.5 rounded-2xl
            bg-white border-2 transition-all duration-200
            text-charcoal-900 placeholder:text-charcoal-400
            focus:outline-none focus:ring-0
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${floatingLabel ? 'pt-6 pb-2' : ''}
            ${error
              ? 'border-error-500 focus:border-error-500'
              : 'border-charcoal-200 focus:border-gold-500 hover:border-charcoal-300'
            }
          `}
          {...props}
        />
        
        {floatingLabel && label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${leftIcon ? 'left-12' : ''}
              ${showFloatingLabel
                ? 'top-2 text-xs text-gold-600 font-medium'
                : 'top-1/2 -translate-y-1/2 text-charcoal-400'
              }
            `}
          >
            {label}
          </label>
        )}
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-charcoal-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
