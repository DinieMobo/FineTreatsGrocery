import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { updateOrderStatus } from '../utils/Axios';
import isAdmin from '../utils/isAdmin';

const OrderStatusUpdate = ({ order, onStatusUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.order_status || order.payment_status || 'ordered');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  const statusOptions = [
    { value: 'ordered', label: 'Ordered', color: 'bg-blue-600 dark:bg-blue-700' },
    { value: 'processing', label: 'Processing', color: 'bg-yellow-500 dark:bg-yellow-600' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-500 dark:bg-indigo-600' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500 dark:bg-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500 dark:bg-red-600' }
  ];

  const currentStatus = order.order_status || order.payment_status || 'ordered';
  const currentStatusOption = statusOptions.find(opt => opt.value.toLowerCase() === currentStatus.toLowerCase()) || statusOptions[0];

  const handleUpdateStatus = async () => {
    if (selectedStatus === currentStatus) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const response = await updateOrderStatus(order.orderId, selectedStatus);
      
      if (response.success) {
        toast.success(`Order status updated to ${selectedStatus}`);
        setIsEditing(false);
        if (onStatusUpdate) {
          onStatusUpdate(order.orderId, selectedStatus);
        }
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(currentStatus);
    setIsEditing(false);
  };

  if (!isAdmin(user?.role)) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${currentStatusOption.color} transition-colors duration-300`}>
        {currentStatusOption.label}
      </span>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${currentStatusOption.color} transition-colors duration-300`}>
          {currentStatusOption.label}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors duration-300"
          title="Update Status"
        >
          <FaEdit />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
        disabled={loading}
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdateStatus}
        disabled={loading}
        className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm disabled:opacity-50 transition-colors duration-300"
        title="Save"
      >
        <FaCheck />
      </button>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm disabled:opacity-50 transition-colors duration-300"
        title="Cancel"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default OrderStatusUpdate;