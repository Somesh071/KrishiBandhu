import { User } from 'lucide-react';

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const Avatar = ({ 
  src, 
  alt = '', 
  name = '',
  size = 'md',
  className = '' 
}) => {
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt || name} 
        className={`
          ${sizes[size]} 
          rounded-xl 
          object-cover 
          ring-2 ring-white dark:ring-neutral-800
          ${className}
        `}
      />
    );
  }

  if (initials) {
    return (
      <div className={`
        ${sizes[size]} 
        rounded-xl 
        bg-primary-100 dark:bg-primary-900/30
        flex items-center justify-center
        ${className}
      `}>
        <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`
      ${sizes[size]} 
      rounded-xl 
      bg-neutral-100 dark:bg-neutral-800
      flex items-center justify-center
      ${className}
    `}>
      <User className={`${iconSizes[size]} text-neutral-500 dark:text-neutral-400`} />
    </div>
  );
};

export default Avatar;
