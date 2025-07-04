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
    { value: 'ordered', label: 'Ordered', color: 'bg-blue-600' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-500' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' }
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

  // Only admins can edit order status
  if (!isAdmin(user?.role)) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${currentStatusOption.color}`}>
        {currentStatusOption.label}
      </span>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${currentStatusOption.color}`}>
          {currentStatusOption.label}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 text-sm"
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
        className="text-xs border border-gray-300 rounded px-2 py-1"
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
        className="text-green-500 hover:text-green-700 text-sm disabled:opacity-50"
        title="Save"
      >
        <FaCheck />
      </button>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
        title="Cancel"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default OrderStatusUpdate;
