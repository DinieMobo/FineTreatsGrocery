import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FaCloudUploadAlt, FaRegSave, FaAngleRight } from "react-icons/fa";
import { MdDelete, MdCategory, MdDescription } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { BsBoxSeam, BsTagFill, BsCurrencyDollar, BsImage } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")
  const [activeSection, setActiveSection] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null)

  const cardVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -3, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }
  }

  const inputVariants = {
    focused: { scale: 1.005, boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.4)' },
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data: ImageResponse } = response
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl]
      }
    })
    setImageLoading(false)
  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;
    setIsSubmitting(true)
    
    try {
      const formattedData = {
        ...data,
        category: data.category.map(cat => cat._id),
        subCategory: data.subCategory.map(subCat => subCat._id),
        price: Number(data.price),
        stock: Number(data.stock) || 0,
        discount: Number(data.discount) || 0
      };
      
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: formattedData
      })
      
      const { data: responseData } = response

      if (responseData.success) {
        successAlert(responseData.message)
        if(close){
          close()
        }
        fetchProductData()
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formSections = [
    { id: 'basic', title: 'Basic Information', icon: <MdDescription /> },
    { id: 'images', title: 'Product Images', icon: <BsImage /> },
    { id: 'categories', title: 'Categories', icon: <MdCategory /> },
    { id: 'pricing', title: 'Pricing & Inventory', icon: <BsCurrencyDollar /> },
    { id: 'details', title: 'Additional Details', icon: <BsTagFill /> }
  ]

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [close]);

  return ReactDOM.createPortal (
    <motion.section 
      className='fixed inset-0 bg-black/80 z-[1000] p-4 flex items-center justify-center will-change-transform'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <motion.div 
        className='bg-white w-full md:w-[95vw] p-0 max-w-4xl mx-auto rounded-lg overflow-hidden min-h-[60vh] max-h-[90vh] shadow-2xl relative will-change-transform'
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <header className='p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10 flex items-center justify-between'>
          <h2 className='font-bold text-xl flex items-center gap-2'>
            <FaRegSave className="animate-pulse"/>
            Edit Product: {data.name}
          </h2>
          <motion.button 
            onClick={close}
            className="hover:bg-white/20 p-2 rounded-full"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <IoClose size={24}/>
          </motion.button>
        </header>
        
        <div className="flex border-b overflow-x-auto">
          {formSections.map((section, index) => (
            <motion.button
              key={section.id}
              className={`py-3 px-4 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSection === section.id 
                ? 'bg-indigo-50 border-b-2 border-indigo-600 text-indigo-600 font-medium' 
                : 'hover:bg-gray-50'
              }`}
              whileHover={{ backgroundColor: activeSection === section.id ? '#EEF2FF' : '#F9FAFB' }}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              {section.title}
            </motion.button>
          ))}
        </div>
        
        <div className='overflow-y-auto max-h-[calc(90vh-10rem)] pb-4'>
          <form className='grid gap-6 p-6' onSubmit={handleSubmit}>
            
            {/* Basic Information */}
            <AnimatePresence mode="wait">
              {(activeSection === 'basic' || !activeSection) && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className='grid gap-2'
                    whileHover={cardVariants.hover}
                    initial={cardVariants.initial}
                    animate={cardVariants.animate}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor='name' className='text-gray-700 font-medium flex items-center gap-2'>
                      <BsBoxSeam /> Product Name
                    </label>
                    <motion.input
                      id='name'
                      type='text'
                      placeholder='Enter product name'
                      name='name'
                      value={data.name}
                      onChange={handleChange}
                      required
                      className='bg-gray-50 p-3 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 transition-all'
                      whileFocus={inputVariants.focused}
                      whileTap={{ scale: 0.995 }}
                    />
                  </motion.div>

                  <motion.div 
                    className='grid gap-2'
                    whileHover={cardVariants.hover}
                    initial={cardVariants.initial}
                    animate={cardVariants.animate}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <label htmlFor='description' className='text-gray-700 font-medium flex items-center gap-2'>
                      <MdDescription /> Description
                    </label>
                    <motion.textarea
                      id='description'
                      placeholder='Enter product description'
                      name='description'
                      value={data.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className='bg-gray-50 p-3 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300 transition-all resize-none'
                      whileFocus={inputVariants.focused}
                      whileTap={{ scale: 0.995 }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Images */}
            <AnimatePresence mode="wait">
              {activeSection === 'images' && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <motion.div 
                    whileHover={cardVariants.hover}
                    initial={cardVariants.initial}
                    animate={cardVariants.animate}
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200'
                  >
                    <h3 className='text-lg font-medium mb-4 flex items-center gap-2 text-gray-700'>
                      <BsImage /> Product Images
                    </h3>
                    
                    <label 
                      htmlFor='productImage' 
                      className='bg-gradient-to-r from-blue-50 to-indigo-50 h-32 border-2 border-dashed border-indigo-200 rounded-lg flex justify-center items-center cursor-pointer hover:border-indigo-400 transition-all'
                    >
                      <div className='text-center flex flex-col items-center justify-center gap-2 p-4'>
                        {imageLoading ? 
                          <Loading /> : 
                          <motion.div 
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div
                              animate={{ 
                                y: [0, -5, 0],
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 2
                              }}
                              className="flex justify-center"
                            >
                              <FaCloudUploadAlt size={40} className="text-indigo-500"/>
                            </motion.div>
                            <p className="font-medium text-gray-600 mt-2">Click or drop files to upload</p>
                            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </motion.div>
                        }
                      </div>
                      <input
                        type='file'
                        id='productImage'
                        className='hidden'
                        accept='image/*'
                        onChange={handleUploadImage}
                      />
                    </label>

                    {data.image.length > 0 && (
                      <div className='mt-6'>
                        <h4 className='text-sm font-medium text-gray-500 mb-3'>
                          Product Images ({data.image.length})
                        </h4>
                        <motion.div 
                          className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {data.image.map((img, index) => (
                            <motion.div 
                              key={img + index} 
                              className='relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white'
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)"
                              }}
                              onMouseEnter={() => setHoveredImage(index)}
                              onMouseLeave={() => setHoveredImage(null)}
                            >
                              <div className="aspect-square">
                                <img
                                  src={img}
                                  alt={`Product image ${index + 1}`}
                                  className='w-full h-full object-cover cursor-pointer'
                                  onClick={() => setViewImageURL(img)}
                                />
                              </div>
                              
                              {/* Hover overlay */}
                              <AnimatePresence>
                                {hoveredImage === index && (
                                  <motion.div 
                                    className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between p-2'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <button 
                                      type="button"
                                      onClick={() => setViewImageURL(img)}
                                      className='text-white bg-indigo-500/80 p-1.5 rounded-full hover:bg-indigo-600/90 transition'
                                    >
                                      <BsImage size={16} />
                                    </button>
                                    
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteImage(index)} 
                                      className='text-white bg-red-500/80 p-1.5 rounded-full hover:bg-red-600/90 transition'
                                    >
                                      <MdDelete size={16} />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories */}
            <AnimatePresence mode="wait">
              {activeSection === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className='grid gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200'
                    whileHover={cardVariants.hover}
                    initial={cardVariants.initial}
                    animate={cardVariants.animate}
                  >
                    <h3 className='text-lg font-medium mb-1 text-gray-700 flex items-center gap-2'>
                      <MdCategory /> Categories
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-600'>Main Category</label>
                        <motion.select
                          className='bg-white border w-full p-3 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                          value={selectCategory}
                          whileTap={{ scale: 0.995 }}
                          whileFocus={inputVariants.focused}
                          onChange={(e) => {
                            const value = e.target.value
                            if (!value) return;
                            
                            const category = allCategory.find(el => el._id === value)
                            if (!category) return;
                            
                            if (data.category.some(c => c._id === category._id)) {
                              return;
                            }

                            setData((preve) => ({
                              ...preve,
                              category: [...preve.category, category]
                            }))
                            setSelectCategory("")
                          }}
                        >
                          <option value="">Select a Category</option>
                          {allCategory.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </motion.select>
                        
                        {data.category.length > 0 && (
                          <motion.div 
                            className='flex flex-wrap gap-2 mt-3'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {data.category.map((c, index) => (
                              <motion.div 
                                key={c._id + index}
                                className='flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <span>{c.name}</span>
                                <button 
                                  type="button"
                                  className='hover:bg-indigo-200 rounded-full p-0.5 transition-colors'
                                  onClick={() => handleRemoveCategory(index)}
                                >
                                  <IoClose size={16} />
                                </button>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-600'>Sub Category</label>
                        <motion.select
                          className='bg-white border w-full p-3 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                          value={selectSubCategory}
                          whileTap={{ scale: 0.995 }}
                          whileFocus={inputVariants.focused}
                          onChange={(e) => {
                            const value = e.target.value
                            if (!value) return;
                            
                            const subCategory = allSubCategory.find(el => el._id === value)
                            if (!subCategory) return;
                            
                            if (data.subCategory.some(c => c._id === subCategory._id)) {
                              return;
                            }

                            setData((preve) => ({
                              ...preve,
                              subCategory: [...preve.subCategory, subCategory]
                            }))
                            setSelectSubCategory("")
                          }}
                        >
                          <option value="">Select a Sub Category</option>
                          {allSubCategory.map((c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </motion.select>
                        
                        {data.subCategory.length > 0 && (
                          <motion.div 
                            className='flex flex-wrap gap-2 mt-3'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {data.subCategory.map((c, index) => (
                              <motion.div 
                                key={c._id + index}
                                className='flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <span>{c.name}</span>
                                <button 
                                  type="button"
                                  className='hover:bg-blue-200 rounded-full p-0.5 transition-colors'
                                  onClick={() => handleRemoveSubCategory(index)}
                                >
                                  <IoClose size={16} />
                                </button>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pricing & Inventory */}
            <AnimatePresence mode="wait">
              {activeSection === 'pricing' && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className='grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200'
                    whileHover={cardVariants.hover}
                    initial={cardVariants.initial}
                    animate={cardVariants.animate}
                  >
                    <div>
                      <h3 className='text-lg font-medium mb-4 text-gray-700 flex items-center gap-2'>
                        <BsCurrencyDollar /> Pricing
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor='price' className='text-sm font-medium text-gray-600'>Regular Price</label>
                          <motion.div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              Rs.
                            </div>
                            <motion.input
                              id='price'
                              type='number'
                              placeholder='0.00'
                              name='price'
                              value={data.price}
                              onChange={handleChange}
                              required
                              min="0"
                              step="0.01"
                              className='bg-white border pl-9 py-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                              whileFocus={inputVariants.focused}
                              whileTap={{ scale: 0.995 }}
                            />
                          </motion.div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor='discount' className='text-sm font-medium text-gray-600'>Discount (%)</label>
                          <motion.input
                            id='discount'
                            type='number'
                            placeholder='0'
                            name='discount'
                            value={data.discount}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className='bg-white border py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                            whileFocus={inputVariants.focused}
                            whileTap={{ scale: 0.995 }}
                          />
                        </div>

                        {data.price && data.discount > 0 && (
                          <motion.div 
                            className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100 text-green-700"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <p className="text-sm font-medium flex justify-between">
                              <span>Sale Price:</span>
                              <span>Rs.{(data.price - (data.price * data.discount / 100)).toFixed(2)}</span>
                            </p>
                            <p className="text-xs mt-1 text-green-600">
                              Customers save: Rs.{(data.price * data.discount / 100).toFixed(2)}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className='text-lg font-medium mb-4 text-gray-700 flex items-center gap-2'>
                        <BsBoxSeam /> Inventory
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor='unit' className='text-sm font-medium text-gray-600'>Unit</label>
                          <motion.input
                            id='unit'
                            type='text'
                            placeholder='e.g. kg, piece, box'
                            name='unit'
                            value={data.unit}
                            onChange={handleChange}
                            required
                            className='bg-white border py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                            whileFocus={inputVariants.focused}
                            whileTap={{ scale: 0.995 }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor='stock' className='text-sm font-medium text-gray-600'>Stock Quantity</label>
                          <motion.input
                            id='stock'
                            type='number'
                            placeholder='0'
                            name='stock'
                            value={data.stock}
                            onChange={handleChange}
                            min="0"
                            className='bg-white border py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                            whileFocus={inputVariants.focused}
                            whileTap={{ scale: 0.995 }}
                          />
                        </div>
                        
                        {data.stock !== null && data.stock !== '' && (
                          <motion.div 
                            className={`mt-3 p-3 rounded-lg border ${
                              Number(data.stock) > 10 
                                ? 'bg-green-50 border-green-100 text-green-700' 
                                : Number(data.stock) > 0 
                                  ? 'bg-yellow-50 border-yellow-100 text-yellow-700'
                                  : 'bg-red-50 border-red-100 text-red-700'
                            }`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <p className="text-sm font-medium">
                              {Number(data.stock) > 10 
                                ? 'In Stock' 
                                : Number(data.stock) > 0 
                                  ? 'Low Stock'
                                  : 'Out of Stock'}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional Details */}
            <AnimatePresence mode="wait">
              {activeSection === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200'
                    whileHover={cardVariants.hover}
                    initial={cardVariants.initial}
                    animate={cardVariants.animate}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className='text-lg font-medium text-gray-700 flex items-center gap-2'>
                        <BsTagFill /> Additional Details
                      </h3>
                      
                      <motion.button
                        type="button"
                        onClick={() => setOpenAddField(true)}
                        className='inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-4 rounded-lg transition-colors text-sm font-medium'
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>Add Field</span>
                        <FaAngleRight size={14} />
                      </motion.button>
                    </div>
                    
                    {Object.keys(data?.more_details || {}).length === 0 ? (
                      <motion.div 
                        className="p-8 text-center text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p>No additional fields yet. Click "Add Field" to create some.</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {Object.keys(data?.more_details || {}).map((k, index) => (
                          <motion.div 
                            key={k}
                            className='grid gap-2'
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex justify-between">
                              <label htmlFor={k} className='text-sm font-medium text-gray-600'>
                                {k.charAt(0).toUpperCase() + k.slice(1)}
                              </label>
                              <motion.button
                                type="button"
                                onClick={() => {
                                  const newDetails = { ...data.more_details };
                                  delete newDetails[k];
                                  setData({
                                    ...data,
                                    more_details: newDetails
                                  });
                                }}
                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MdDelete size={16} />
                              </motion.button>
                            </div>
                            <motion.input
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e) => {
                                const value = e.target.value
                                setData((preve) => {
                                  return {
                                    ...preve,
                                    more_details: {
                                      ...preve.more_details,
                                      [k]: value
                                    }
                                  }
                                })
                              }}
                              className='bg-white border py-3 px-4 rounded-lg focus:ring-2 focus:ring-indigo-300 outline-none transition-all'
                              whileFocus={inputVariants.focused}
                              whileTap={{ scale: 0.995 }}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              type="submit"
              className='bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all relative overflow-hidden group mt-6 disabled:opacity-70 disabled:cursor-not-allowed'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <FaRegSave />
                {isSubmitting ? "Saving Changes..." : "Update Product"}
              </span>
              <motion.span 
                className="absolute inset-0 bg-indigo-600 z-0" 
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </form>
        </div>
        
        {ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
        )}
        
        {openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </motion.div>
    </motion.section>,
    document.body
  )
}

export default EditProductAdmin