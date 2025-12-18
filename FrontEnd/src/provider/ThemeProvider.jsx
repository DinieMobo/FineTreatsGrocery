import React, { createContext, useContext, useEffect, useLayoutEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const user = useSelector(state => state.user.user);

  const syncThemePreference = useCallback(
    debounce(async (preference) => {
      if (!user?._id) return;
      
      try {
        await Axios({
          ...SummaryApi.updateUserDetails,
          data: { theme_preference: preference }
        });
      } catch (error) {
        console.error("Failed to sync theme preference:", error);
      }
    }, 500), 
    [user?._id]
  );

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
    
    if (user?._id) {
      syncThemePreference(isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, syncThemePreference, user?._id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  useEffect(() => {
    if (user?.theme_preference) {
      if (user.theme_preference === 'system') {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDarkMode(user.theme_preference === 'dark');
      }
    }
  }, [user?.theme_preference]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((theme) => {
    setIsDarkMode(theme === 'dark');
  }, []);

  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light'
  }), [isDarkMode, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default React.memo(ThemeProvider);