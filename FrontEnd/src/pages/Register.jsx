import React, { useState, useCallback, useMemo } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2 } }
};

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [activeField, setActiveField] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const validValue = useMemo(() => Object.values(data).every(el => el), [data]);
    
    const passwordsMatch = useMemo(() => 
        data.password === data.confirmPassword || !data.confirmPassword, 
        [data.password, data.confirmPassword]
    );

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setData(prev => ({...prev, [name]: value}))
    }, []);

    const toggleShowPassword = useCallback(() => {
        setShowPassword(prev => !prev)
    }, []);

    const toggleShowConfirmPassword = useCallback(() => {
        setShowConfirmPassword(prev => !prev)
    }, []);

    const setFieldFocus = useCallback((field) => {
        setActiveField(field)
    }, []);

    const handleSubmit = useCallback(async(e) => {
        e.preventDefault()
        if (isSubmitting || !validValue) return;

        if(data.password !== data.confirmPassword){
            toast.error("New and Confirm passwords must be same")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await Axios({
                ...SummaryApi.register,
                data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsSubmitting(false)
        }
    }, [data, navigate, validValue, isSubmitting]);

    const isButtonDisabled = useMemo(() => !validValue || isSubmitting, [validValue, isSubmitting]);
    
    return (
        <section className='w-full min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='bg-white dark:bg-gray-800 my-4 w-full max-w-lg mx-auto rounded-xl p-8 shadow-lg hover:shadow-xl dark:shadow-2xl transition-all duration-300 border dark:border-gray-700'
                style={{willChange: 'opacity, transform'}}
            >
                <motion.div variants={contentVariants}>
                    <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2 transition-colors duration-300">Welcome to Fine Treats Grocery!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">Let's get you up and running with your Fine Treats account. We just need a few details to get started.</p>
                </motion.div>

                <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>
                    {/* Name field */}
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='name' className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300">Name</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className={`bg-blue-50 dark:bg-gray-700 p-3 border ${activeField === 'name' ? 'border-green-500 ring-1 ring-green-300 dark:ring-green-400' : 'border-gray-300 dark:border-gray-600'} rounded-lg outline-none focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400`}
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            onFocus={() => setFieldFocus('name')}
                            onBlur={() => setFieldFocus(null)}
                            placeholder='Enter your name'
                            autoComplete="name"
                        />
                    </motion.div>
                    
                    {/* Email field */}
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
                            onFocus={() => setFieldFocus('email')}
                            onBlur={() => setFieldFocus(null)}
                            placeholder='Enter your email'
                            autoComplete="email"
                        />
                    </motion.div>
                    
                    {/* Password field */}
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
                                onFocus={() => setFieldFocus('password')}
                                onBlur={() => setFieldFocus(null)}
                                placeholder='Enter your password'
                                autoComplete="new-password"
                            />
                            <motion.div 
                                onClick={toggleShowPassword} 
                                className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-300'
                                whileTap={{ scale: 0.9 }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    {/* Confirm Password field */}
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='confirmPassword' className="text-gray-700 dark:text-gray-200 font-medium transition-colors duration-300">Confirm Password</label>
                        <div className={`bg-blue-50 dark:bg-gray-700 p-3 border ${!passwordsMatch ? 'border-red-500 dark:border-red-400' : activeField === 'confirmPassword' ? 'border-green-500 ring-1 ring-green-300 dark:ring-green-400' : 'border-gray-300 dark:border-gray-600'} rounded-lg flex items-center transition-all duration-200`}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => setFieldFocus('confirmPassword')}
                                onBlur={() => setFieldFocus(null)}
                                placeholder='Confirm your password'
                                autoComplete="new-password"
                            />
                            <motion.div 
                                onClick={toggleShowConfirmPassword} 
                                className='cursor-pointer text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors duration-300'
                                whileTap={{ scale: 0.9 }}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <FaRegEye className="text-xl" /> : <FaRegEyeSlash className="text-xl" />}
                            </motion.div>
                        </div>
                        {!passwordsMatch && data.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                    </motion.div>

                    {/* Submit button */}
                    <motion.button 
                        type="submit"
                        disabled={isButtonDisabled} 
                        className={`${!isButtonDisabled ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "bg-gray-400 dark:bg-gray-600"} text-white py-3 rounded-lg font-semibold my-4 tracking-wide transition-colors duration-300`}
                        whileHover={!isButtonDisabled ? { scale: 1.03 } : {}}
                        whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </motion.button>
                </form>

                <motion.p 
                    className="text-center text-gray-600 dark:text-gray-300 mt-4 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Already have an Fine Treats account?{" "}
                    <Link 
                        to={"/login"} 
                        className='font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:underline transition-all duration-200'
                    >
                        Login
                    </Link>
                </motion.p>
            </motion.div>
        </section>
    )
}

export default React.memo(Register);