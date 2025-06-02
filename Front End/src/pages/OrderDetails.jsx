import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { format } from 'date-fns';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard, 
         FaTruck, FaReceipt, FaPrint, FaDownload } from 'react-icons/fa';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const allOrders = useSelector(state => state.orders.order);
  
  useEffect(() => {
    const orderFromStore = allOrders.find(order => order._id === orderId);
    
    if (orderFromStore) {
      setOrderData(orderFromStore);
      setLoading(false);
    } else {
      fetchOrderDetails();
    }
  }, [orderId, allOrders]);
  
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSingleOrder,
        method: 'GET',
        params: { orderId }
      });
      
      if (response.data.success) {
        setOrderData(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getFormattedDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMMM dd, yyyy • h:mm a');
    } catch (error) {
      return 'N/A';
    }
  };
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-indigo-500';
      case 'delivered':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!orderData) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-4">We couldn't find the order you're looking for.</p>
        <button 
          onClick={() => navigate('/dashboard/myorders')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to My Orders
        </button>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <motion.button
            onClick={() => navigate('/dashboard/myorders')}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowLeft className="text-gray-700" />
          </motion.button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-800">Order Details</h1>
            <p className="text-sm text-gray-500">Order #{orderData.orderId}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(orderData.payment_status)}`}>
            {orderData.payment_status || 'Processing'}
          </span>
          <span className="ml-3 text-sm text-gray-500 flex items-center">
            <FaCalendarAlt className="mr-1 text-blue-500" /> 
            {getFormattedDate(orderData.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white flex items-center">
                <FaBox className="mr-2 text-blue-500" /> 
                Product Details
              </h2>
            </div>
            
            <div className="p-4 flex">
              {/* Product image */}
              <div className="w-24 h-24 mr-4 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                <img
                  src={orderData.product_details?.image?.[0]}
                  alt={orderData.product_details?.name}
                  className="w-full h-full object-contain"
                  onClick={() => setViewImage(orderData.product_details?.image?.[0])}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              
              {/* Product information */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">
                  {orderData.product_details?.name || "Product Name"}
                </h3>
                
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>{' '}
                    <span className="font-medium text-gray-800">
                      {DisplayPriceInRupees(orderData.subTotalAmt)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Quantity:</span>{' '}
                    <span className="font-medium text-gray-800">1</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Total:</span>{' '}
                    <span className="font-medium text-gray-800">
                      {DisplayPriceInRupees(orderData.totalAmt)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Order ID:</span>{' '}
                    <span className="font-medium text-gray-800">
                      {orderData.orderId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Payment information card */}
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white flex items-center">
                <FaCreditCard className="mr-2 text-blue-500" /> 
                Payment Information
              </h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800">
                    {orderData.paymentId ? 'Online Payment' : 'Cash on Delivery'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className="font-medium text-gray-800">
                    {orderData.payment_status || 'Processing'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-medium text-gray-800">
                    {DisplayPriceInRupees(orderData.subTotalAmt)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-800">
                    {DisplayPriceInRupees(orderData.totalAmt)}
                  </p>
                </div>
                
                {orderData.paymentId && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Payment ID</p>
                    <p className="font-medium text-gray-800 break-all">
                      {orderData.paymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar information - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Delivery information card */}
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white flex items-center">
                <FaTruck className="mr-2 text-blue-500" /> 
                Delivery Information
              </h2>
            </div>
            
            <div className="p-4">
              {orderData.delivery_address ? (
                <div className="text-sm space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {orderData.delivery_address.address_line1}
                      </p>
                      <p className="text-gray-600">
                        {orderData.delivery_address.address_line2}
                      </p>
                      <p className="text-gray-600">
                        {orderData.delivery_address.city}, {orderData.delivery_address.state}, {orderData.delivery_address.zipcode}
                      </p>
                      <p className="text-gray-600">
                        {orderData.delivery_address.country}
                      </p>
                      <p className="text-gray-600 mt-2">
                        Phone: {orderData.delivery_address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Address details not available</p>
              )}
            </div>
          </motion.div>
          
          {/* Invoice/Receipt*/}
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white flex items-center">
                <FaReceipt className="mr-2 text-blue-500" /> 
                Invoice / Receipt
              </h2>
            </div>
            
            <div className="p-4 text-center">
              {orderData.invoice_receipt ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Receipt ID: {orderData.invoice_receipt}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <motion.button
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPrint className="mr-2" /> Print Receipt
                    </motion.button>
                    <motion.button
                      className="px-3 py-2 bg-green-50 text-green-600 rounded-lg flex items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload className="mr-2" /> Download
                    </motion.button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No receipt available for this order yet.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Image viewer*/}
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
    </motion.div>
  );
};

export default OrderDetails;