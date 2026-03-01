import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  ChevronDown,
  Phone,
  History,
  Shield,
  Sprout,
  Settings
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { ThemeToggle } from './ui/ThemeToggle';
import { Avatar } from './ui/Avatar';
import { SidebarItem, SidebarSection } from './ui/SidebarItem';

// =============================================================================
// LOGO COMPONENT
// =============================================================================
const Logo = ({ collapsed = false }) => (
  <Link to="/dashboard" className="flex items-center gap-3 group">
    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105">
      <Sprout className="w-5 h-5 text-white" />
    </div>
    {!collapsed && (
      <div className="flex flex-col">
        <span className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
          KrishiBandhu
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Farmer Assistant
        </span>
      </div>
    )}
  </Link>
);

// =============================================================================
// PROFILE DROPDOWN
// =============================================================================
const ProfileDropdown = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <Avatar name={user?.name} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {user?.role === 'admin' ? 'Administrator' : 'Farmer'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-soft-lg z-50 py-2 animate-fade-in">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          </div>
          
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Settings className="w-4 h-4" />
              Profile & Settings
            </Link>
            <Link
              to="/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <History className="w-4 h-4" />
              Conversation History
            </Link>
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// NOTIFICATION BELL
// =============================================================================
const NotificationBell = () => {
  const [hasNotifications] = useState(true);

  return (
    <button className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors">
      <Bell className="w-5 h-5" />
      {hasNotifications && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
};

// =============================================================================
// NAVBAR COMPONENT
// =============================================================================
export const Navbar = ({ onMenuClick, showMenuButton = true }) => {
  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="lg:hidden">
          <Logo collapsed />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <ThemeToggle />
        <NotificationBell />
        <div className="hidden sm:block w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-2" />
        <ProfileDropdown />
      </div>
    </header>
  );
};

// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================
export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const mainNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'AI Chat Assistant' },
  ];

  const featureNavItems = [
    { path: '/call', icon: Phone, label: 'Voice Call' },
    { path: '/history', icon: History, label: 'History' },
  ];

  const settingsNavItems = [
    { path: '/profile', icon: Settings, label: 'Settings' },
  ];

  if (user?.role === 'admin') {
    settingsNavItems.unshift({ path: '/admin', icon: Shield, label: 'Admin Panel' });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-950/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col
        bg-white dark:bg-neutral-950
        border-r border-neutral-200 dark:border-neutral-800
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
          <Logo collapsed={isCollapsed} />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <SidebarSection title="Main" isCollapsed={isCollapsed}>
            {mainNavItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Features" isCollapsed={isCollapsed}>
            {featureNavItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Settings" isCollapsed={isCollapsed}>
            {settingsNavItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center gap-2 p-3 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

// =============================================================================
// APP LAYOUT WITH SIDEBAR
// =============================================================================
export const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// =============================================================================
// SIMPLE LAYOUT (Auth pages, Landing)
// =============================================================================
export const SimpleLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {children}
    </div>
  );
};

// =============================================================================
// PAGE HEADER
// =============================================================================
export const PageHeader = ({ 
  title, 
  description = null, 
  actions = null,
  backPath = null,
  backLabel = 'Back'
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {backPath && (
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {backLabel}
        </button>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-sm">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-neutral-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// LOADING SKELETON
// =============================================================================
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-xl',
    card: 'h-32 w-full rounded-2xl',
    button: 'h-10 w-24 rounded-xl',
  };

  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg ${variants[variant]} ${className}`} />
  );
};

export default {
  Navbar,
  Sidebar,
  AppLayout,
  SimpleLayout,
  PageHeader,
  EmptyState,
  Skeleton,
};
