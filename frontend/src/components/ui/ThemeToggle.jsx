import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '' }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={`
        relative p-2 rounded-xl
        text-neutral-500 hover:text-neutral-900
        hover:bg-neutral-100
        dark:text-neutral-400 dark:hover:text-neutral-100
        dark:hover:bg-neutral-800
        transition-all duration-200
        ${className}
      `}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-300
            ${darkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}
          `} 
        />
        <Moon 
          className={`
            absolute inset-0 w-5 h-5
            transition-all duration-300
            ${darkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}
          `} 
        />
      </div>
    </button>
  );
};

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return { darkMode, toggleTheme };
};

export default ThemeToggle;
