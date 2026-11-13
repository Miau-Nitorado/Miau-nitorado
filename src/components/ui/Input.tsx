import { forwardRef, useId, type InputHTMLAttributes } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; required?: boolean; hint?: string; }
const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, required, hint, id, className = '', ...props }, ref) => {
  const generatedId = useId(); const inputId = id || props.name || generatedId;
  const descriptionIds = [error ? `${inputId}-error` : undefined, hint && !error ? `${inputId}-hint` : undefined].filter(Boolean).join(' ') || undefined;
  return <div>
    {label && <label htmlFor={inputId} className="label-field">{label} {required && <span aria-hidden="true" className="text-red-600">*</span>}</label>}
    <input ref={ref} id={inputId} className={`input-field ${error ? 'border-red-600 focus:border-red-700 focus:ring-red-200' : ''} ${className}`} aria-invalid={error ? true : undefined} aria-describedby={descriptionIds} aria-required={required || undefined} {...props} />
    {hint && !error && <p id={`${inputId}-hint`} className="mt-1 text-xs text-gray-600">{hint}</p>}
    {error && <p id={`${inputId}-error`} className="mt-1 text-xs text-red-700" role="alert">{error}</p>}
  </div>;
});
Input.displayName = 'Input'; export default Input;