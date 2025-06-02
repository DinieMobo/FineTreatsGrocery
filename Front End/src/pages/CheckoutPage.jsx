import { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from '../utils/toastUtils'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { FaMapMarkerAlt, FaPlusCircle, FaShoppingBag, FaMoneyBillWave, FaCreditCard, 
         FaCheck, FaBox, FaShippingFast, FaLock, FaRegCreditCard, FaAngleRight } from 'react-icons/fa'
import { MdLocalShipping, MdPayment, MdSecurity } from 'react-icons/md'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [hoverAddress, setHoverAddress] = useState(null)
  const [hoverOnline, setHoverOnline] = useState(false)
  const [hoverCOD, setHoverCOD] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [activeElement, setActiveElement] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Mouse follower
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Simulated checkout progress for visual feedback
  useEffect(() => {
    if (isPaymentProcessing) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 200)
      
      return () => clearInterval(interval)
    } else {
      setLoadingProgress(0)
    }
  }, [isPaymentProcessing])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }
  
  const buttonHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  const handleCashOnDelivery = async() => {
    if (!addressList[selectAddress]?._id) {
      toast.error("Please select a delivery address", {
        icon: '📍',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      return
    }
    
    try {
      setIsPaymentProcessing(true)
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data : {
          list_items : cartItemsList,
          addressId : addressList[selectAddress]?._id,
          subTotalAmt : totalPrice,
          totalAmt : totalPrice,
        }
      })

      const { data : responseData } = response

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate('/success',{
          state : {
            text : "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  const handleOnlinePayment = async() => {
    if (!addressList[selectAddress]?._id) {
      toast.error("Please select a delivery address", {
        icon: '📍',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
      return
    }
      try {
      setIsPaymentProcessing(true)
      const loadingToastId = toast.loading("Preparing payment gateway...");
      
      // Check if the browser is blocking third-party cookies
      // This is a common cause of Stripe checkout issues
      try {
        // Test third-party cookie support
        document.cookie = "testcookie=1; SameSite=None; Secure";
        if (!document.cookie.includes("testcookie")) {
          toast.dismiss(loadingToastId);
          toast.warning("Your browser may be blocking third-party cookies. Please ensure cookies are enabled for payment processing.");
        }
      } catch (cookieError) {
        console.log("Cookie test failed:", cookieError);
      }
      
      // Load Stripe
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      if (!stripePublicKey) {
        toast.dismiss(loadingToastId);
        toast.error("Payment configuration error. Please contact support.");
        setIsPaymentProcessing(false);
        return;
      }
      
      let stripePromise;
      try {
        stripePromise = await loadStripe(stripePublicKey);
        if (!stripePromise) {
          throw new Error("Failed to load Stripe");
        }
      } catch (stripeError) {
        console.error("Stripe loading error:", stripeError);
        toast.dismiss(loadingToastId);
        toast.error("Unable to load payment system. Please try again later.");
        setIsPaymentProcessing(false);
        return;
      }
      
      // Get checkout session from backend
      toast.dismiss(loadingToastId);
      const processingToastId = toast.loading("Processing your order...");
      
      const response = await Axios({
        ...SummaryApi.payment_url,
        data : {
          list_items : cartItemsList,
          addressId : addressList[selectAddress]?._id,
          subTotalAmt : totalPrice,
          totalAmt :  totalPrice,
        }
      });

      const { data : responseData } = response;
      
      if (!responseData || !responseData.id) {
        toast.dismiss(processingToastId);
        toast.error("Invalid response from payment server. Please try again.");
        setIsPaymentProcessing(false);
        return;
      }

      // Store payment session ID in localStorage before redirecting
      localStorage.setItem('pendingPayment', JSON.stringify({
        sessionId: responseData.id,
        timestamp: Date.now(),
        amount: totalPrice,
        itemCount: totalQty
      }));

      toast.dismiss(processingToastId);
      toast.loading("Redirecting to secure payment page...");
      
      // Redirect to Stripe checkout with error handling
      try {
        const result = await stripePromise.redirectToCheckout({ sessionId: responseData.id });
        
        if (result.error) {
          console.error("Stripe redirect error:", result.error);
          toast.error("Payment redirect failed: " + result.error.message);
          setIsPaymentProcessing(false);
        }
      } catch (redirectError) {
        console.error("Redirect error:", redirectError);
        toast.error("Failed to redirect to payment page. Please try again.");
        setIsPaymentProcessing(false);
      }
      
    } catch (error) {
      console.error("Payment process error:", error);
      toast.error(error?.response?.data?.message || "Payment process failed. Please try again.");
      setIsPaymentProcessing(false);
    }
  }

  return (
    <>
      {/* Cursor follower for interactive elements */}
      <AnimatePresence>
        {activeElement && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed w-20 h-20 rounded-full bg-primary-200 pointer-events-none z-50"
            style={{ 
              left: cursorPosition.x - 40, 
              top: cursorPosition.y - 40,
              mixBlendMode: 'multiply'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </AnimatePresence>
    
      <motion.section 
        className='bg-gradient-to-b from-blue-50 via-white to-blue-50 min-h-screen py-10'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <motion.div 
          className="container mx-auto px-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <motion.div 
                className="bg-blue-50 p-3 rounded-full shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <MdPayment size={28} className="text-primary-200" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600 text-center max-w-lg">
              You're just a few steps away from receiving your items.
            </p>
          </div>
          
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center relative mb-2 px-6">
              <motion.div 
                className="z-10 bg-primary-200 w-12 h-12 rounded-full flex items-center justify-center text-black border-4 border-white shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                <FaShoppingBag />
              </motion.div>
              
              <div className="absolute left-0 right-0 mx-12 h-1 bg-gray-200 z-0">
                <motion.div 
                  className="h-full bg-primary-200"
                  initial={{ width: "50%" }}
                  animate={{ 
                    width: isPaymentProcessing ? `${loadingProgress}%` : "50%"
                  }}
                />
              </div>
              
              <motion.div 
                className={`z-10 w-12 h-12 rounded-full flex items-center justify-center text-black border-4 border-white shadow-lg ${
                  isPaymentProcessing ? "bg-primary-200" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  scale: isPaymentProcessing ? [1, 1.1, 1] : 1, 
                  transition: { 
                    repeat: isPaymentProcessing ? Infinity : 0, 
                    duration: 1.5 
                  }
                }}
              >
                <MdLocalShipping />
              </motion.div>
            </div>
            
            <div className="flex justify-between px-3 text-sm text-gray-600">
              <span>Choose & Pay</span>
              <span>Confirm & Ship</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-8 justify-between'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className='w-full lg:w-3/5'
            variants={itemVariants}
          >
            {/***address section***/}
            <motion.div 
              className='flex items-center justify-between mb-4'
              whileHover={{ x: 2 }}
            >
              <h3 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                <FaMapMarkerAlt className="text-primary-200" />
                Delivery Address
              </h3>
              
              {addressList.length > 0 && (
                <motion.span 
                  className="text-sm text-blue-600"
                  whileHover={{ scale: 1.05 }}
                >
                  {addressList.length} {addressList.length === 1 ? 'address' : 'addresses'} saved
                </motion.span>
              )}
            </motion.div>
            
            <motion.div 
              className='bg-white p-6 grid gap-4 rounded-lg shadow-md border border-gray-100'
              variants={containerVariants}
              whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}
            >
              {addressList.length > 0 ? (
                addressList.map((address, index) => {
                  return address.status && (
                    <motion.label 
                      key={`address-${index}`}
                      htmlFor={"address" + index} 
                      className="cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      onMouseEnter={() => {
                        setHoverAddress(index)
                        setActiveElement('address')
                      }}
                      onMouseLeave={() => {
                        setHoverAddress(null)
                        setActiveElement(null)
                      }}
                    >
                      <motion.div 
                        className={`
                          border-2 rounded-lg p-5 transition-all duration-300
                          ${Number(selectAddress) === index 
                            ? 'border-primary-200 bg-gradient-to-r from-blue-50 to-white shadow-md' 
                            : hoverAddress === index 
                              ? 'border-blue-200 bg-blue-50/30' 
                              : 'border-gray-100'
                          }
                        `}
                      >
                        <div className='flex gap-4'>
                          <div className='pt-1'>
                            <input 
                              id={"address" + index} 
                              type='radio' 
                              value={index} 
                              onChange={(e) => setSelectAddress(e.target.value)} 
                              checked={Number(selectAddress) === index}
                              name='address' 
                              className="w-5 h-5 accent-primary-200 cursor-pointer"
                            />
                          </div>
                          <div className='space-y-2 flex-1'>
                            <div className="flex justify-between items-start">
                              <p className='font-semibold text-gray-800 text-lg leading-tight'>{address?.address_line1 || 'No address line'}</p>
                              
                              {Number(selectAddress) === index && (
                                <motion.div 
                                  className='flex items-center gap-1 text-primary-200 bg-blue-100 px-2 py-1 rounded-full text-sm font-medium'
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 17 }}
                                >
                                  <FaCheck size={12} /> Selected
                                </motion.div>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
                              <p>{address?.city || 'N/A'}</p>
                              <p>{address?.state || 'N/A'}</p>
                              <p>{address?.country || 'N/A'}</p>
                              <p>{address?.zipcode || 'N/A'}</p>
                            </div>
                            
                            <p className='inline-flex items-center gap-2 font-medium mt-1 px-2 py-1 bg-gray-100 rounded-full text-sm'>
                              <FaRegCreditCard className="text-primary-200" />
                              {address?.phone || 'No phone number'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.label>
                  )
                })
              ) : (
                <motion.div 
                  className="text-gray-500 text-center py-8 px-4 rounded-lg bg-blue-50/50 border border-dashed border-blue-200"
                  variants={itemVariants}
                >
                  <div className="flex justify-center mb-4">
                    <motion.div 
                      className="bg-white p-3 rounded-full shadow"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <FaMapMarkerAlt size={24} className="text-primary-200" />
                    </motion.div>
                  </div>
                  <p className="font-medium mb-1">No delivery addresses found</p>
                  <p className="text-sm mb-4">Please add a new address to continue with checkout.</p>
                </motion.div>
              )}
              
              <motion.button
                onClick={() => setOpenAddress(true)} 
                className='h-16 bg-gradient-to-r from-blue-50 to-white border-2 border-dashed border-primary-100 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-300 group'
                whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                onMouseEnter={() => setActiveElement('addAddress')}
                onMouseLeave={() => setActiveElement(null)}
              >
                <div className='flex items-center gap-2 text-primary-200 font-medium group-hover:text-blue-600 transition-colors'>
                  <motion.div
                    animate={{ rotate: [0, 180] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaPlusCircle className="text-xl" />
                  </motion.div>
                  <span className="group-hover:translate-x-1 transition-transform">Add new address</span>
                </div>
              </motion.button>
            </motion.div>
            
            {/* Security features banner */}
            <motion.div 
              className="mt-8 bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 border border-blue-100 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MdSecurity className="text-primary-200" />
                Secure Checkout Guarantee
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 mt-2">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <FaLock className="text-green-600" />
                    <span className="font-medium">Encrypted payments</span>
                  </div>
                  <p className="text-xs">All transactions are secure and encrypted. Your card information is never stored on our servers.</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <FaShippingFast className="text-green-600" />
                    <span className="font-medium">Fast delivery</span>
                  </div>
                  <p className="text-xs">We deliver your orders quickly and efficiently, so you can get what you need when you need it.</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <FaBox className="text-green-600" />
                    <span className="font-medium">Quality guaranteed</span>
                  </div>
                  <p className="text-xs">We ensure that all products are of the highest quality and meet your expectations.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className='w-full lg:w-2/5 lg:max-w-md'
            variants={itemVariants}
          >
            {/**summary**/}
            <motion.div 
              className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'
              whileHover={{ 
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                transition: { type: 'spring', stiffness: 300, damping: 20 }
              }}
            >
              <motion.div 
                className='bg-gradient-to-r from-blue-600 to-primary-200 text-black py-5 px-6'
                whileHover={{ backgroundPosition: '100% 0' }}
                transition={{ duration: 0.8 }}
                style={{ backgroundSize: '200% 100%' }}
              >
                <h3 className='text-xl font-bold flex items-center gap-2 text-black'>
                  <FaShoppingBag />
                  Order Summary
                </h3>
                <p className="text-black-100 text-sm mt-1">Complete your purchase to Enjoy the items you needed.</p>
              </motion.div>
              
              <div className='p-6'>
                <motion.div 
                  className='border-b border-gray-100 pb-5 space-y-3'
                  variants={containerVariants}
                >
                  <motion.h4 
                    className='font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2'
                    variants={itemVariants}
                  >
                    <span className="w-5 h-5 bg-blue-100 flex items-center justify-center rounded-full text-primary-200 font-bold text-xs">1</span>
                    Bill Details
                  </motion.h4>
                  
                  <motion.div 
                    className='flex justify-between text-gray-600 items-center' 
                    variants={itemVariants}
                    whileHover={{ x: 2 }}
                  >
                    <p>Items total</p>
                    <div className='flex items-center gap-2'>
                      <span className='line-through text-neutral-400 text-sm'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                      <motion.span 
                        className='font-medium text-black'
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {DisplayPriceInRupees(totalPrice)}
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className='flex justify-between text-gray-600 items-center' 
                    variants={itemVariants}
                    whileHover={{ x: 2 }}
                  >
                    <p>Quantity total</p>
                    <motion.div 
                      className='flex items-center gap-2 bg-blue-50 px-2 py-0.5 rounded-full'
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className='font-medium text-blue-700'>{totalQty} item{totalQty > 1 ? 's' : ''}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className='flex justify-between text-gray-600 items-center' 
                    variants={itemVariants}
                    whileHover={{ x: 2 }}
                  >
                    <p>Delivery Charge</p>
                    <motion.p 
                      className='flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full'
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaCheck size={10} />
                      Rs.0.00
                    </motion.p>
                  </motion.div>
                  
                  {notDiscountTotalPrice - totalPrice > 0 && (
                    <motion.div 
                      className='flex justify-between text-gray-600 bg-green-50 p-2 rounded-lg' 
                      variants={itemVariants}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <p className="text-green-700">Your savings</p>
                      <p className='text-green-700 font-medium'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  className='font-bold flex items-center justify-between gap-4 mt-5 text-lg'
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <p>Grand total</p>
                  <motion.p 
                    className='text-primary-200 bg-blue-50 px-3 py-1 rounded-lg'
                    whileHover={{ scale: 1.05 }}
                  >
                    {DisplayPriceInRupees(totalPrice)}
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  className='w-full flex flex-col gap-4 mt-6'
                  variants={containerVariants}
                >
                  <motion.h4 
                    className='font-semibold text-lg text-gray-800 mb-1 flex items-center gap-2'
                    variants={itemVariants}
                  >
                    <span className="w-5 h-5 bg-blue-100 flex items-center justify-center rounded-full text-primary-200 font-bold text-xs">2</span>
                    Select Payment Method
                  </motion.h4>
                  <motion.button 
                    className='relative overflow-hidden py-3.5 px-5 rounded-lg text-white font-semibold shadow-md flex items-center gap-3'
                    style={{ 
                      backgroundImage: `linear-gradient(90deg, #047857 0%, ${hoverOnline ? '#10B981' : '#047857'} 100%)`,
                      backgroundSize: '200% 100%',
                      backgroundPosition: hoverOnline ? '100% 0' : '0% 0'
                    }}
                    onClick={handleOnlinePayment}
                    disabled={isPaymentProcessing || cartItemsList.length === 0}
                    variants={buttonHoverVariants}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => {
                      setHoverOnline(true)
                      setActiveElement('onlinePayment')
                    }}
                    onMouseLeave={() => {
                      setHoverOnline(false)
                      setActiveElement(null)
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isPaymentProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing payment...
                      </>
                    ) : (
                      <>
                        <motion.div
                          className="bg-white/20 p-2 rounded-full"
                          animate={{
                            boxShadow: hoverOnline 
                              ? ['0 0 0 0 rgba(255,255,255,0.7)', '0 0 0 8px rgba(255,255,255,0)'] 
                              : '0 0 0 0 rgba(255,255,255,0)'
                          }}
                          transition={{ duration: 1, repeat: hoverOnline ? Infinity : 0 }}
                        >
                          <FaCreditCard size={20} />
                        </motion.div>
                        <div className="flex-1">Pay Online (via Stripe)</div>
                        <motion.div 
                          className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
                          animate={{ x: hoverOnline ? 5 : 0 }}
                        >
                          <FaAngleRight />
                        </motion.div>
                      </>
                    )}
                  </motion.button>

                  <motion.button 
                    className='relative overflow-hidden py-3.5 px-5 rounded-lg font-semibold flex items-center gap-3'
                    style={{
                      color: hoverCOD ? 'white' : '#047857',
                      background: hoverCOD 
                        ? 'linear-gradient(90deg, #047857 0%, #065f46 100%)' 
                        : 'transparent',
                      border: `2px solid #047857`,
                      boxShadow: hoverCOD ? '0 4px 15px -3px rgba(4, 120, 87, 0.3)' : 'none'
                    }}
                    onClick={handleCashOnDelivery}
                    disabled={isPaymentProcessing || cartItemsList.length === 0}
                    variants={buttonHoverVariants}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => {
                      setHoverCOD(true)
                      setActiveElement('codPayment')
                    }}
                    onMouseLeave={() => {
                      setHoverCOD(false)
                      setActiveElement(null)
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isPaymentProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing order...
                      </>
                    ) : (
                      <>
                        <motion.div
                          className={`p-2 rounded-full ${hoverCOD ? 'bg-white/20' : 'bg-green-50'}`}
                          animate={{
                            boxShadow: hoverCOD 
                              ? ['0 0 0 0 rgba(255,255,255,0.7)', '0 0 0 8px rgba(255,255,255,0)'] 
                              : '0 0 0 0 rgba(255,255,255,0)'
                          }}
                          transition={{ duration: 1, repeat: hoverCOD ? Infinity : 0 }}
                        >
                          <FaMoneyBillWave size={20} />
                        </motion.div>
                        <div className="flex-1">Cash on Delivery</div>
                        <motion.div 
                          className={`rounded-full w-6 h-6 flex items-center justify-center ${
                            hoverCOD ? 'bg-white/10' : 'bg-green-50'
                          }`}
                          animate={{ x: hoverCOD ? 5 : 0 }}
                        >
                          <FaAngleRight />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </motion.div>
                
                {cartItemsList.length === 0 && (
                  <motion.div 
                    className="mt-6 px-5 py-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01, backgroundColor: '#fef3c7' }}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="p-1 bg-yellow-100 rounded-full">
                        <FaShoppingBag className="text-yellow-600" />
                      </div>
                      <p>Your cart is empty. Please add items before checkout.</p>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <motion.div 
                className="bg-gradient-to-r from-blue-50 to-white p-4 border-t border-blue-100 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="bg-blue-100 p-1.5 rounded-full text-primary-200"
                    whileHover={{ rotate: 15 }}
                  >
                    <FaBox />
                  </motion.div>
                  <div>
                    <p className="font-medium">After the Checkout Process is complete, Your order will be processed as soon as possible</p>
                    <p className="text-xs mt-0.5 text-gray-500">Orders are usually shipped within same day from the Physical Stores, and 3-5 business days from the Online Store.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default CheckoutPage