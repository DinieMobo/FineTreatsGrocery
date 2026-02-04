import React, { useState } from 'react'
import { FaRegUserCircle, FaCamera, FaUpload, FaCheck } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { updatedAvatar } from '../store/userSlice'

const AVATAR_SIZE = 80
const CLOSE_ICON_SIZE = 22
const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/jpg,image/webp'

const UserProfileAvatarEdit = ({ close }) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [justUploaded, setJustUploaded] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const uploadAvatarFile = async (file) => {
        if (!file) return

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setLoading(true)
            
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData
            })
            
            const { data: responseData } = response

            dispatch(updatedAvatar(responseData.data.avatar))
            setJustUploaded(true)
            toast.success("Avatar updated successfully!")

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadAvatarImage = async (e) => {
        const file = e.target.files?.[0]
        await uploadAvatarFile(file)
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
        await uploadAvatarFile(file)
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            close()
        }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    }

    const modalVariants = {
        hidden: { 
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: { 
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            y: 50,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    }

    return (
        <AnimatePresence>
            <motion.section 
                className='fixed inset-0 z-50 bg-neutral-800 dark:bg-black bg-opacity-60 dark:bg-opacity-70 backdrop-blur-sm p-4 flex items-center justify-center transition-colors duration-300'
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="avatar-edit-title"
            >
                <motion.div 
                    className='bg-white dark:bg-gray-800 max-w-md w-full rounded-lg shadow-2xl border dark:border-gray-700 p-6 flex flex-col items-center transition-colors duration-300'
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Header */}
                    <div className='flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-600 pb-3 mb-6 transition-colors duration-300'>
                        <motion.h1 
                            className='text-xl font-bold text-primary-200 dark:text-primary-300 transition-colors duration-300'
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Update Profile Picture
                        </motion.h1>
                        <motion.button 
                            onClick={close}
                            className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 transition-all duration-300'
                            aria-label="Close avatar upload modal"
                            type="button"
                            whileHover={{ rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoClose size={CLOSE_ICON_SIZE} />
                        </motion.button>
                    </div>

                    {/* Avatar Preview with Drag & Drop */}
                    <motion.div 
                        className={`
                            relative w-40 h-40 mb-6 rounded-full overflow-hidden 
                            border-4 transition-all duration-300 shadow-xl
                            ${isDragging 
                                ? 'border-primary-200 bg-blue-100 dark:bg-gray-600 scale-105' 
                                : 'border-gray-200 dark:border-gray-600'
                            }
                        `}
                        aria-label="Current avatar preview"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {loading ? (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center">
                                <svg className="animate-spin h-10 w-10 text-primary-200 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Uploading...</p>
                            </div>
                        ) : user.avatar ? (
                            <motion.div className="w-full h-full relative group">
                                <img 
                                    alt={`${user.name}'s avatar`}
                                    src={user.avatar}
                                    className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex flex-col items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'>
                                    <FaCamera className='text-white text-3xl mb-2' />
                                    <p className='text-white text-sm font-medium'>Change Photo</p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className='w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center'>
                                <FaRegUserCircle size={AVATAR_SIZE} className="text-white" />
                            </div>
                        )}

                        {isDragging && (
                            <motion.div 
                                className="absolute inset-0 bg-primary-200 bg-opacity-80 flex flex-col items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <FaUpload className="text-white text-4xl mb-2" />
                                <p className="text-white text-sm font-semibold">Drop to upload</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Instructions */}
                    {!isDragging && (
                        <motion.p 
                            className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4 transition-colors duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Drag & drop an image or click the button below
                        </motion.p>
                    )}

                    {/* Upload Form */}
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className='w-full'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label htmlFor='uploadProfile' className='block'>
                            <motion.div 
                                className={`
                                    w-full py-3 px-6 rounded-lg font-semibold text-center
                                    transition-all duration-300 shadow-md flex items-center justify-center gap-2
                                    ${loading 
                                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                                        : 'bg-primary-200 hover:bg-primary-100 text-white cursor-pointer'
                                    }
                                `}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                            >
                                <FaCamera />
                                {loading ? 'Uploading...' : user.avatar ? 'Change Avatar' : 'Upload Avatar'}
                            </motion.div>
                            <input 
                                onChange={handleUploadAvatarImage}
                                type='file'
                                id='uploadProfile'
                                className='hidden'
                                accept={ACCEPTED_IMAGE_TYPES}
                                disabled={loading}
                                aria-label="Upload profile picture"
                            />
                        </label>

                        {justUploaded && !loading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center text-sm text-green-600 dark:text-green-400 gap-1 mt-3"
                            >
                                <FaCheck size={12} />
                                Avatar uploaded successfully
                            </motion.div>
                        )}
                    </motion.form>
                </motion.div>
            </motion.section>
        </AnimatePresence>
    )
}

export default UserProfileAvatarEdit