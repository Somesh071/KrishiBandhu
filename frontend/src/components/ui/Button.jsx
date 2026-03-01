import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: `
    bg-primary-600 text-white 
    hover:bg-primary-700 
    active:bg-primary-800
    focus-visible:ring-primary-500
    shadow-sm
  `,
  secondary: `
    bg-neutral-100 text-neutral-900 
    border border-neutral-200
    hover:bg-neutral-200
    active:bg-neutral-300
    dark:bg-neutral-800 dark:text-neutral-100
    dark:border-neutral-700
    dark:hover:bg-neutral-700
  `,
  ghost: `
    bg-transparent text-neutral-600
    hover:bg-neutral-100 hover:text-neutral-900
    dark:text-neutral-400
    dark:hover:bg-neutral-800 dark:hover:text-neutral-100
  `,
  success: `
    bg-primary-500 text-white
    hover:bg-primary-600
    active:bg-primary-700
    shadow-sm
  `,
  warning: `
    bg-secondary-500 text-white
    hover:bg-secondary-600
    active:bg-secondary-700
    shadow-sm
  `,
  danger: `
    bg-red-500 text-white
    hover:bg-red-600
    active:bg-red-700
    shadow-sm
  `,
  sky: `
    bg-sky-500 text-white
    hover:bg-sky-600
    active:bg-sky-700
    shadow-sm
  `,
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2.5',
};

export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium
        rounded-xl
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
});

Button.displayName = 'Button';

export const IconButton = forwardRef(({ 
  icon: Icon, 
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500
        active:scale-95
        ${variant === 'ghost' ? 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800' : ''}
        ${variant === 'primary' ? 'text-white bg-primary-600 hover:bg-primary-700' : ''}
        ${buttonSizes[size]}
        ${className}
      `}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default Button;
