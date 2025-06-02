import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion';

const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [hoveredItem, setHoveredItem] = useState(null)
    const [isCheckoutHovered, setIsCheckoutHovered] = useState(false)
    const [isPaymentLoading, setIsPaymentLoading] = useState(false)

    const redirectToCheckoutPage = () => {
        if(user?._id){
            setIsPaymentLoading(true)
            // Simulate loading for better UX
            setTimeout(() => {
                navigate("/checkout")
                if(close) close()
            }, 600)
            return
        }
        toast.error("Please login to checkout", {
            icon: '🔒',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        })
    }
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }
    
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    }
    
    const sideCartVariants = {
        hidden: { x: '100%' },
        visible: { 
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: { 
            x: '100%',
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }
    
    return (
        <motion.section 
            className='fixed top-0 bottom-0 right-0 left-0 z-50'
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
            }}
        >
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-70 backdrop-blur-sm"></div>
            
            <motion.div 
                className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto shadow-2xl relative'
                variants={sideCartVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div 
                    className='flex items-center p-4 border-b gap-3 justify-between bg-gradient-to-r from-blue-50 to-white'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.h2 
                        className='font-semibold text-gray-800 flex items-center gap-2'
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaShoppingBag className="text-primary-200" />
                        Your Cart
                    </motion.h2>
                    <motion.button 
                        onClick={close}
                        className='p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-all duration-300'
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <IoClose size={20}/>
                    </motion.button>
                </motion.div>

                <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4 overflow-auto'>
                    {cartItem[0] ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className='flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md'
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                            >
                                <p className="font-medium">Your total savings</p>
                                <motion.p 
                                    className="text-xl font-bold"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                                </motion.p>
                            </motion.div>
                            
                            <motion.div 
                                className='bg-white rounded-lg p-4 grid gap-5 overflow-auto mt-3 shadow-md'
                                variants={itemVariants}
                            >
                                {cartItem.map((item, index) => (
                                    <motion.div 
                                        key={item?._id+"cartItemDisplay"} 
                                        className={`flex w-full gap-4 p-2 rounded-lg transition-all duration-200 ${hoveredItem === item?._id ? 'bg-blue-50 shadow-sm' : 'bg-white'}`}
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onMouseEnter={() => setHoveredItem(item?._id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        whileHover={{ y: -2 }}
                                    >
                                        <motion.div 
                                            className='w-16 h-16 min-h-16 min-w-16 bg-white border rounded-lg overflow-hidden shadow-sm'
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <img
                                                src={item?.productId?.image[0]}
                                                className='w-full h-full object-scale-down p-1'
                                                alt={item?.productId?.name}
                                            />
                                        </motion.div>
                                        
                                        <div className='w-full max-w-sm'>
                                            <p className='text-sm font-medium text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                            <p className='text-xs text-gray-500'>{item?.productId?.unit}</p>
                                            <div className="flex items-baseline mt-1">
                                                <p className='font-bold text-blue-700'>
                                                    {DisplayPriceInRupees(pricewithDiscount(item?.productId?.price,item?.productId?.discount))}
                                                </p>
                                                {item?.productId?.discount > 0 && (
                                                    <p className='ml-2 text-xs line-through text-gray-400'>
                                                        {DisplayPriceInRupees(item?.productId?.price)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <AddToCartButton data={item?.productId}/>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                            
                            <motion.div 
                                className='bg-white p-4 mt-3 rounded-lg shadow-md'
                                variants={itemVariants}
                            >
                                <motion.h3 
                                    className='font-semibold text-gray-800 border-b pb-2 mb-3'
                                    whileHover={{ scale: 1.01, x: 2 }}
                                >
                                    Bill Details
                                </motion.h3>
                                
                                <motion.div className='space-y-3 mb-4'>
                                    <div className='flex justify-between text-sm'>
                                        <p className="text-gray-600">Items total</p>
                                        <div className='flex items-center gap-2'>
                                            <span className='line-through text-gray-400 text-xs'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                                            <span className="font-medium">{DisplayPriceInRupees(totalPrice)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className='flex justify-between text-sm'>
                                        <p className="text-gray-600">Quantity total</p>
                                        <p className="font-medium">{totalQty} item{totalQty !== 1 ? 's' : ''}</p>
                                    </div>
                                    
                                    <div className='flex justify-between text-sm'>
                                        <p className="text-gray-600">Delivery Charge</p>
                                        <p className="text-green-500 font-medium">Rs.0.00</p>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    className='font-bold flex items-center justify-between gap-4 pt-3 border-t text-gray-800'
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <p>Grand Total</p>
                                    <p className="text-lg text-primary-200">{DisplayPriceInRupees(totalPrice)}</p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className='bg-white flex flex-col justify-center items-center p-6 rounded-lg shadow-md text-center h-full'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.img
                                src={imageEmpty}
                                className='w-64 h-64 object-contain mb-6' 
                                alt="Empty cart"
                                initial={{ y: 10 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            />
                            <motion.p className="text-gray-500 mb-6">Your cart is empty. Let's add some items!</motion.p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link 
                                    onClick={close} 
                                    to={"/"} 
                                    className='block bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2'
                                >
                                    Start Shopping 
                                    <FaArrowRight />
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {cartItem[0] && (
                    <motion.div 
                        className='p-3 bg-white border-t shadow-inner'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            className={`w-full py-3 px-4 rounded-lg font-bold text-base flex items-center justify-between transition-all duration-300 ${
                                isPaymentLoading ? 'bg-gray-300 cursor-not-allowed' : 
                                isCheckoutHovered ? 'bg-green-600 shadow-lg' : 'bg-green-500 shadow'
                            } text-white`}
                            onClick={redirectToCheckoutPage}
                            onMouseEnter={() => setIsCheckoutHovered(true)}
                            onMouseLeave={() => setIsCheckoutHovered(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isPaymentLoading}
                        >
                            <span className="text-lg">{DisplayPriceInRupees(totalPrice)}</span>
                            <span className="flex items-center gap-2">
                                {isPaymentLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout 
                                        <motion.div
                                            animate={{ 
                                                x: isCheckoutHovered ? [0, 5, 0] : 0,
                                            }}
                                            transition={{ repeat: isCheckoutHovered ? Infinity : 0, duration: 1 }}
                                        >
                                            <FaCaretRight size={16} />
                                        </motion.div>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </motion.section>
    )
}

export default DisplayCartItem