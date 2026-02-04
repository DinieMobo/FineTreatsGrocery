import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NoData from '../components/NoData'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBox, FaShoppingBag, FaTruck, FaCalendarAlt, FaSearch, FaFilter, FaTimes, FaSortAmountDown } from 'react-icons/fa'
import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'
import { filterOrders, clearFilters, updateOrderStatus } from '../store/orderSlice'
import { useGlobalContext } from '../provider/GlobalProvider'
import OrderStatusUpdate from '../components/OrderStatusUpdate'

const MyOrders = () => {
  const dispatch = useDispatch()
  const { fetchOrder } = useGlobalContext()
  const { order, filteredOrders, loading, filter } = useSelector(state => state.orders)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [hoveredOrder, setHoveredOrder] = useState(null)
  const [viewImage, setViewImage] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('date-desc')

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const [localFilter, setLocalFilter] = useState({
    status: 'all',
    dateRange: 'all',
    searchQuery: ''
  })

  const handleApplyFilter = () => {
    dispatch(filterOrders(localFilter))
    setShowFilters(false)
  }

  const handleResetFilter = () => {
    setLocalFilter({
      status: 'all',
      dateRange: 'all',
      searchQuery: ''
    })
    dispatch(clearFilters())
  }

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'price-asc':
        return a.totalAmt - b.totalAmt
      case 'price-desc':
        return b.totalAmt - a.totalAmt
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const getFormattedDate = (timestamp) => {
    try {
      return format(parseISO(timestamp), 'MMM dd, yyyy')
    } catch (error) {
      return 'N/A'
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500 dark:bg-green-600';
      case 'processing':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'shipped':
        return 'bg-indigo-500 dark:bg-indigo-600';
      case 'ordered':
        return 'bg-blue-600 dark:bg-blue-700';
      case 'cancelled':
        return 'bg-red-500 dark:bg-red-600';
      case 'cash on delivery':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'pending':
        return 'bg-yellow-500 dark:bg-yellow-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  }

  const getStatusDisplayText = (order) => {
    return order.order_status || order.payment_status || 'Pending';
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-xl p-4 mt-4 transition-colors duration-300"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md p-5 rounded-lg mb-6 flex items-center justify-between'
      >
        <h1 className='text-xl md:text-2xl font-bold flex items-center'>
          <FaShoppingBag className="mr-3" /> My Orders
        </h1>
        <span className="text-sm bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-medium transition-colors duration-300">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </motion.div>

      {/* Search and filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search orders by ID or product name..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 transition-colors duration-300"
            value={localFilter.searchQuery}
            onChange={e => setLocalFilter({...localFilter, searchQuery: e.target.value})}
            onKeyDown={e => e.key === 'Enter' && handleApplyFilter()}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg flex items-center gap-2 transition-colors duration-300"
              onClick={() => document.getElementById('sortDropdown').classList.toggle('hidden')}
            >
              <FaSortAmountDown /> Sort
            </motion.button>
            <div id="sortDropdown" className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden border dark:border-gray-700">
              <div className="py-1">
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${sortBy === 'date-desc' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}`}
                  onClick={() => {setSortBy('date-desc'); document.getElementById('sortDropdown').classList.add('hidden')}}
                >
                  Date (Newest First)
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${sortBy === 'date-asc' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}`}
                  onClick={() => {setSortBy('date-asc'); document.getElementById('sortDropdown').classList.add('hidden')}}
                >
                  Date (Oldest First)
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${sortBy === 'price-desc' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}`}
                  onClick={() => {setSortBy('price-desc'); document.getElementById('sortDropdown').classList.add('hidden')}}
                >
                  Price (High to Low)
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${sortBy === 'price-asc' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}`}
                  onClick={() => {setSortBy('price-asc'); document.getElementById('sortDropdown').classList.add('hidden')}}
                >
                  Price (Low to High)
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-hidden transition-colors duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Filter Orders</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2"
                  value={localFilter.status}
                  onChange={e => setLocalFilter({...localFilter, status: e.target.value})}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="cash on delivery">Cash on Delivery</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2"
                  value={localFilter.dateRange}
                  onChange={e => setLocalFilter({...localFilter, dateRange: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option>
                  <option value="last6months">Last 6 Months</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button 
                onClick={handleResetFilter}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                Reset
              </button>
              <button 
                onClick={handleApplyFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors duration-300"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && sortedOrders.length === 0 && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center py-8"
        >
          {order.length > 0 ? (
            <div>
              <FaFilter className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-2 transition-colors duration-300" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">No matching orders found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">Try changing your filters or search terms</p>
              <button 
                onClick={handleResetFilter}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <NoData />
          )}
        </motion.div>
      )}

      {/* Image viewer */}
      <AnimatePresence>
        {viewImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setViewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="relative max-w-2xl max-h-[80vh] rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2 transition-colors duration-300"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={viewImage} 
                alt="Product image" 
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <button 
                className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-300"
                onClick={() => setViewImage(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order list */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {sortedOrders.map((order, index) => {
          const isExpanded = expandedOrder === order._id;
          const isHovered = hoveredOrder === order._id;
          
          return (
            <motion.div
              key={order._id + index + "order"}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ${
                isHovered ? 'shadow-lg' : 'shadow-md'
              }`}
              onMouseEnter={() => setHoveredOrder(order._id)}
              onMouseLeave={() => setHoveredOrder(null)}
            >
              <motion.div 
                className={`border-l-4 ${getStatusColor(getStatusDisplayText(order))} p-4`}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 cursor-pointer"
                     onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1">
                      {order.product_details?.name || "Product"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Order ID:</span> {order.orderId}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(getStatusDisplayText(order))} transition-colors duration-300`}>
                      {getStatusDisplayText(order)}
                    </span>
                    
                    <div className="ml-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <FaCalendarAlt className="text-blue-500 dark:text-blue-400" />
                      <span className="text-sm">{getFormattedDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="relative group">
                    <div 
                      className={`h-16 w-16 rounded-md overflow-hidden transition-transform duration-300 cursor-pointer ${
                        isHovered ? 'transform scale-105' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (order.product_details?.image?.[0]) {
                          setViewImage(order.product_details.image[0]);
                        }
                      }}
                    >
                      {order.product_details?.image?.[0] ? (
                        <img
                          src={order.product_details.image[0]}
                          alt={order.product_details?.name || "Product"}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <FaBox className="text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    {isHovered && order.product_details?.image?.[0] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-md cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewImage(order.product_details.image[0]);
                        }}
                      >
                        <FaSearch className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          Rs.{order.subTotalAmt?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{order.quantity || 1}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          Rs.{order.totalAmt?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isExpanded ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <svg
                      className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <FaTruck className="text-blue-500 dark:text-blue-400" /> Delivery Details
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                            {order.delivery_address ? (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.delivery_address.address_line1}, {order.delivery_address.address_line2}<br />
                                {order.delivery_address.city}, {order.delivery_address.state}, {order.delivery_address.zipcode}<br />
                                {order.delivery_address.country}<br />
                                Phone: {order.delivery_address.phone}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">Delivery details not available</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <FaBox className="text-blue-500 dark:text-blue-400" /> Product Details
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{order.product_details?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.product_details?.description?.substring(0, 100) || 'No description available'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Link to={`/dashboard/orderdetails/${order._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300"
                          >
                            View Details
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  )
}

export default MyOrders