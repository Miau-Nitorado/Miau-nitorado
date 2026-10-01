import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, hint, id, className = '', ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="label-field">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
