import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; required?: boolean; hint?: string; }
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, required, hint, id, className = '', ...props }, ref) => {
  const generatedId = useId(); const textareaId = id || props.name || generatedId;
  const descriptionIds = [error ? `${textareaId}-error` : undefined, hint && !error ? `${textareaId}-hint` : undefined].filter(Boolean).join(' ') || undefined;
  return <div>
    {label && <label htmlFor={textareaId} className="label-field">{label} {required && <span aria-hidden="true" className="text-red-600">*</span>}</label>}
    <textarea ref={ref} id={textareaId} className={`input-field resize-y min-h-[80px] ${error ? 'border-red-600 focus:border-red-700 focus:ring-red-200' : ''} ${className}`} aria-invalid={error ? true : undefined} aria-describedby={descriptionIds} aria-required={required || undefined} {...props} />
    {hint && !error && <p id={`${textareaId}-hint`} className="mt-1 text-xs text-gray-600">{hint}</p>}
    {error && <p id={`${textareaId}-error`} className="mt-1 text-xs text-red-700" role="alert">{error}</p>}
  </div>;
});
Textarea.displayName = 'Textarea'; export default Textarea;