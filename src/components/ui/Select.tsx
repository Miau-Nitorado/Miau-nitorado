import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label?: string; error?: string; required?: boolean; options: { value: string; label: string }[]; placeholder?: string; }
const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, required, options, placeholder, id, className = '', ...props }, ref) => {
  const generatedId = useId(); const selectId = id || props.name || generatedId; const descriptionId = error ? `${selectId}-error` : undefined;
  return <div>
    {label && <label htmlFor={selectId} className="label-field">{label} {required && <span aria-hidden="true" className="text-red-600">*</span>}</label>}
    <select ref={ref} id={selectId} className={`input-field ${error ? 'border-red-600 focus:border-red-700 focus:ring-red-200' : ''} ${className}`} aria-invalid={error ? true : undefined} aria-describedby={descriptionId} aria-required={required || undefined} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <p id={descriptionId} className="mt-1 text-xs text-red-700" role="alert">{error}</p>}
  </div>;
});
Select.displayName = 'Select'; export default Select;