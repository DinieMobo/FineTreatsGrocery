import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const SuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchCartItem, fetchOrder } = useGlobalContext();
  
  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        setIsLoading(true);
        
        const clearResponse = await Axios({
          ...SummaryApi.clearCart,
          method: 'POST'
        });
        
        if (clearResponse.data.success) {
          if (fetchCartItem) fetchCartItem();
        }
        
        const ordersResponse = await Axios({
          ...SummaryApi.getOrderList,
          method: 'GET'
        });
        
        if (ordersResponse.data.success && ordersResponse.data.data.length > 0) {
          const recentOrders = ordersResponse.data.data.filter(order => {
            const orderDate = new Date(order.createdAt);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return orderDate > fiveMinutesAgo;
          });
          
          if (recentOrders.length > 0) {
            setOrderPlaced(true);
            if (fetchOrder) fetchOrder();
            toast.success("Your order has been placed successfully!");
          } else {
            toast.success("Payment successful! Your order is being processed.");
          }
        }
      } catch (error) {
        console.error("Error processing success:", error);
        toast.error("There was an issue confirming your order. Please check your orders page.");
      } finally {
        setIsLoading(false);
        localStorage.removeItem('pendingPayment');
      }
    };

    const pendingPayment = localStorage.getItem('pendingPayment');
    
    if (pendingPayment) {
      const paymentData = JSON.parse(pendingPayment);
      // Check if the payment is recent (within last 10 minutes)
      const isRecentPayment = Date.now() - paymentData.timestamp < 10 * 60 * 1000;
      
      if (isRecentPayment) {
        processPaymentSuccess();
      } else {
        localStorage.removeItem('pendingPayment');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [fetchCartItem, fetchOrder]);

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        const ordersResponse = await Axios({
          ...SummaryApi.getOrderList
        });
        
        const orders = ordersResponse.data.data;
        const recentOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          return orderDate > fiveMinutesAgo;
        });
        
        if (recentOrders.length === 0) {
          await Axios({
            ...SummaryApi.clearCart,
            method: 'POST'
          });

          toast("Your payment was processed but we're still preparing your order. It will appear in your orders soon.", {
            icon: '⚠️',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
            },
          });
        } else {
          toast.success("Order placed successfully!");
        }
        
        if (fetchCartItem) fetchCartItem();
        
      } catch (error) {
        console.error("Error checking order status:", error);
      }
    };
    
    checkOrderStatus();
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-white to-green-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white max-w-lg w-full rounded-lg shadow-lg p-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.4
          }}
        >
          <FaCheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isLoading ? "Processing Your Order..." : "Payment Successful!"}
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {isLoading 
            ? "Please wait while we finalize your order..."
            : orderPlaced 
              ? "Thank you for your purchase. Your order has been placed successfully and will be processed immediately."
              : "Your payment was successful. Your order is being processed and will appear in your order history shortly."
          }
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button 
            onClick={() => navigate('/dashboard/myorders')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FaBox />
            View Orders
          </motion.button>
          
          <motion.button 
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FaHome />
            Continue Shopping
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessPage;
