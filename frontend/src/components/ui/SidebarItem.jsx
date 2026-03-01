import { Link, useLocation } from 'react-router-dom';

export const SidebarItem = ({ 
  path, 
  icon: Icon, 
  label, 
  isCollapsed = false,
  badge = null,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  const content = (
    <>
      <div className={`
        flex items-center justify-center
        w-9 h-9 rounded-xl
        transition-colors duration-200
        ${isActive 
          ? 'bg-primary-600 text-white' 
          : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
        }
      `}>
        <Icon className="w-5 h-5" />
      </div>
      {!isCollapsed && (
        <span className={`
          flex-1 text-sm font-medium transition-colors duration-200
          ${isActive 
            ? 'text-primary-700 dark:text-primary-400' 
            : 'text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
          }
        `}>
          {label}
        </span>
      )}
      {!isCollapsed && badge && (
        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  const className = `
    group flex items-center gap-3 
    px-3 py-2.5 
    rounded-xl
    transition-all duration-200
    ${isCollapsed ? 'justify-center' : ''}
    ${isActive 
      ? 'bg-primary-50 dark:bg-primary-900/20' 
      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
    }
  `;

  if (onClick) {
    return (
      <button onClick={onClick} className={className} title={isCollapsed ? label : undefined}>
        {content}
      </button>
    );
  }

  return (
    <Link to={path} className={className} title={isCollapsed ? label : undefined}>
      {content}
    </Link>
  );
};

export const SidebarSection = ({ title, children, isCollapsed = false }) => (
  <div className="mb-6">
    {!isCollapsed && title && (
      <h3 className="px-3 mb-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default SidebarItem;
