import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../provider/ThemeProvider';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-3 rounded-full transition-all duration-300 group ${
        isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400 shadow-lg shadow-gray-800/30' 
          : 'bg-gray-200 hover:bg-gray-300 text-orange-500 shadow-lg shadow-gray-200/50'
      } ${className}`}
      whileHover={{ scale: 1.1, rotate: isDarkMode ? 180 : -180 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        className="relative"
      >
        {isDarkMode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaMoon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaSun className="w-5 h-5" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Glowing effect for dark mode */}
      {isDarkMode && (
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-md"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
};

export default ThemeToggle;