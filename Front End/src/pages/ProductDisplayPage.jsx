import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaRegHeart, FaHeart, FaShippingFast } from "react-icons/fa";
import { FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../components/Loading';

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product ? params?.product?.split("-")?.slice(-1)[0] : null
  const [data, setData] = useState({
    name: "",
    image: [],
    description: "",
    unit: "",
    price: 0,
    discount: 0,
    stock: 0,
    more_details: {}
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hoverImage, setHoverImage] = useState(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const imageContainer = useRef()
  const mainImageRef = useRef()

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  
  const zoomIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  }
  
  const slideRight = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }
  
  const slideLeft = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mainImageRef.current) {
        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setCursorPosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const fetchProductDetails = async () => {
    if (!productId) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
        setImage(0)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [productId])

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100
    }
  }
  
  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!productId || !data.name) {
    return (
      <motion.div 
        className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FaCircleInfo size={48} className="text-blue-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-center max-w-md">Sorry, we couldn't find the product you're looking for.</p>
      </motion.div>
    )
  }

  return (
    <motion.section 
      className='container mx-auto p-4 grid lg:grid-cols-2 gap-8 min-h-[70vh]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className='space-y-6'
        variants={slideRight}
        initial="hidden"
        animate="visible"
      >
        {/* Main product image with magnifier effect */}
        <motion.div 
          className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded-xl min-h-56 max-h-56 h-full w-full relative overflow-hidden shadow-md border border-gray-100'
          ref={mainImageRef}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {data.image[image] && (
            <>
              <motion.img
                src={data.image[image]}
                alt={data.name}
                className='w-full h-full object-scale-down transition-all duration-300'
                style={{ 
                  transform: showMagnifier ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              {showMagnifier && (
                <motion.div 
                  className="absolute hidden lg:block w-36 h-36 rounded-full border-2 border-white shadow-lg pointer-events-none z-10"
                  style={{
                    left: `${cursorPosition.x}%`,
                    top: `${cursorPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${data.image[image]})`,
                    backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '500%',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              {/* Favorite button */}
              <motion.button 
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md"
                onClick={() => setIsFavorite(!isFavorite)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 hover:text-red-500 text-xl" />
                )}
              </motion.button>
            </>
          )}
        </motion.div>
        
        {/* Image pagination dots */}
        <div className='flex items-center justify-center gap-3 my-4'>
          {data.image.map((img, index) => (
            <motion.button
              key={img + index + "point"} 
              className={`rounded-full transition-all duration-300`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setImage(index)}
            >
              <span className={`block w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
                index === image 
                  ? "bg-blue-500 shadow-md shadow-blue-200" 
                  : "bg-gray-200"
              }`}></span>
            </motion.button>
          ))}
        </div>
        
        {/* Image gallery */}
        <div className='grid relative'>
          <div 
            ref={imageContainer} 
            className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none pb-2'
          >
            {data.image.map((img, index) => (
              <motion.div 
                className={`w-20 h-20 min-h-20 min-w-20 cursor-pointer rounded-lg overflow-hidden ${
                  index === image 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'border border-gray-200'
                }`} 
                key={img + index}
                onMouseEnter={() => setHoverImage(index)}
                onMouseLeave={() => setHoverImage(null)}
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setImage(index)}
              >
                <div className="w-full h-full relative bg-white">
                  <img
                    src={img}
                    alt={`${data.name} thumbnail ${index + 1}`}
                    className='w-full h-full object-scale-down transition-all duration-300' 
                  />
                  <AnimatePresence>
                    {hoverImage === index && index !== image && (
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <FaCircleCheck className="text-blue-500 text-sm" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Gallery navigation buttons */}
          {data.image.length > 4 && (
            <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
              <motion.button 
                onClick={handleScrollLeft} 
                className='z-10 bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-100'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaAngleLeft/>
              </motion.button>
              <motion.button 
                onClick={handleScrollRight} 
                className='z-10 bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-100'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaAngleRight/>
              </motion.button>
            </div>
          )}
        </div>

        {/* Desktop version product details */}
        <motion.div 
          className='my-4 hidden lg:grid gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100'
          variants={fadeIn}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Product Details</h3>
          
          <div>
            <p className='font-medium text-gray-600'>Description</p>
            <p className='text-base text-gray-700'>{data.description}</p>
          </div>
          
          <div>
            <p className='font-medium text-gray-600'>Unit</p>
            <p className='text-base text-gray-700'>{data.unit}</p>
          </div>
          
          {data?.more_details && Object.keys(data?.more_details).map((element, index) => (
            <div key={element + index}>
              <p className='font-medium text-gray-600 capitalize'>{element}</p>
              <p className='text-base text-gray-700'>{data?.more_details[element]}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Product information section */}
      <motion.div 
        className='p-4 lg:pl-7 text-base lg:text-lg'
        variants={slideLeft}
        initial="hidden"
        animate="visible"
      >
        {/* Quick delivery badge */}
        <motion.div 
          className='flex items-center gap-2 mb-3'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
            <FaShippingFast />
            <span>Same Day Delivery</span>
          </span>
        </motion.div>
        
        {/* Product name and unit */}
        <motion.h2 
          className='text-xl font-semibold lg:text-3xl text-gray-800'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >{data.name}</motion.h2>
        
        <motion.p 
          className='text-gray-500 mb-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >{data.unit}</motion.p>
        
        <Divider />
        
        {/* Price section */}
        <motion.div 
          className="my-4"
          variants={zoomIn}
          initial="hidden"
          animate="visible"
        >
          <p className='text-gray-600 mb-2'>Price</p> 
          <div className='flex items-center gap-2 lg:gap-4'>
            <motion.div 
              className='border-2 border-green-100 px-4 py-2 rounded-lg bg-green-50 w-fit'
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <p className='font-semibold text-lg lg:text-xl text-green-700'>
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </p>
            </motion.div>
            
            {data.discount > 0 && (
              <motion.p 
                className='line-through text-gray-400'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >{DisplayPriceInRupees(data.price)}</motion.p>
            )}
            
            {data.discount > 0 && (
              <motion.div 
                className="bg-red-50 px-3 py-1 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="font-bold text-red-600 lg:text-xl">
                  {data.discount}% <span className='text-sm text-red-500'>OFF</span>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
              
        {/* Stock status and add to cart feature */}
        <motion.div 
          className='my-6'
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          {data.stock === 0 ? (
            <div className='bg-red-50 border border-red-100 rounded-lg p-4 text-center'>
              <p className='text-lg text-red-600 font-medium'>Out of Stock</p>
              <p className='text-sm text-red-500 mt-1'>This item is currently unavailable</p>
            </div>
          ) : data.stock < 5 ? (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <p className='text-amber-600 text-sm font-medium'>Only {data.stock} left in stock - order soon</p>
              </div>
              <div>
                <AddToCartButton data={data}/>
              </div>
            </>
          ) : (
            <div>
              <p className='text-green-600 text-sm font-medium mb-2'>In Stock</p>
              <AddToCartButton data={data}/>
            </div>
          )}
        </motion.div>
        
        {/* Why shop section */}
        <motion.div 
          className="mt-12"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <h2 className='font-semibold text-lg text-gray-700 mb-4'>Why shop from Fine Treats? </h2>
          <motion.div 
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className='flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-blue-50'
              variants={fadeIn}
              whileHover={{ x: 5 }}
            >
              <div>
                <div className='font-semibold text-gray-800'>Delivery at the Earliest Time</div>
                <p className='text-sm text-gray-600'>Get your order delivered to your doorstep in within 24 hours of our stores. Or within 48 hours if you are in a remote area.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className='flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-green-50'
              variants={fadeIn}
              whileHover={{ x: 5 }}
            >
              <div>
                <div className='font-semibold text-gray-800'>Find the Best Prices & Offers you need</div>
                <p className='text-sm text-gray-600'>Find the best price for your needs including the offers from the Manufacturers.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className='flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-purple-50'
              variants={fadeIn}
              whileHover={{ x: 5 }}
            >
              <div>
                <div className='font-semibold text-gray-800'>Huge Selection of your Favourite Products</div>
                <p className='text-sm text-gray-600'>Choose from more 4000 products across Foods, Beverages, Sweets, Personal Care and other categories you love.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile product details */}
        <motion.div 
          className='my-8 grid gap-3 lg:hidden bg-white p-4 rounded-lg shadow-sm border border-gray-100'
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
          
          <div>
            <p className='font-medium text-gray-600'>Description</p>
            <p className='text-base text-gray-700'>{data.description}</p>
          </div>
          
          <div>
            <p className='font-medium text-gray-600'>Unit</p>
            <p className='text-base text-gray-700'>{data.unit}</p>
          </div>
          
          {data?.more_details && Object.keys(data?.more_details).map((element, index) => (
            <div key={element + index + "-mobile"}>
              <p className='font-medium text-gray-600 capitalize'>{element}</p>
              <p className='text-base text-gray-700'>{data?.more_details[element] || "-"}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default ProductDisplayPage