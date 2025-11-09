import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaTruck, FaBox, FaTimes } from 'react-icons/fa';

const OrderStatusBadge = ({ status, size = 'normal', showIcon = true, className = '' }) => {
  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'pending';
    
    switch(normalizedStatus) {
      case 'ordered':
        return {
          color: 'bg-yellow-500 dark:bg-yellow-600 text-white',
          hoverColor: 'hover:bg-blue-600 dark:hover:bg-blue-700',
          icon: <FaBox />,
          label: 'Ordered',
          pulse: true
        };
      case 'processing':
        return {
          color: 'bg-yellow-500 dark:bg-yellow-600 text-white',
          hoverColor: 'hover:bg-yellow-600 dark:hover:bg-yellow-700',
          icon: <FaClock />,
          label: 'Processing',
          pulse: true
        };
      case 'shipped':
        return {
          color: 'bg-indigo-500 dark:bg-indigo-600 text-white',
          hoverColor: 'hover:bg-indigo-600 dark:hover:bg-indigo-700',
          icon: <FaTruck />,
          label: 'Shipped',
          pulse: false
        };
      case 'delivered':
      case 'completed':
        return {
          color: 'bg-green-500 dark:bg-green-600 text-white',
          hoverColor: 'hover:bg-green-600 dark:hover:bg-green-700',
          icon: <FaCheckCircle />,
          label: 'Delivered',
          pulse: false
        };
      case 'cancelled':
        return {
          color: 'bg-red-500 dark:bg-red-600 text-white',
          hoverColor: 'hover:bg-red-600 dark:hover:bg-red-700',
          icon: <FaTimes />,
          label: 'Cancelled',
          pulse: false
        };
      case 'cash on delivery':
        return {
          color: 'bg-orange-500 dark:bg-orange-600 text-white',
          hoverColor: 'hover:bg-orange-600 dark:hover:bg-orange-700',
          icon: <FaBox />,
          label: 'Cash on Delivery',
          pulse: true
        };
      default:
        return {
          color: 'bg-gray-500 dark:bg-gray-600 text-white',
          hoverColor: 'hover:bg-gray-600 dark:hover:bg-gray-700',
          icon: <FaClock />,
          label: 'Pending',
          pulse: true
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    normal: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium transition-all duration-300
        ${statusConfig.color} ${statusConfig.hoverColor} ${sizeClasses[size]} ${className}
      `}
      whileHover={{ scale: 1.05 }}
      animate={statusConfig.pulse ? {
        boxShadow: [
          '0 0 0 0 rgba(0, 0, 0, 0.1)',
          '0 0 0 8px rgba(0, 0, 0, 0)',
        ]
      } : {}}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {showIcon && (
        <span className="text-xs">
          {statusConfig.icon}
        </span>
      )}
      <span>{statusConfig.label}</span>
    </motion.span>
  );
};

export default OrderStatusBadge;