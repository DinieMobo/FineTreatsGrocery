import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [activeField, setActiveField] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const validValue = Object.values(data).every(el => el)
    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email : "",
                    password : "",
                })
                navigate("/")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
    return (
        <section className='w-full min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white dark:bg-gray-800 my-4 w-full max-w-lg mx-auto rounded-xl p-8 shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 border dark:border-gray-700'
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2 transition-colors duration-300">Welcome Back!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">We're so excited to see you again! Please sign in to your Fine Treats account to continue your shopping journey.</p>
                </motion.div>

                <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='email' className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300">Email</label>
                        <input
                            type='email'
                            id='email'
                            className={`bg-blue-50 dark:bg-gray-700 p-3 border ${activeField === 'email' ? 'border-green-500 ring-1 ring-green-300 dark:ring-green-400' : 'border-gray-300 dark:border-gray-600'} rounded-lg outline-none focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            onFocus={() => setActiveField('email')}
                            onBlur={() => setActiveField(null)}
                            placeholder='Enter your email'
                        />
                    </motion.div>
                    
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='password' className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300">Password</label>
                        <div className={`bg-blue-50 dark:bg-gray-700 p-3 border ${activeField === 'password' ? 'border-green-500 ring-1 ring-green-300 dark:ring-green-400' : 'border-gray-300 dark:border-gray-600'} rounded-lg flex items-center transition-all duration-200`}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                onFocus={() => setActiveField('password')}
                                onBlur={() => setActiveField(null)}
                                placeholder='Enter your password'
                            />
                            <motion.div 
                                onClick={() => setShowPassword(preve => !preve)} 
                                className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-300'
                                whileTap={{ scale: 0.9 }}
                            >
                                {
                                    showPassword ? (
                                        <FaRegEye className="text-xl" />
                                    ) : (
                                        <FaRegEyeSlash className="text-xl" />
                                    )
                                }
                            </motion.div>
                        </div>
                        <Link 
                            to={"/forgot-password"} 
                            className='block ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:underline transition-all duration-200 font-medium'
                        >
                            Forgot password?
                        </Link>
                    </motion.div>

                    <motion.button 
                        disabled={!validValue} 
                        className={` ${validValue ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "bg-gray-400 dark:bg-gray-600"} text-white py-3 rounded-lg font-semibold my-4 tracking-wide transition-colors duration-300`}
                        whileHover={validValue ? { scale: 1.03 } : {}}
                        whileTap={validValue ? { scale: 0.98 } : {}}
                    >
                        Login
                    </motion.button>
                </form>

                <motion.p 
                    className="text-center text-gray-600 dark:text-gray-300 mt-4 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Don't have a Fine Treats account?{" "}
                    <Link 
                        to={"/register"} 
                        className='font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:underline transition-all duration-200'
                    >
                        Register
                    </Link>
                </motion.p>
            </motion.div>
        </section>
    )
}

export default Login