import React, { useId } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  helperText?: string;
}

const ChevronDown = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = 'Select an option',
  leftIcon,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-charcoal-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <select
          id={selectId}
          className={`
            w-full px-4 py-3.5 rounded-2xl appearance-none
            bg-white border-2 transition-all duration-200
            text-charcoal-900 cursor-pointer
            focus:outline-none focus:ring-0
            ${leftIcon ? 'pl-12' : ''}
            pr-12
            ${error
              ? 'border-error-500 focus:border-error-500'
              : 'border-charcoal-200 focus:border-brand-800 hover:border-charcoal-300'
            }
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none">
          <ChevronDown />
        </div>
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

export default Select;
