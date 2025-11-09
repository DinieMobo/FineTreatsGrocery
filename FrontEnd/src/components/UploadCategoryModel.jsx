import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaCamera, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({close, fetchData}) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

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
                ...SummaryApi.addCategory,
                data: data
            })
            const { data: responseData } = response

            if(responseData.success) {
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
        if (!file || !data.name) return

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
                    className='bg-white dark:bg-gray-800 max-w-4xl w-full p-6 rounded-lg shadow-2xl border dark:border-gray-700 transition-colors duration-300'
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                >
                    <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-3 mb-4 transition-colors duration-300'>
                        <motion.h1 
                            className='text-xl font-bold text-primary-200 dark:text-primary-300 transition-colors duration-300'
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                        >
                            Add New Category
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
                        className='my-5 grid gap-5' 
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div 
                            className='grid gap-2'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label id='categoryName' className='text-gray-700 font-medium'>Category Name</label>
                            <motion.input
                                type='text'
                                id='categoryName'
                                placeholder='Enter category name'
                                value={data.name}
                                name='name'
                                onChange={handleOnChange}
                                className='bg-blue-50 p-3 border border-blue-100 focus:border-primary-200 outline-none rounded-lg transition-all duration-300'
                                whileFocus={{ scale: 1.01 }}
                            />
                        </motion.div>

                        <motion.div 
                            className='grid gap-2'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <p className='text-gray-700 font-medium'>Category Image</p>
                            <div className='flex gap-6 flex-col lg:flex-row items-center'>
                                <motion.div 
                                    className={`
                                        border-2 rounded-lg overflow-hidden
                                        ${isDragging ? 'border-primary-200 bg-blue-100' : 'border-dashed border-blue-200 bg-blue-50'} 
                                        h-52 w-full lg:w-52 flex flex-col items-center justify-center transition-all duration-300
                                    `}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {
                                        data.image ? (
                                            <motion.div className='w-full h-full relative group'>
                                                <img
                                                    alt='category'
                                                    src={data.image}
                                                    className='w-full h-full object-cover'
                                                />
                                                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'>
                                                    <p className='text-white text-sm font-medium'>Replace image</p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <>
                                                <FaCamera className='text-4xl text-blue-300 mb-2' />
                                                <p className='text-sm text-neutral-500 text-center px-3'>
                                                    Drag & Drop image here<br />or click to browse
                                                </p>
                                            </>
                                        )
                                    }
                                </motion.div>

                                <div className='flex flex-col space-y-3 w-full lg:w-auto'>
                                    <label htmlFor='uploadCategoryImage'>
                                        <motion.div
                                            className={`
                                                ${!data.name ? "bg-gray-300 cursor-not-allowed" : "border-primary-200 bg-white hover:bg-primary-100 cursor-pointer"} 
                                                px-5 py-3 rounded-lg border-2 font-medium flex items-center justify-center gap-2 transition-all duration-300
                                            `}
                                            whileHover={data.name ? { scale: 1.03 } : {}}
                                            whileTap={data.name ? { scale: 0.97 } : {}}
                                        >
                                            <FaCamera />
                                            {data.image ? "Change Image" : "Upload Image"}
                                        </motion.div>
                                        <input disabled={!data.name} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' accept="image/*" className='hidden'/>
                                    </label>
                                    
                                    {data.image && (
                                        <p className='text-xs text-green-600 flex items-center gap-1'>
                                            <FaCheck size={10} /> Image uploaded successfully
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={!data.name || !data.image || loading}
                            className={`
                                ${data.name && data.image && !loading ? "bg-primary-200 hover:bg-primary-100 text-white cursor-pointer" : "bg-gray-300 cursor-not-allowed"}
                                py-3 px-6 rounded-lg font-semibold mt-4 transition-all duration-300 shadow-md flex items-center justify-center gap-2
                            `}
                            whileHover={data.name && data.image && !loading ? { scale: 1.02 } : {}}
                            whileTap={data.name && data.image && !loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>Add Category</>
                            )}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </motion.section>
        </AnimatePresence>
    )
}

export default UploadCategoryModel