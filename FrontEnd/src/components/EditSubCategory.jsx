import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaEdit, FaCamera, FaTags, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditSubCategory = ({close, data, fetchData}) => {
    const [subCategoryData, setSubCategoryData] = useState({
        _id : data._id,
        name : data.name,
        image : data.image,
        category : data.category || []
    })
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [imageHover, setImageHover] = useState(false)
    const [activeField, setActiveField] = useState(null)
    const allCategory = useSelector(state => state.product.allCategory)

    const handleChange = (e) => {
        const { name, value } = e.target 

        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name] : value
            }
        })
    }

    const handleUploadSubCategoryImage = async(e) => {
        const file = e.target.files[0]

        if(!file) {
            return
        }

        setLoading(true)
        try {
            const response = await uploadImage(file)
            const { data : ImageResponse } = response

            setSubCategoryData((preve) => {
                return {
                    ...preve,
                    image : ImageResponse.data.url
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

            setSubCategoryData((preve) => {
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

    const handleRemoveCategorySelected = (categoryId) => {
        const index = subCategoryData.category.findIndex(el => el._id === categoryId)
        const updatedCategories = [...subCategoryData.category]
        updatedCategories.splice(index, 1)
        
        setSubCategoryData((preve) => {
            return {
                ...preve,
                category: updatedCategories
            }
        })
    }

    const handleSubmitSubCategory = async(e) => {
        e.preventDefault()

        if (!subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0) {
            toast.error("Please fill all required fields")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateSubCategory,
                data : subCategoryData
            })

            const { data : responseData } = response

            if(responseData.success) {
                toast.success(responseData.message)
                if(close) {
                    close()
                }
                if(fetchData) {
                    fetchData()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    // Animation variants
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

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        }
    }

    return (
        <motion.section 
            className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
                if (e.target === e.currentTarget) close();
            }}
        >
            <motion.div 
                className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-2xl'
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className='flex items-center justify-between gap-3 border-b pb-4 mb-5'>
                    <motion.h1 
                        className='text-xl font-semibold text-primary-200 flex items-center gap-2'
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <FaEdit /> Edit Sub-Category
                    </motion.h1>
                    <motion.button 
                        onClick={close}
                        className='w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-100 text-red-500 transition-all duration-300'
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <IoClose size={22}/>
                    </motion.button>
                </div>
                <motion.form 
                    className='grid gap-5' 
                    onSubmit={handleSubmitSubCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div 
                        className={`grid gap-2 ${activeField === 'name' ? 'bg-blue-50 p-3 rounded-lg' : ''} transition-all duration-300`}
                        variants={itemVariants}
                    >
                        <label 
                            htmlFor='name' 
                            className='text-gray-700 font-medium flex items-center gap-2'
                        >
                            <FaTag className="text-primary-200" /> Sub-Category Name
                        </label>
                        <motion.input 
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className='p-3 bg-white border border-gray-300 outline-none focus:border-primary-200 rounded-lg transition-all duration-300'
                            placeholder="Enter subcategory name"
                            onFocus={() => setActiveField('name')}
                            onBlur={() => setActiveField(null)}
                            whileFocus={{ scale: 1.01 }}
                        />
                    </motion.div>

                    <motion.div 
                        className='grid gap-2'
                        variants={itemVariants}
                    >
                        <p className='text-gray-700 font-medium flex items-center gap-2'>
                            <FaCamera className="text-primary-200" /> Sub-Category Image
                        </p>
                        <div className='flex flex-col lg:flex-row items-center gap-4'>
                            <motion.div 
                                className={`
                                    border-2 rounded-lg overflow-hidden
                                    ${isDragging ? 'border-primary-200 bg-blue-100' : 'border-gray-200'} 
                                    h-40 w-full lg:w-40 flex items-center justify-center cursor-pointer transition-all duration-300
                                    ${loading ? 'animate-pulse' : ''}
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('uploadSubCategoryImage').click()}
                                whileHover={{ scale: 1.02 }}
                                onMouseEnter={() => setImageHover(true)}
                                onMouseLeave={() => setImageHover(false)}
                            >
                                {loading ? (
                                    <motion.div 
                                        className="flex flex-col items-center text-primary-200"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-sm mt-2">Uploading...</p>
                                    </motion.div>
                                ) : !subCategoryData.image ? (
                                    <div className="flex flex-col items-center text-center">
                                        <FaCamera className='text-3xl text-blue-300 mb-2' />
                                        <p className='text-sm text-gray-500 px-2'>
                                            Drag & Drop image<br/>or click to browse
                                        </p>
                                    </div>
                                ) : (
                                    <motion.div className="relative w-full h-full">
                                        <img
                                            alt='subCategory'
                                            src={subCategoryData.image}
                                            className='w-full h-full object-contain p-2'
                                        />
                                        <AnimatePresence>
                                            {imageHover && (
                                                <motion.div 
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <p className="text-white text-sm font-medium">Change image</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </motion.div>

                            <div className='flex flex-col space-y-3 w-full lg:w-auto'>
                                <motion.label 
                                    htmlFor='uploadSubCategoryImage'
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div className='px-5 py-3 bg-blue-50 border-2 border-primary-100 text-primary-200 rounded-lg hover:bg-primary-100 hover:text-white cursor-pointer transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-sm'>
                                        <FaCamera size={16} />
                                        {subCategoryData.image ? 'Change Image' : 'Upload Image'}
                                    </div>
                                    <input 
                                        type='file'
                                        id='uploadSubCategoryImage'
                                        className='hidden'
                                        onChange={handleUploadSubCategoryImage}
                                        accept="image/*"
                                    />
                                </motion.label>

                                {subCategoryData.image && (
                                    <motion.div 
                                        className="flex items-center text-sm text-green-600 gap-1 ml-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Image added
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className={`grid gap-2 ${activeField === 'category' ? 'bg-blue-50 p-3 rounded-lg' : ''} transition-all duration-300`}
                        variants={itemVariants}
                    >
                        <label className='text-gray-700 font-medium flex items-center gap-2'>
                            <FaTags className="text-primary-200" /> Select Parent Categories
                        </label>
                        <div className='border border-gray-300 focus-within:border-primary-200 rounded-lg overflow-hidden'>
                            {/* Display selected categories */}
                            <motion.div 
                                className='flex flex-wrap gap-2 p-3 min-h-12 bg-white'
                                layout
                            >
                                <AnimatePresence>
                                    {subCategoryData.category.map((cat) => (
                                        <motion.div 
                                            key={cat._id + "selectedValue"} 
                                            className='bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm'
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <span className="text-sm">{cat.name}</span>
                                            <motion.div 
                                                className='cursor-pointer text-gray-500 hover:text-red-600 rounded-full p-1'
                                                whileHover={{ rotate: 90 }} 
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemoveCategorySelected(cat._id)}
                                            >
                                                <IoClose size={16}/>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* Category selector */}
                            <motion.select
                                className='w-full p-3 bg-white outline-none border-t border-gray-200'
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (!value) return
                                    
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    const alreadyExists = subCategoryData.category.some(cat => cat._id === categoryDetails._id)
                                    
                                    if (!alreadyExists) {
                                        setSubCategoryData((preve) => {
                                            return {
                                                ...preve,
                                                category: [...preve.category, categoryDetails]
                                            }
                                        })
                                    } else {
                                        toast.error("Category already added")
                                    }
                                    e.target.value = ""
                                }}
                                onFocus={() => setActiveField('category')}
                                onBlur={() => setActiveField(null)}
                            >
                                <option value="">Select Category</option>
                                {allCategory.map((category) => (
                                    <option 
                                        value={category?._id} 
                                        key={category._id + "subcategory"}
                                        disabled={subCategoryData.category.some(cat => cat._id === category._id)}
                                    >
                                        {category?.name}
                                    </option>
                                ))}
                            </motion.select>
                        </div>
                        <p className="text-xs text-gray-500 ml-1">Select one or more parent categories</p>
                    </motion.div>

                    <motion.button
                        className={`
                            mt-4 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                            ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category.length > 0 && !loading
                                ? "bg-primary-200 hover:bg-primary-100 text-black cursor-pointer" 
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"}    
                        `}
                        disabled={!subCategoryData?.name || !subCategoryData?.image || subCategoryData?.category.length === 0 || loading}
                        whileHover={subCategoryData?.name && subCategoryData?.image && subCategoryData?.category.length > 0 && !loading ? { scale: 1.02 } : {}}
                        whileTap={subCategoryData?.name && subCategoryData?.image && subCategoryData?.category.length > 0 && !loading ? { scale: 0.98 } : {}}
                        variants={itemVariants}
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
                            <>Update Sub-Category</>
                        )}
                    </motion.button>
                </motion.form>
            </motion.div>
        </motion.section>
    )
}

export default EditSubCategory