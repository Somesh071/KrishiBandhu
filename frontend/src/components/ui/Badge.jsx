const variants = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  dot = false,
  className = '' 
}) => {
  return (
    <span className={`
      inline-flex items-center gap-1.5
      font-medium rounded-lg
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {dot && (
        <span className={`
          w-1.5 h-1.5 rounded-full
          ${variant === 'success' ? 'bg-green-500' : ''}
          ${variant === 'warning' ? 'bg-amber-500' : ''}
          ${variant === 'danger' ? 'bg-red-500' : ''}
          ${variant === 'primary' ? 'bg-primary-500' : ''}
          ${variant === 'default' ? 'bg-neutral-500' : ''}
        `} />
      )}
      {children}
    </span>
  );
};

export default Badge;
