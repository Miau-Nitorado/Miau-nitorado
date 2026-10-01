import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, options, placeholder, id, className = '', ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div>
        {label && (
          <label htmlFor={selectId} className="label-field">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`input-field ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''} ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
