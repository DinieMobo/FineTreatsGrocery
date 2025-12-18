import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaCloudUploadAlt, FaInfoCircle, FaSave, FaPlus } from "react-icons/fa";
import { MdDelete, MdCategory } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { BsBoxSeam, BsTagFill, BsCurrencyDollar } from "react-icons/bs";
import Axios from '../utils/Axios';
import { motion, AnimatePresence } from 'framer-motion';
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {
  const [data, setData] = useState({
      name: "",
      image: [],
      category: [],
      subCategory: [],
      unit: "",
      stock: "",
      price: "",
      discount: "",
      description: "",
      more_details: {},
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
  const [hoveredImage, setHoveredImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)


  const handleChange = (e) => {
    const { name, value } = e.target 

    setData((preve) => {
      return {
          ...preve,
          [name]: value
      }
    })
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    
    setImageLoading(true);
    try {
      const uploadPromises = acceptedFiles.map(file => uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      
      const newImageUrls = responses.map(res => res.data.data.url);
      
      setData(prev => ({
        ...prev,
        image: [...prev.image, ...newImageUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setImageLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true
  });

  const handleUploadImage = async(e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setImageLoading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      
      const newImageUrls = responses.map(res => res.data.data.url);
      
      setData(prev => ({
        ...prev,
        image: [...prev.image, ...newImageUrls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setImageLoading(false);
    }
  }

  const handleDeleteImage = async(index) => {
      data.image.splice(index, 1)
      setData((preve) => {
        return {
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }
  
  const handleRemoveSubCategory = async(index) => {
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

    const handleSubmit = async(e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      })

      const { data: responseData } = response

      if(responseData.success) {
          successAlert(responseData.message)
          setData({
            name: "",
            image: [],
            category: [],
            subCategory: [],
            unit: "",
            stock: "",
            price: "",
            discount: "",
            description: "",
            more_details: {},
          })
      }
    } catch (error) {
        console.error('Product upload error:', error);
        if (error.response) {
          console.log('Error data:', error.response.data);
          console.log('Error status:', error.response.status);
          console.log('Error headers:', error.response.headers);
          alert(`Error: ${error.response.data?.message || 'Failed to upload product'}`);
        } else if (error.request) {
          console.log('Error request:', error.request);
          alert('Network error - no response from server');
        } else {
          console.log('Error message:', error.message);
          alert(`Error: ${error.message}`);
        }
    } finally {
      setSubmitting(false)
    }
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }
  }

  const formSections = [
    { id: 'basic', title: 'Basic Information', icon: <FaInfoCircle /> },
    { id: 'images', title: 'Product Images', icon: <FaCloudUploadAlt /> },
    { id: 'categories', title: 'Categories', icon: <MdCategory /> },
    { id: 'pricing', title: 'Pricing & Inventory', icon: <BsCurrencyDollar /> },
    { id: 'details', title: 'Additional Details', icon: <BsTagFill /> }
  ]

  return (
    <motion.section 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className='min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className='p-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 shadow-lg flex items-center justify-between text-white mb-6 rounded-b-lg transition-colors duration-300'
      >
        <h2 className='font-bold text-xl flex items-center gap-2'>
          <BsBoxSeam size={24} />
          <span>Upload a New Product</span>
        </h2>
      </motion.div>

      <div className='max-w-5xl mx-auto px-4'>
        {/* Form sections navigation */}
        <div className='mb-6 flex flex-wrap gap-2'>
          {formSections.map(section => (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border dark:border-gray-600'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </motion.button>
          ))}
        </div>

        <motion.div 
          variants={cardVariants}
          className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300'
        >
          <form className='grid gap-6' onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <AnimatePresence>
              {(activeSection === 'basic' || activeSection === null) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden'
                >
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 transition-colors duration-300'>
                    <FaInfoCircle className="text-blue-500" /> 
                    Basic Information
                  </h3>
                  
                  <div className='grid gap-4'>
                    <div className='grid gap-1'>
                      <label htmlFor='name' className='font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-300'>
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        id='name'
                        type='text'
                        placeholder='Enter product name'
                        name='name'
                        value={data.name}
                        onChange={handleChange}
                        required
                        className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300'
                      />
                    </div>
                    
                    <div className='grid gap-1'>
                      <label htmlFor='description' className='font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 transition-colors duration-300'>
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        id='description'
                        placeholder='Enter product description'
                        name='description'
                        value={data.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300 resize-none'
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Image Section */}
            <AnimatePresence>
              {(activeSection === 'images' || activeSection === null) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden'
                >
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 transition-colors duration-300'>
                    <FaCloudUploadAlt className="text-blue-500" /> 
                    Product Images
                  </h3>
                  
                  <div>
                    <div 
                      {...getRootProps()}
                      className={`bg-blue-50 dark:bg-gray-700 h-32 border-2 border-dashed rounded-lg flex justify-center items-center cursor-pointer transition-all duration-300 ${
                        isDragActive 
                          ? 'border-blue-500 bg-blue-100 dark:bg-gray-600' 
                          : 'border-blue-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className='text-center flex justify-center items-center flex-col'>
                        {
                          imageLoading ? <Loading /> : (
                            <>
                              <FaCloudUploadAlt size={40} className="text-blue-500 mb-2" />
                              <p className="font-medium text-blue-600 dark:text-blue-400">Upload Product Images</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                                {isDragActive ? 'Drop files here' : 'Click or drag files here'}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-300">Supports multiple images</p>
                            </>
                          )
                        }
                      </div>
                      <input 
                        {...getInputProps()}
                        id='productImage'
                        type='file'
                        className='hidden'
                        accept='image/*'
                        onChange={handleUploadImage}
                        multiple
                      />
                    </div>
                    
                    {/* Display uploaded images */}
                    <motion.div 
                      className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4'
                      initial="initial"
                      animate="animate"
                      variants={{
                        animate: {
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                    >
                      {
                        data.image.map((img, index) => (
                          <motion.div 
                            key={img+index} 
                            className='aspect-square relative group rounded-lg overflow-hidden shadow-md transition-all duration-300'
                            variants={{
                              initial: { scale: 0.8, opacity: 0 },
                              animate: { scale: 1, opacity: 1 }
                            }}
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            onMouseEnter={() => setHoveredImage(index)}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            <img
                              src={img}
                              alt={img}
                              className='w-full h-full object-cover cursor-pointer transition-transform duration-500'
                              style={{
                                transform: hoveredImage === index ? 'scale(1.1)' : 'scale(1)'
                              }}
                              onClick={() => setViewImageURL(img)}
                            />
                            
                            {/* Overlay with actions */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2"
                            >
                              <div className="flex justify-between items-end">
                                <span className="text-white text-xs truncate">Image {index + 1}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteImage(index);
                                  }}
                                  className="bg-red-500 p-1.5 rounded-full text-white shadow-lg"
                                >
                                  <MdDelete size={16} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      }
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories Section */}
            <AnimatePresence>
              {(activeSection === 'categories' || activeSection === null) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden'
                >
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 transition-colors duration-300'>
                    <MdCategory className="text-blue-500" /> 
                    Categories
                  </h3>
                  
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='grid gap-2'>
                      <label className='font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300'>Product Category</label>
                      <div>
                        <select
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 border border-blue-100 dark:border-gray-600 w-full p-3 rounded-lg focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none transition-all duration-300'
                          value={selectCategory}
                          onChange={(e) => {
                            const value = e.target.value 
                            const category = allCategory.find(el => el._id === value)
                            
                            if (value && category && !data.category.some(c => c._id === category._id)) {
                              setData((preve) => {
                                return {
                                  ...preve,
                                  category: [...preve.category, category],
                                }
                              })
                            }
                            setSelectCategory("")
                          }}
                        >
                          <option value={""} className="dark:bg-gray-800">Select a Category</option>
                          {
                            allCategory.map((c) => (
                              <option key={c._id} value={c?._id} className="dark:bg-gray-800">{c.name}</option>
                            ))
                          }
                        </select>
                        
                        <div className='flex flex-wrap gap-2 mt-3'>
                          {
                            data.category.map((c, index) => (
                              <motion.div 
                                key={c._id+index+"productsection"} 
                                className='flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:shadow-md'
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                              >
                                <p className="text-sm font-medium">{c.name}</p>
                                <motion.div 
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  className='text-blue-700 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400 cursor-pointer' 
                                  onClick={() => handleRemoveCategory(index)}
                                >
                                  <IoClose size={18} />
                                </motion.div>
                              </motion.div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className='grid gap-2'>
                      <label className='font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300'>Sub Category</label>
                      <div>
                        <select
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 border border-blue-100 dark:border-gray-600 w-full p-3 rounded-lg focus:border-blue-400 dark:focus:border-blue-500 focus:outline-none transition-all duration-300'
                          value={selectSubCategory}
                          onChange={(e) => {
                            const value = e.target.value 
                            const subCategory = allSubCategory.find(el => el._id === value)

                            if (value && subCategory && !data.subCategory.some(c => c._id === subCategory._id)) {
                              setData((preve) => {
                                return {
                                  ...preve,
                                  subCategory: [...preve.subCategory, subCategory]
                                }
                              })
                            }
                            setSelectSubCategory("")
                          }}
                        >
                          <option value={""} className="dark:bg-gray-800">Select a Sub Category</option>
                          {
                          allSubCategory?.map((c) => (
                            <option key={c._id} value={c?._id} className="dark:bg-gray-800">{c?.name}</option>
                          ))
                          }
                        </select>
                        
                        <div className='flex flex-wrap gap-2 mt-3'>
                          {
                            data.subCategory.map((c, index) => (
                              <motion.div 
                                key={c._id+index+"productsection"} 
                                className='flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 hover:shadow-md'
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                              >
                                <p className="text-sm font-medium">{c.name}</p>
                                <motion.div 
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                  className='text-indigo-700 dark:text-indigo-300 hover:text-red-500 dark:hover:text-red-400 cursor-pointer' 
                                  onClick={() => handleRemoveSubCategory(index)}
                                >
                                  <IoClose size={18} />
                                </motion.div>
                              </motion.div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pricing & Inventory Section */}
            <AnimatePresence>
              {(activeSection === 'pricing' || activeSection === null) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden'
                >
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 transition-colors duration-300'>
                    <BsCurrencyDollar className="text-blue-500" /> 
                    Pricing & Inventory
                  </h3>
                  
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='grid gap-2'>
                      <label htmlFor='unit' className='font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300'>Unit</label>
                      <div className="relative">
                        <input 
                          id='unit'
                          type='text'
                          placeholder='e.g. kg, piece, dozen'
                          name='unit'
                          value={data.unit}
                          onChange={handleChange}
                          required
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300 w-full'
                        />
                      </div>
                    </div>
                    
                    <div className='grid gap-2'>
                      <label htmlFor='stock' className='font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300'>Stock Quantity</label>
                      <div className="relative">
                        <input 
                          id='stock'
                          type='number'
                          placeholder='Available quantity'
                          name='stock'
                          value={data.stock}
                          onChange={handleChange}
                          required
                          min="0"
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300 w-full'
                        />
                      </div>
                    </div>
                    
                    <div className='grid gap-2'>
                      <label htmlFor='price' className='font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300'>Price (Rs.)</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          Rs.
                        </div>
                        <input 
                          id='price'
                          type='number'
                          placeholder='0.00'
                          name='price'
                          value={data.price}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.01"
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 pl-8 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300 w-full'
                        />
                      </div>
                    </div>
                    
                    <div className='grid gap-2'>
                      <label htmlFor='discount' className='font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300'>Discount (%)</label>
                      <div className="relative">
                        <input 
                          id='discount'
                          type='number'
                          placeholder='0'
                          name='discount'
                          value={data.discount}
                          onChange={handleChange}
                          required
                          min="0"
                          max="100"
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300 w-full'
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional Details Section */}
            <AnimatePresence>
              {(activeSection === 'details' || activeSection === null) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className='overflow-hidden'
                >
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2 transition-colors duration-300'>
                    <BsTagFill className="text-blue-500" /> 
                    Additional Details
                  </h3>
                  
                  <div className='grid gap-4'>
                    {Object.keys(data.more_details).map((k, index) => (
                      <div key={k+index} className='grid gap-2'>
                        <label htmlFor={k} className='font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors duration-300'>{k}</label>
                        <input 
                          id={k}
                          type='text'
                          value={data.more_details[k]}
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
                          required
                          className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 p-3 outline-none border border-blue-100 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg transition-all duration-300'
                        />
                      </div>
                    ))}
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, backgroundColor: '#e0e7ff' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOpenAddField(true)}
                      className='flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 font-medium border border-indigo-200 dark:border-indigo-800'
                    >
                      <FaPlus size={14} />
                      Add Custom Field
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaSave size={18} />
                  <span>Save Product</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {ViewImageURL && (
          <ViewImage url={ViewImageURL} close={() => setViewImageURL("")}/>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openAddField && (
          <AddFieldComponent 
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)} 
          />
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default UploadProduct