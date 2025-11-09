import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaEdit, FaCamera, FaImage, FaCheckCircle } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import { motion, AnimatePresence } from 'framer-motion';

const EditCategory = ({close, fetchData, data: CategoryData}) => {
    const [data, setData] = useState({
        _id: CategoryData._id,
        name: CategoryData.name,
        image: CategoryData.image
    })
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [imageHover, setImageHover] = useState(false)
    const [activeField, setActiveField] = useState(null)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    
    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: data
            })
            const { data: responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }
    
    const handleUploadCategoryImage = async(e) => {
        const file = e.target.files[0]

        if(!file) {
            return
        }
        setLoading(true)
        try {
            const response = await uploadImage(file)
            const { data: ImageResponse } = response
            
            setData((preve) => {
                return {
                    ...preve,
                    image: ImageResponse.data.url
                }
            })
            toast.success("Image uploaded successfully!")
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        setIsDragging(false)
        
        const file = e.dataTransfer.files[0]
        if (!file) return
        
        setLoading(true)
        try {
            const response = await uploadImage(file)
            const { data: ImageResponse } = response
            
            setData((preve) => {
                return {
                    ...preve,
                    image: ImageResponse.data.url
                }
            })
            toast.success("Image uploaded successfully!")
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.section 
                className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 dark:bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 transition-colors duration-300'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                }}
            >
                <motion.div 
                    className='bg-white dark:bg-gray-800 max-w-xl w-full p-6 rounded-lg shadow-2xl border dark:border-gray-700 transition-colors duration-300'
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                >
                    <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3 mb-4 transition-colors duration-300'>
                        <motion.h1 
                            className='text-xl font-semibold text-primary-200 dark:text-primary-300 flex items-center gap-2 transition-colors duration-300'
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <FaEdit /> Update Category
                        </motion.h1>
                        <motion.button 
                            onClick={close} 
                            className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 transition-all duration-300'
                            whileHover={{ rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoClose size={22}/>
                        </motion.button>
                    </div>

                    <motion.form 
                        className='my-4 grid gap-5' 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div 
                            className={`grid gap-2 ${activeField === 'name' ? 'bg-blue-50 dark:bg-gray-700 p-3 rounded-lg' : ''} transition-all duration-300`}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label 
                                htmlFor='categoryName' 
                                className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2 transition-colors duration-300'
                            >
                                Category Name
                            </label>
                            <input
                                type='text'
                                id='categoryName'
                                placeholder='Enter category name'
                                value={data.name}
                                name='name'
                                onChange={handleOnChange}
                                className='bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 focus:border-primary-200 dark:focus:border-primary-300 outline-none rounded-lg transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                                onFocus={() => setActiveField('name')}
                                onBlur={() => setActiveField(null)}
                            />
                        </motion.div>

                        <motion.div 
                            className='grid gap-2'
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className='text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2 transition-colors duration-300'>
                                <FaImage className="text-primary-200 dark:text-primary-300" /> Category Image
                            </p>
                            <div className='flex gap-6 flex-col lg:flex-row items-center'>
                                <motion.div 
                                    className={`
                                        border-2 rounded-lg overflow-hidden cursor-pointer
                                        ${isDragging ? 'border-primary-200 bg-blue-100' : data.image ? 'border-gray-200' : 'border-dashed border-blue-300 bg-blue-50'} 
                                        h-40 w-full lg:w-40 flex items-center justify-center transition-all duration-300
                                        ${loading ? 'animate-pulse' : ''}
                                    `}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('uploadCategoryImage').click()}
                                    whileHover={{ scale: 1.02 }}
                                    onMouseEnter={() => setImageHover(true)}
                                    onMouseLeave={() => setImageHover(false)}
                                >
                                    {loading ? (
                                        <motion.div 
                                            className="flex flex-col items-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <svg className="animate-spin h-8 w-8 text-primary-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <p className="text-sm mt-2">Uploading...</p>
                                        </motion.div>
                                    ) : data.image ? (
                                        <motion.div className="relative w-full h-full">
                                            <img
                                                alt='category'
                                                src={data.image}
                                                className='w-full h-full object-contain p-2'
                                            />
                                            <AnimatePresence>
                                                {imageHover && (
                                                    <motion.div 
                                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <p className="text-white text-sm font-medium">Change image</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ) : (
                                        <div className='text-center p-2'>
                                            <FaCamera className="text-3xl text-blue-300 mb-2 mx-auto" />
                                            <p className='text-sm text-gray-500'>
                                                Drop image here<br />or click to browse
                                            </p>
                                        </div>
                                    )}
                                </motion.div>

                                <div className='flex flex-col space-y-3 w-full lg:w-auto'>
                                    <motion.label 
                                        htmlFor='uploadCategoryImage'
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <motion.div className={`
                                            ${!data.name ? "bg-gray-200 cursor-not-allowed" : "bg-blue-50 border-2 border-primary-100 text-primary-200 hover:bg-primary-100 hover:text-white cursor-pointer"}  
                                            px-5 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-sm
                                        `}>
                                            <FaCamera size={16} />
                                            {data.image ? "Change Image" : "Upload Image"}
                                        </motion.div>
                                        <input 
                                            disabled={!data.name} 
                                            onChange={handleUploadCategoryImage} 
                                            type='file' 
                                            id='uploadCategoryImage' 
                                            accept="image/*"
                                            className='hidden'
                                        />
                                    </motion.label>
                                    
                                    {data.image && (
                                        <motion.div 
                                            className="flex items-center gap-1 text-green-600 text-sm"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <FaCheckCircle size={14} className="text-green-500" />
                                            Image added successfully
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            className={`
                                ${data.name && data.image && !loading 
                                    ? "bg-primary-200 hover:bg-primary-100 text-black cursor-pointer" 
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"}
                                py-3 px-6 rounded-lg mt-4 font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                            `}
                            disabled={!data.name || !data.image || loading}
                            whileHover={data.name && data.image && !loading ? { scale: 1.02 } : {}}
                            whileTap={data.name && data.image && !loading ? { scale: 0.98 } : {}}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle size={16} />
                                    Update Category
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </motion.section>
        </AnimatePresence>
    )
}

export default EditCategory