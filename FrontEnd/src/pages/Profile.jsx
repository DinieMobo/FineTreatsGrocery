import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle, FaUser, FaEnvelope, FaPhone, FaPen, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone,
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [activeField, setActiveField] = useState(null)

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            phone: user.phone,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setUserData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='p-4 max-w-3xl mx-auto bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300'
        >
            <motion.h1 
                className="text-2xl font-bold mb-6 text-primary-200 dark:text-primary-300 transition-colors duration-300"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                My Profile
            </motion.h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-6 mb-8 transition-colors duration-300">
                {/**profile upload and display image */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <motion.div 
                        className='w-32 h-32 bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center rounded-full overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileAvatarEdit(true)}
                    >
                        {
                            user.avatar ? (
                                <img
                                    alt={user.name}
                                    src={user.avatar}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <FaRegUserCircle size={85} className="text-white" />
                            )
                        }
                    </motion.div>
                    <motion.button 
                        onClick={() => setProfileAvatarEdit(true)} 
                        className='text-sm flex items-center gap-2 bg-white dark:bg-gray-700 border border-primary-100 dark:border-primary-300 hover:border-primary-200 dark:hover:border-primary-200 hover:bg-primary-200 dark:hover:bg-primary-600 hover:text-white px-4 py-2 rounded-full mt-3 shadow-sm transition-all duration-300 text-gray-700 dark:text-gray-200'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPen size={12} />
                        Edit Photo
                    </motion.button>
                </div>

                {
                    openProfileAvatarEdit && (
                        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
                    )
                }

                {/**name, mobile, email, change password */}
                <motion.form 
                    className='my-4 grid gap-6' 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <motion.div 
                        className={`grid transition-all duration-300 ${activeField === 'name' ? 'bg-blue-50 dark:bg-gray-700 rounded-lg p-2' : ''}`}
                        whileHover={{ scale: 1.01 }}
                    >
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                            <FaUser className="text-primary-200" /> 
                            <span>Full Name</span>
                        </label>
                        <div className="relative">
                            <input
                                type='text'
                                placeholder='Enter your name'
                                className='w-full p-3 bg-white dark:bg-gray-700 outline-none border border-gray-300 dark:border-gray-600 focus:border-primary-200 dark:text-gray-100 rounded-lg shadow-sm transition-all duration-300'
                                value={userData.name}
                                name='name'
                                onChange={handleOnChange}
                                required
                                onFocus={() => setActiveField('name')}
                                onBlur={() => setActiveField(null)}
                            />
                        </div>
                    </motion.div>

                    <motion.div 
                        className={`grid transition-all duration-300 ${activeField === 'email' ? 'bg-blue-50 dark:bg-gray-700 rounded-lg p-2' : ''}`}
                        whileHover={{ scale: 1.01 }}
                    >
                        <label htmlFor='email' className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                            <FaEnvelope className="text-primary-200" /> 
                            <span>Email Address</span>
                        </label>
                        <div className="relative">
                            <input
                                type='email'
                                id='email'
                                placeholder='Enter your email'
                                className='w-full p-3 bg-white dark:bg-gray-700 outline-none border border-gray-300 dark:border-gray-600 focus:border-primary-200 dark:text-gray-100 rounded-lg shadow-sm transition-all duration-300'
                                value={userData.email}
                                name='email'
                                onChange={handleOnChange}
                                required
                                onFocus={() => setActiveField('email')}
                                onBlur={() => setActiveField(null)}
                            />
                        </div>
                    </motion.div>

                    <motion.div 
                        className={`grid transition-all duration-300 ${activeField === 'phone' ? 'bg-blue-50 dark:bg-gray-700 rounded-lg p-2' : ''}`}
                        whileHover={{ scale: 1.01 }}
                    >
                        <label htmlFor='phone' className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                            <FaPhone className="text-primary-200" /> 
                            <span>Phone Number</span>
                        </label>
                        <div className="relative">
                            <input
                                type='text'
                                id='phone'
                                placeholder='Enter your phone'
                                className='w-full p-3 bg-white dark:bg-gray-700 outline-none border border-gray-300 dark:border-gray-600 focus:border-primary-200 dark:text-gray-100 rounded-lg shadow-sm transition-all duration-300'
                                value={userData.phone}
                                name='phone'
                                onChange={handleOnChange}
                                required
                                onFocus={() => setActiveField('phone')}
                                onBlur={() => setActiveField(null)}
                            />
                        </div>
                    </motion.div>

                    <motion.button 
                        className='flex items-center justify-center gap-2 border-2 px-6 py-3 font-semibold bg-primary-100 border-primary-200 text-black-200 hover:bg-primary-200 hover:text-white rounded-lg shadow-md transition-all duration-300 mt-4'
                        disabled={loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {
                            loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Profile...
                                </>
                            ) : (
                                <>
                                    <FaCheck /> Save Changes
                                </>
                            )
                        }
                    </motion.button>
                </motion.form>
            </div>
        </motion.div>
    )
}

export default Profile