import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { format, parseISO } from 'date-fns';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaCalendarAlt, FaCreditCard, 
         FaTruck, FaReceipt, FaPrint, FaDownload, FaSync } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';
import { setCurrentOrder } from '../store/orderSlice';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchOrderById, fetchOrder } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [orderTrackingSteps, setOrderTrackingSteps] = useState([]);
  const allOrders = useSelector(state => state.orders.order);
  const currentOrder = useSelector(state => state.orders.currentOrder);
  
  useEffect(() => {
    const getOrderDetails = async () => {
      setLoading(true);
      
      const orderFromStore = allOrders.find(order => order._id === orderId);
      
      if (orderFromStore) {
        dispatch(setCurrentOrder(orderFromStore));
        setLoading(false);
      } else {
        const fetchedOrder = await fetchOrderById(orderId);
        if (!fetchedOrder) {
          toast.error("Could not find order details");
          navigate('/dashboard/myorders');
        }
        setLoading(false);
      }
    };
    
    getOrderDetails();
  }, [orderId, allOrders, dispatch, fetchOrderById, navigate]);
  
  useEffect(() => {
    if (currentOrder) {
      const defaultSteps = [
        { id: 'ordered', label: 'Order Placed', completed: true, date: currentOrder.createdAt },
        { id: 'processing', label: 'Processing', completed: false, date: null },
        { id: 'shipped', label: 'Shipped', completed: false, date: null },
        { id: 'delivered', label: 'Delivered', completed: false, date: null }
      ];

      const status = currentOrder.order_status?.toLowerCase() || currentOrder.payment_status?.toLowerCase();
      
      if (status === 'processing' || status === 'shipped' || status === 'delivered' || status === 'completed') {
        defaultSteps[1].completed = true;
        defaultSteps[1].date = currentOrder.updatedAt || new Date(new Date(currentOrder.createdAt).getTime() + 1000*60*60*24);
      }
      
      if (status === 'shipped' || status === 'delivered' || status === 'completed') {
        defaultSteps[2].completed = true;
        defaultSteps[2].date = currentOrder.updatedAt || new Date(new Date(currentOrder.createdAt).getTime() + 1000*60*60*24*2);
      }
      
      if (status === 'delivered' || status === 'completed') {
        defaultSteps[3].completed = true;
        defaultSteps[3].date = currentOrder.updatedAt || new Date(new Date(currentOrder.createdAt).getTime() + 1000*60*60*24*5);
      }
      
      setOrderTrackingSteps(defaultSteps);
    }
  }, [currentOrder]);
  
  const getFormattedDate = useCallback((timestamp) => {
    try {
      return format(typeof timestamp === 'string' ? parseISO(timestamp) : timestamp, 'MMMM dd, yyyy • h:mm a');
    } catch (error) {
      return 'N/A';
    }
  }, []);
  
  const getStatusColor = useCallback((status) => {
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
  }, []);
  
  const handlePrintReceipt = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadReceipt = useCallback(() => {
    if (!currentOrder) return;
    
    const receiptContent = `
      <html>
        <head>
          <title>Receipt - ${currentOrder.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #3b82f6; text-align: center; margin-bottom: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-weight: bold; font-size: 24px; color: #3b82f6; margin-bottom: 10px; }
            .receipt-id { color: #6b7280; margin-bottom: 20px; }
            .order-details { margin: 20px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; color: #4b5563; }
            .item { margin-bottom: 20px; }
            .item img { max-width: 100px; max-height: 100px; margin-right: 10px; float: left; }
            .item-details { margin-left: 120px; }
            .total { font-weight: bold; margin-top: 20px; text-align: right; font-size: 18px; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { text-align: left; padding: 12px; }
            th { background-color: #f3f4f6; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .address { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Fine Treats Grocery</div>
            <div class="receipt-id">Receipt #: ${currentOrder.invoice_receipt || currentOrder.orderId}</div>
          </div>
          
          <div class="order-details">
            <div class="section-title">Order Information</div>
            <p>Order ID: ${currentOrder.orderId}</p>
            <p>Date: ${getFormattedDate(currentOrder.createdAt)}</p>
            <p>Payment Method: ${currentOrder.paymentId ? 'Online Payment' : 'Cash on Delivery'}</p>
            <p>Payment Status: ${currentOrder.payment_status || 'Processing'}</p>
          </div>
          
          <div class="section-title">Product Details</div>
          <div class="item">
            <img src="${currentOrder.product_details?.image?.[0] || 'placeholder.png'}" alt="Product Image">
            <div class="item-details">
              <p><strong>${currentOrder.product_details?.name || 'Product'}</strong></p>
              <p>Quantity: ${currentOrder.quantity || 1}</p>
              <p>Price per unit: Rs.${(currentOrder.subTotalAmt / (currentOrder.quantity || 1)).toFixed(2)}</p>
              <p>Subtotal: Rs.${currentOrder.subTotalAmt?.toFixed(2) || "0.00"}</p>
            </div>
            <div style="clear: both;"></div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>Rs.${currentOrder.subTotalAmt?.toFixed(2) || "0.00"}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td>Rs.${((currentOrder.subTotalAmt || 0) - (currentOrder.totalAmt || 0)).toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>Rs.${currentOrder.totalAmt?.toFixed(2) || "0.00"}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div class="address">
            <div class="section-title">Shipping Address</div>
            <p>${currentOrder.delivery_address?.address_line1 || ''}, ${currentOrder.delivery_address?.address_line2 || ''}</p>
            <p>${currentOrder.delivery_address?.city || ''}, ${currentOrder.delivery_address?.state || ''}, ${currentOrder.delivery_address?.zipcode || ''}</p>
            <p>${currentOrder.delivery_address?.country || ''}</p>
            <p>Phone: ${currentOrder.delivery_address?.phone || ''}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Fine Treats Grocery!</p>
            <p>For any queries, please contact us at support@finetreats.com</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${currentOrder.orderId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentOrder, getFormattedDate]);

  const handleRefreshOrder = async () => {
    await fetchOrder();
    const refreshedOrder = await fetchOrderById(orderId);
    if (refreshedOrder) {
      toast.success("Order details refreshed!");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading order details...</p>
      </div>
    );
  }
  
  if (!currentOrder) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Order Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">We couldn't find the order you're looking for.</p>
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
            className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowLeft className="text-gray-700 dark:text-gray-200" />
          </motion.button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Order Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Order #{currentOrder.orderId}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(currentOrder.order_status || currentOrder.payment_status)}`}>
            {currentOrder.order_status || currentOrder.payment_status || 'Processing'}
          </span>
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <FaCalendarAlt className="mr-1 text-blue-500" /> 
            {getFormattedDate(currentOrder.createdAt)}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefreshOrder}
            className="ml-3 p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            title="Refresh order details"
          >
            <FaSync className="text-sm" />
          </motion.button>
        </div>
      </div>
      
      {/* Order tracking timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
      >
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Order Status</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>
          
          {orderTrackingSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {step.completed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs font-medium mt-2 text-center dark:text-gray-300">{step.label}</div>
              {step.date && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {format(new Date(step.date), 'MMM dd')}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 flex items-center dark:text-gray-200">
                <FaBox className="mr-2 text-blue-500" /> 
                Product Details
              </h2>
            </div>
            
            <div className="p-4 flex">
              {/* Product image */}
              <div className="w-24 h-24 mr-4 rounded-md overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700">
                {currentOrder.product_details?.image?.[0] ? (
                  <img
                    src={currentOrder.product_details.image[0]}
                    alt={currentOrder.product_details?.name || "Product image"}
                    className="w-full h-full object-contain"
                    onClick={() => setViewImage(currentOrder.product_details.image[0])}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <FaBox className="text-gray-400 text-3xl" />
                  </div>
                )}
              </div>
              
              {/* Product information */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {currentOrder.product_details?.name || "Product Name"}
                </h3>
                
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Price:</span>{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {DisplayPriceInRupees(currentOrder.subTotalAmt)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Quantity:</span>{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {currentOrder.quantity || 1}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total:</span>{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {DisplayPriceInRupees(currentOrder.totalAmt)}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Order ID:</span>{' '}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {currentOrder.orderId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Payment information card */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 flex items-center dark:text-gray-200">
                <FaCreditCard className="mr-2 text-blue-500" /> 
                Payment Information
              </h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {currentOrder.paymentId ? 'Online Payment' : 'Cash on Delivery'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Payment Status</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {currentOrder.payment_status || 'Processing'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {DisplayPriceInRupees(currentOrder.subTotalAmt)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {DisplayPriceInRupees(currentOrder.totalAmt)}
                  </p>
                </div>
                
                {currentOrder.paymentId && (
                  <div className="col-span-2">
                    <p className="text-gray-500 dark:text-gray-400">Payment ID</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200 break-all">
                      {currentOrder.paymentId}
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 flex items-center dark:text-gray-200">
                <FaTruck className="mr-2 text-blue-500" /> 
                Delivery Information
              </h2>
            </div>
            
            <div className="p-4">
              {currentOrder.delivery_address ? (
                <div className="text-sm space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {currentOrder.delivery_address.address_line1}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentOrder.delivery_address.address_line2}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentOrder.delivery_address.city}, {currentOrder.delivery_address.state}, {currentOrder.delivery_address.zipcode}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentOrder.delivery_address.country}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Phone: {currentOrder.delivery_address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Address details not available</p>
              )}
            </div>
          </motion.div>
          
          {/* Invoice/Receipt*/}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold p-4 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 flex items-center dark:text-gray-200">
                <FaReceipt className="mr-2 text-blue-500" /> 
                Invoice / Receipt
              </h2>
            </div>
            
            <div className="p-4 text-center">
              {currentOrder.invoice_receipt || currentOrder.orderId ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Receipt ID: {currentOrder.invoice_receipt || currentOrder.orderId}
                  </p>
                  <div className="flex justify-center space-x-3">
                    <motion.button
                      className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrintReceipt}
                    >
                      <FaPrint className="mr-2" /> Print Receipt
                    </motion.button>
                    <motion.button
                      className="px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadReceipt}
                    >
                      <FaDownload className="mr-2" /> Download
                    </motion.button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
            className="relative max-w-2xl max-h-[80vh] rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2"
            onClick={e => e.stopPropagation()}
          >
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <img
              src={viewImage}
              alt="Product image"
              className="w-full h-full object-contain"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              onLoadStart={() => setImageLoading(true)}
            />
            <button
              className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700"
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