import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaBox, FaEdit, FaSearch, FaFilter, FaTimes, FaSort, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { setOrder, adminUpdateOrderStatus } from '../store/orderSlice';
import { getAllOrders, updateOrderStatus as updateOrderStatusApi } from '../utils/Axios';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';

const AdminOrderManagement = () => {
  const dispatch = useDispatch();
  const { order } = useSelector(state => state.orders);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getAllOrders();
        if (response.success && response.data) {
          setAllOrders(response.data);
          setFilteredOrders(response.data);
          dispatch(setOrder(response.data));
        } else {
          toast.error("Failed to load orders");
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...allOrders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => {
        const status = (order.order_status || order.payment_status || '').toLowerCase();
        return status === statusFilter.toLowerCase();
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        (order.orderId && order.orderId.toLowerCase().includes(query)) ||
        (order.product_details?.name && order.product_details.name.toLowerCase().includes(query)) ||
        (order.userId?.name && order.userId.name.toLowerCase().includes(query)) ||
        (order.userId?.email && order.userId.email.toLowerCase().includes(query))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price-asc':
          return a.totalAmt - b.totalAmt;
        case 'price-desc':
          return b.totalAmt - a.totalAmt;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(filtered);
  }, [allOrders, statusFilter, searchQuery, sortBy]);

  const getFormattedDate = (timestamp) => {
    try {
      return format(parseISO(timestamp), 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-indigo-500';
      case 'ordered':
        return 'bg-blue-600';
      case 'cancelled':
        return 'bg-red-500';
      case 'cash on delivery':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusApi(orderId, newStatus);
      
      if (response.success) {
        dispatch(adminUpdateOrderStatus({ orderId, status: newStatus }));
        
        setAllOrders(prev => prev.map(order => 
          order.orderId === orderId ? { ...order, order_status: newStatus } : order
        ));
        
        toast.success(`Order status updated to ${newStatus}`);
        setEditingOrder(null);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto bg-white/30 rounded-lg shadow-xl p-4 mt-4"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md p-5 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Admin Order Management</h1>
        <p className="opacity-80">Manage and update customer orders</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders by ID, product or customer..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="ordered">Ordered</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="cash on delivery">Cash on Delivery</option>
          </select>
        </div>

        <div>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="price-asc">Price (Low to High)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No orders matching your filters
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>
                        <p className="font-medium">{order.userId?.name || 'Unknown'}</p>
                        <p className="text-gray-500 text-xs">{order.userId?.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {order.product_details?.image?.[0] ? (
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={order.product_details.image[0]}
                              alt={order.product_details.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                              <FaBox className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                            {order.product_details?.name || 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {order.quantity || 1}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {DisplayPriceInRupees(order.totalAmt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getFormattedDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editingOrder === order._id ? (
                        <select 
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          defaultValue={order.order_status || order.payment_status?.toLowerCase()}
                          onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                          autoFocus
                        >
                          <option value="ordered">Ordered</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(order.order_status || order.payment_status)}`}>
                          {order.order_status || order.payment_status || 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        {editingOrder === order._id ? (
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="text-gray-500 hover:text-gray-700"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingOrder(order._id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Update Status"
                          >
                            <FaEdit />
                          </button>
                        )}
                        <Link 
                          to={`/dashboard/orderdetails/${order._id}`}
                          className="text-indigo-500 hover:text-indigo-700"
                          title="View Order Details"
                        >
                          <FaSearch />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrderManagement;