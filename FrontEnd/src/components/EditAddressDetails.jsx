import React, { useState } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose, IoLocationOutline, IoHomeOutline, IoBriefcaseOutline } from "react-icons/io5";
import { FaCity, FaMapMarkedAlt, FaGlobeAmericas, FaPhone, FaMapPin } from "react-icons/fa";
import { useGlobalContext } from '../provider/GlobalProvider'
import { motion, AnimatePresence } from 'framer-motion'

const EditAddressDetails = ({close, data}) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues : {
            _id : data._id,
            userId : data.userId,
            address_line1 : data.address_line1,
            address_line2 : data.address_line2,
            city : data.city,
            state : data.state,
            country : data.country,
            zipcode : data.zipcode,
            phone : data.phone 
        }
    })
    const { fetchAddress } = useGlobalContext()
    const [activeField, setActiveField] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [addressType, setAddressType] = useState('home')

    const onSubmit = async(data) => {
        try {
            setIsSubmitting(true)
            const response = await Axios({
                ...SummaryApi.updateAddress,
                data : {
                    ...data,
                    address_line1 : data.address_line1,
                    address_line2 : data.address_line2,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    zipcode : data.zipcode,
                    phone : data.phone
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const [countryOptions] = useState(countryList().getData())
    const [selectedCountry, setSelectedCountry] = useState(
        countryOptions.find(opt => opt.label === data.country) || null
    )
    
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    }

    const modalVariants = {
        hidden: { 
            opacity: 0,
            y: 50,
            scale: 0.95
        },
        visible: { 
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 400
            }
        },
        exit: {
            opacity: 0,
            y: 50,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    }

    const formItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({ 
            opacity: 1, 
            x: 0,
            transition: {
                delay: i * 0.05,
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        })
    }

    return (
        <AnimatePresence>
            <motion.section 
                className='fixed top-0 left-0 right-0 bottom-0 z-50 bg-neutral-800 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto'
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                }}
            >
                <motion.div 
                    className='bg-white dark:bg-gray-800 w-full max-w-lg mx-auto rounded-lg shadow-2xl overflow-hidden'
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className='bg-gradient-to-r from-primary-200 to-blue-500 p-4 text-black dark:text-white flex justify-between items-center'>
                        <motion.h2 
                            className='font-semibold text-xl flex items-center gap-2'
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <IoLocationOutline className="text-2xl" /> Edit Address
                        </motion.h2>
                        <motion.button 
                            onClick={close} 
                            className='p-1.5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 text-black dark:text-white transition-all duration-300'
                            whileHover={{ rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoClose size={20}/>
                        </motion.button>
                    </div>

                    <div className='p-6'>
                        {/* Address type selector */}
                        <motion.div 
                            className='flex space-x-4 mb-6'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.div 
                                className={`cursor-pointer flex-1 p-3 text-center rounded-lg border-2 flex items-center justify-center gap-2 ${addressType === 'home' ? 'bg-primary-100 dark:bg-primary-900 text-white border-primary-200' : 'border-gray-200 dark:border-gray-600 hover:border-primary-100 dark:hover:border-primary-800 dark:text-gray-200'}`}
                                onClick={() => setAddressType('home')}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <IoHomeOutline size={18} />
                                <span className="font-medium">Home</span>
                            </motion.div>
                            <motion.div 
                                className={`cursor-pointer flex-1 p-3 text-center rounded-lg border-2 flex items-center justify-center gap-2 ${addressType === 'work' ? 'bg-primary-100 dark:bg-primary-900 text-white border-primary-200' : 'border-gray-200 dark:border-gray-600 hover:border-primary-100 dark:hover:border-primary-800 dark:text-gray-200'}`}
                                onClick={() => setAddressType('work')}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <IoBriefcaseOutline size={18} />
                                <span className="font-medium">Work</span>
                            </motion.div>
                        </motion.div>

                        <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                            <motion.div 
                                className={`grid gap-2 ${activeField === 'address_line1' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                custom={0}
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <label htmlFor='addressline1' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                    <FaMapMarkedAlt className="text-primary-200" /> Address Line 1
                                </label>
                                <input
                                    type='text'
                                    id='addressline1' 
                                    className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg focus:outline-none focus:border-primary-200 transition-all duration-300'
                                    {...register("address_line1", {required: true})}
                                    onFocus={() => setActiveField('address_line1')}
                                    onBlur={() => setActiveField(null)}
                                />
                            </motion.div>
                            
                            <motion.div 
                                className={`grid gap-2 ${activeField === 'address_line2' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                custom={1}
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <label htmlFor='addressline2' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                    <FaMapMarkedAlt className="text-primary-200" /> Address Line 2
                                </label>
                                <input
                                    type='text'
                                    id='addressline2' 
                                    className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg focus:outline-none focus:border-primary-200 transition-all duration-300'
                                    {...register("address_line2", {required: true})}
                                    onFocus={() => setActiveField('address_line2')}
                                    onBlur={() => setActiveField(null)}
                                />
                            </motion.div>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <motion.div 
                                    className={`grid gap-2 ${activeField === 'city' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                    custom={2}
                                    variants={formItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label htmlFor='city' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                        <FaCity className="text-primary-200" /> City
                                    </label>
                                    <input
                                        type='text'
                                        id='city' 
                                        className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg focus:outline-none focus:border-primary-200 transition-all duration-300'
                                        {...register("city", {required: true})}
                                        onFocus={() => setActiveField('city')}
                                        onBlur={() => setActiveField(null)}
                                    />
                                </motion.div>
                                
                                <motion.div 
                                    className={`grid gap-2 ${activeField === 'state' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                    custom={3}
                                    variants={formItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label htmlFor='state' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                        <FaMapPin className="text-primary-200" /> State
                                    </label>
                                    <input
                                        type='text'
                                        id='state' 
                                        className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg focus:outline-none focus:border-primary-200 transition-all duration-300'
                                        {...register("state", {required: true})}
                                        onFocus={() => setActiveField('state')}
                                        onBlur={() => setActiveField(null)}
                                    />
                                </motion.div>
                            </div>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <motion.div 
                                    className={`grid gap-2 ${activeField === 'zipcode' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                    custom={4}
                                    variants={formItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label htmlFor='zipcode' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                        <FaMapPin className="text-primary-200" /> Zipcode
                                    </label>
                                    <input
                                        type='text'
                                        id='zipcode' 
                                        className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg focus:outline-none focus:border-primary-200 transition-all duration-300'
                                        {...register("zipcode", {required: true})}
                                        onFocus={() => setActiveField('zipcode')}
                                        onBlur={() => setActiveField(null)}
                                    />
                                </motion.div>
                                
                                <motion.div 
                                    className={`grid gap-2 ${activeField === 'country' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                    custom={5}
                                    variants={formItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label htmlFor='country' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                        <FaGlobeAmericas className="text-primary-200" /> Country
                                    </label>
                                    <div className="dark:text-black">
                                        <Select
                                            id="country"
                                            options={countryOptions}
                                            value={selectedCountry}
                                            onChange={option => {
                                                setSelectedCountry(option)
                                                document.getElementById('country-hidden').value = option.label
                                            }}
                                            onFocus={() => setActiveField('country')}
                                            onBlur={() => setActiveField(null)}
                                            classNamePrefix="react-select"
                                            placeholder="Select a country"
                                            isSearchable
                                        />
                                    </div>
                                    <input
                                        type='hidden'
                                        id='country-hidden' 
                                        {...register("country", { required: true })}
                                        value={selectedCountry ? selectedCountry.label : ''}
                                        readOnly
                                    />
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                className={`grid gap-2 ${activeField === 'phone' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                                custom={6}
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <label htmlFor='phone' className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2'>
                                    <FaPhone className="text-primary-200" /> Phone No.
                                </label>
                                <input
                                    type='text'
                                    id='phone' 
                                    className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white p-2.5 rounded-lg focus:outline-none focus:border-primary-200 transition-all duration-300'
                                    {...register("phone", {required: true})}
                                    onFocus={() => setActiveField('phone')}
                                    onBlur={() => setActiveField(null)}
                                />
                            </motion.div>

                            <motion.button 
                                type='submit' 
                                className='bg-primary-200 w-full py-3 font-semibold text-black rounded-lg shadow-md hover:bg-primary-100 transition-all duration-300 mt-6 flex items-center justify-center gap-2'
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                custom={7}
                                variants={formItemVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving Address...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Update Address
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </motion.section>
        </AnimatePresence>
    )
}

export default EditAddressDetails