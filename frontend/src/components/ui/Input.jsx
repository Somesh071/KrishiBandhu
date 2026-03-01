import { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-neutral-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-700
            rounded-xl
            text-sm text-neutral-900 dark:text-neutral-100
            placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            dark:focus:ring-primary-400/20 dark:focus:border-primary-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({ 
  label,
  error,
  className = '',
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-700
          rounded-xl
          text-sm text-neutral-900 dark:text-neutral-100
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
          dark:focus:ring-primary-400/20 dark:focus:border-primary-400
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
