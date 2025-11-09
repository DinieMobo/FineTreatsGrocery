import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEdit, FaTrashAlt, FaImage, FaInfoCircle } from 'react-icons/fa'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const { data : responseData } = response

      if(responseData.success){
          toast.success(responseData.message)
          if(fetchProductData){
            fetchProductData()
          }
          setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <motion.div 
        className='w-36 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden transition-colors duration-300'
        whileHover={{ 
          y: -5,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-32 overflow-hidden">
          {/* Image container with hover overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 dark:to-black/20 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />
          
          {/* Product image with fallback */}
          {data?.image && data.image[0] && !imageError ? (
            <motion.img
              src={data.image[0]}  
              alt={data?.name}
              className='w-full h-full object-cover'
              onError={handleImageError}
              animate={{ 
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors duration-300">
              <FaImage className="text-gray-300 dark:text-gray-500 text-4xl" />
            </div>
          )}
          
          {/* Product details indicator */}
          <motion.div 
            className="absolute top-2 left-2 bg-yellow-500 dark:bg-yellow-400 rounded-full p-1 z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0 
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 17 }}
          >
            <FaInfoCircle className="text-white text-xs" />
          </motion.div>
        </div>
        
        <div className="p-3">
          <motion.p 
            className='text-ellipsis line-clamp-2 font-medium text-gray-800 dark:text-gray-200 min-h-[40px] transition-colors duration-300'
            animate={{ color: isHovered ? '#1e40af' : undefined }}
          >
            {data?.name || 'Unnamed Product'}
          </motion.p>
          
          <motion.p 
            className='text-slate-400 dark:text-slate-500 text-xs my-1 transition-colors duration-300'
            animate={{ y: isHovered ? -2 : 0 }}
          >
            {data?.unit || 'N/A'}
          </motion.p>
          
          <div className='grid grid-cols-2 gap-2 py-2'>
            <motion.button 
              onClick={() => setEditOpen(true)} 
              className='px-3 py-1.5 text-sm flex items-center justify-center gap-1 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 rounded-md transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit className="text-xs" />
              <span>Edit</span>
            </motion.button>
            
            <motion.button 
              onClick={() => setOpenDelete(true)} 
              className='px-3 py-1.5 text-sm flex items-center justify-center gap-1 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 rounded-md transition-colors duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrashAlt className="text-xs" />
              <span>Delete</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editOpen && (
          <EditProductAdmin 
          data={data} 
          close={() => setEditOpen(false)} 
          fetchProductData={fetchProductData} 
        />
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductCardAdmin