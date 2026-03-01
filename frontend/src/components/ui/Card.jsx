import { forwardRef } from 'react';

export const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  padding = 'default',
  onClick,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      ref={ref}
      onClick={onClick}
      className={`
        bg-white dark:bg-neutral-900 
        border border-neutral-200 dark:border-neutral-800
        rounded-2xl
        shadow-soft
        transition-all duration-200
        ${hover ? 'hover:shadow-soft-md hover:-translate-y-0.5 cursor-pointer' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950' : ''}
        ${paddingClasses[padding] || paddingClasses.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, icon: Icon, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {Icon && (
      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
      {children}
    </h3>
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 ${className}`}>
    {children}
  </div>
);

export default Card;
