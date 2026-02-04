import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaHome } from 'react-icons/fa';
import { useGlobalContext } from '../provider/GlobalProvider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const SuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const { fetchCartItem, fetchOrder } = useGlobalContext();
  const processedRef = useRef(false);
  
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const processPaymentSuccess = async () => {
      try {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const ordersResponse = await Axios({
          ...SummaryApi.getOrderList
        });
        
        if (ordersResponse.data.success && ordersResponse.data.data.length > 0) {
          const recentOrders = ordersResponse.data.data.filter(order => {
            const orderDate = new Date(order.createdAt);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            return orderDate > fiveMinutesAgo;
          });
          
          if (recentOrders.length > 0) {
            setOrderPlaced(true);
            
            try {
              await Axios({
                ...SummaryApi.clearCart
              });
            } catch (clearError) {
              console.error("Cart clear error:", clearError);
            }
            
            if (fetchCartItem) fetchCartItem();
            if (fetchOrder) fetchOrder();
            toast.success("Your order has been placed successfully!");
          } else {
            toast("Your payment was processed. Your order will appear shortly.", {
              icon: '⚠️',
              duration: 5000
            });
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

    processPaymentSuccess();
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 max-w-lg w-full rounded-lg shadow-lg dark:shadow-2xl border dark:border-gray-700 p-8 text-center transition-colors duration-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="w-20 h-20 bg-green-100 dark:bg-green-900 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors duration-300"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.4
          }}
        >
          <FaCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isLoading ? "Processing Your Order..." : "Payment Successful!"}
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300"
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
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <FaBox />
            View Orders
          </motion.button>
          
          <motion.button 
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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