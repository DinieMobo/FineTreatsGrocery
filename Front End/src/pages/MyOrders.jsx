import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBox, FaShoppingBag, FaTruck, FaCalendarAlt, FaSearch } from 'react-icons/fa'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [hoveredOrder, setHoveredOrder] = useState(null)
  const [viewImage, setViewImage] = useState(null)

  const getFormattedDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy')
    } catch (error) {
      return 'N/A'
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-indigo-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-white-500';
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white/30 rounded-lg shadow-xl p-4 mt-4"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md p-5 rounded-lg mb-6 flex items-center justify-between'
      >
        <h1 className='text-xl md:text-2xl font-bold flex items-center'>
          <FaShoppingBag className="mr-3" /> My Orders
        </h1>
        <span className="text-sm bg-white text-indigo-600 px-3 py-1 rounded-full font-medium">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </motion.div>

      {!orders[0] && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <NoData />
        </motion.div>
      )}

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
              className="relative max-w-2xl max-h-[80vh] rounded-lg overflow-hidden bg-white p-2"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={viewImage} 
                alt="Product image" 
                className="w-full h-full object-contain"
              />
              <button 
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-gray-800 hover:bg-white"
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

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {orders.map((order, index) => {
          const isExpanded = expandedOrder === order._id;
          const isHovered = hoveredOrder === order._id;
          
          return (
            <motion.div
              key={order._id + index + "order"}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg overflow-hidden transition-all duration-300 ${
                isHovered ? 'shadow-lg' : 'shadow-md'
              }`}
              onMouseEnter={() => setHoveredOrder(order._id)}
              onMouseLeave={() => setHoveredOrder(null)}
            >
              <motion.div 
                className={`border-l-4 ${getStatusColor(order.payment_status || 'pending')} p-4`}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 cursor-pointer"
                     onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {order.product_details?.name || "Product"}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <span className="font-medium text-blue-600">Order ID:</span> {order.orderId}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.payment_status || 'pending')}`}>
                      {order.payment_status || 'Pending'}
                    </span>
                    
                    <div className="ml-4 flex items-center gap-2 text-gray-500">
                      <FaCalendarAlt className="text-blue-500" />
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
                        setViewImage(order.product_details?.image?.[0]);
                      }}
                    >
                      <img
                        src={order.product_details?.image?.[0]}
                        alt={order.product_details?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-md cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewImage(order.product_details?.image?.[0]);
                        }}
                      >
                        <FaSearch className="text-white" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-medium text-gray-800">
                          Rs.{order.subTotalAmt?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-medium text-gray-800">1</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-medium text-gray-800">
                          Rs.{order.totalAmt?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
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
                      className="overflow-hidden mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <FaTruck className="text-blue-500" /> Delivery Details
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            {order.delivery_address ? (
                              <p className="text-sm text-gray-600">
                                {order.delivery_address.address_line1}, {order.delivery_address.address_line2}<br />
                                {order.delivery_address.city}, {order.delivery_address.state}, {order.delivery_address.zipcode}<br />
                                {order.delivery_address.country}<br />
                                Phone: {order.delivery_address.phone}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500">Delivery details not available</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <FaBox className="text-blue-500" /> Product Details
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700 font-medium">{order.product_details?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{order.product_details?.description?.substring(0, 100) || 'No description available'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Link to={`/dashboard/orderdetails/${order._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-300"
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