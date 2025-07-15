import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion'

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  const fetchProductData = async() => {
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProductData()
  }, [page])

  const handleNext = () => {
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  
  const handlePrevious = () => {
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return () => {
      clearTimeout(interval)
    }
  }, [search])

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: 0.2
      } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  
  return (
    <motion.section 
      className='min-h-screen bg-gray-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with search */}
      <motion.div 
        className='p-4 bg-white shadow-lg rounded-lg mb-5 sticky top-0 z-10'
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <motion.h2 
            className='font-semibold text-xl text-primary-200'
            whileHover={{ scale: 1.02 }}
          >
            Products Management
          </motion.h2>
          
          <div className='flex items-center gap-4 w-full md:w-auto'>
            <motion.div 
              className={`
                h-full min-w-56 max-w-96 w-full bg-gray-50 px-4 flex items-center gap-3 py-2 rounded-full 
                border transition-all duration-300 
                ${isSearchFocused ? 'border-primary-200 shadow-md' : 'border-gray-200'}
              `}
              animate={{ 
                width: isSearchFocused ? '100%' : '100%',
                boxShadow: isSearchFocused ? '0 4px 6px rgba(0, 0, 0, 0.1)' : '0 0 0 rgba(0, 0, 0, 0)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                animate={{ 
                  rotate: isSearchFocused ? 360 : 0,
                  scale: isSearchFocused ? 1.1 : 1,
                  color: isSearchFocused ? '#3B82F6' : '#94A3B8'
                }}
                transition={{ duration: 0.3 }}
              >
                <IoSearchOutline size={22} />
              </motion.div>
              <input
                type='text'
                placeholder='Search products...' 
                className='h-full w-full outline-none bg-transparent'
                value={search}
                onChange={handleOnChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>

      <div className='p-6 bg-white rounded-lg shadow-md m-4'>
        {/* Products */}
        <div className='min-h-[55vh]'>
          <motion.div 
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {productData.map((p, index) => (
              <motion.div
                key={p._id + index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                className="transform transition-all duration-300"
              >
                <ProductCardAdmin data={p} fetchProductData={fetchProductData} />
              </motion.div>
            ))}
          </motion.div>
          
          {!loading && productData.length === 0 && (
            <motion.div 
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/512/6028/6028541.png" 
                alt="No products" 
                className="w-24 h-24 opacity-30 mb-4" 
              />
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or add a new product</p>
            </motion.div>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && productData.length > 0 && (
          <motion.div 
            className='flex justify-between items-center mt-8 px-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              onClick={handlePrevious} 
              className={`relative overflow-hidden px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                page > 1 ? "border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={page <= 1}
              whileHover={page > 1 ? { scale: 1.05 } : {}}
              whileTap={page > 1 ? { scale: 0.95 } : {}}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
            >
              <AnimatePresence>
                {hoverPrev && page > 1 && (
                  <motion.div 
                    className="absolute inset-0 bg-primary-200 -z-10"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <FaChevronLeft size={14} />
              <span>Previous</span>
            </motion.button>
            
            <motion.div 
              className='flex items-center gap-2'
              whileHover={{ scale: 1.05 }}
            >
              <div className='bg-primary-100 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold'>
                {page}
              </div>
              <span className='text-gray-500'>of</span>
              <div className='bg-gray-100 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold'>
                {totalPageCount}
              </div>
            </motion.div>
            
            <motion.button 
              onClick={handleNext} 
              className={`relative overflow-hidden px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                page !== totalPageCount ? "border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={page === totalPageCount}
              whileHover={page !== totalPageCount ? { scale: 1.05 } : {}}
              whileTap={page !== totalPageCount ? { scale: 0.95 } : {}}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
            >
              <AnimatePresence>
                {hoverNext && page !== totalPageCount && (
                  <motion.div 
                    className="absolute inset-0 bg-primary-200 -z-10"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <span>Next</span>
              <FaChevronRight size={14} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default ProductAdmin