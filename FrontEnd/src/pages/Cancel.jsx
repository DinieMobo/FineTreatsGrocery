import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaTimesCircle, FaHome } from 'react-icons/fa'

const Cancel = () => {
  return (
    <motion.div 
      className='min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-2xl border dark:border-gray-700 flex flex-col justify-center items-center gap-5 transition-colors duration-300'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center transition-colors duration-300"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
        >
          <FaTimesCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <motion.h1 
          className='text-2xl font-bold text-red-800 dark:text-red-400 text-center transition-colors duration-300'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Order Cancelled
        </motion.h1>
        
        <motion.p 
          className='text-gray-600 dark:text-gray-300 text-center transition-colors duration-300'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your order has been cancelled. No charges have been made.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all duration-300 px-6 py-2 rounded-lg font-medium"
          >
            <FaHome />
            Go To Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Cancel