import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate()

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

        if(data.password !== data.confirmPassword){
            toast.error(
                "New and Confirm passwords must be same"
            )
            return
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate("/login")
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
    
    return (
        <section className='w-full min-h-screen flex items-center justify-center py-10 bg-gradient-to-br from-green-50 to-blue-50'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white my-4 w-full max-w-lg mx-auto rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-green-800 mb-2">Welcome to Fine Treats Grocery!</h2>
                    <p className="text-gray-600 mb-6">Let's get you up and running with your Fine Treats account. We just need a few details to get started.</p>
                </motion.div>

                <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='name' className="text-gray-700 font-medium">Name</label>
                        <input
                            type='text'
                            id='name'
                            autoFocus
                            className={`bg-blue-50 p-3 border ${activeField === 'name' ? 'border-green-500 ring-1 ring-green-300' : 'border-gray-300'} rounded-lg outline-none focus:border-green-500 transition-all duration-200`}
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            onFocus={() => setActiveField('name')}
                            onBlur={() => setActiveField(null)}
                            placeholder='Enter your name'
                        />
                    </motion.div>
                    
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='email' className="text-gray-700 font-medium">Email</label>
                        <input
                            type='email'
                            id='email'
                            className={`bg-blue-50 p-3 border ${activeField === 'email' ? 'border-green-500 ring-1 ring-green-300' : 'border-gray-300'} rounded-lg outline-none focus:border-green-500 transition-all duration-200`}
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
                        <label htmlFor='password' className="text-gray-700 font-medium">Password</label>
                        <div className={`bg-blue-50 p-3 border ${activeField === 'password' ? 'border-green-500 ring-1 ring-green-300' : 'border-gray-300'} rounded-lg flex items-center transition-all duration-200`}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                onFocus={() => setActiveField('password')}
                                onBlur={() => setActiveField(null)}
                                placeholder='Enter your password'
                            />
                            <motion.div 
                                onClick={() => setShowPassword(preve => !preve)} 
                                className='cursor-pointer text-gray-500 hover:text-green-700'
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
                    </motion.div>
                    
                    <motion.div 
                        className='grid gap-2'
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <label htmlFor='confirmPassword' className="text-gray-700 font-medium">Confirm Password</label>
                        <div className={`bg-blue-50 p-3 border ${activeField === 'confirmPassword' ? 'border-green-500 ring-1 ring-green-300' : 'border-gray-300'} rounded-lg flex items-center transition-all duration-200`}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none bg-transparent'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => setActiveField('confirmPassword')}
                                onBlur={() => setActiveField(null)}
                                placeholder='Confirm your password'
                            />
                            <motion.div 
                                onClick={() => setShowConfirmPassword(preve => !preve)} 
                                className='cursor-pointer text-gray-500 hover:text-green-700'
                                whileTap={{ scale: 0.9 }}
                            >
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye className="text-xl" />
                                    ) : (
                                        <FaRegEyeSlash className="text-xl" />
                                    )
                                }
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.button 
                        disabled={!validValue} 
                        className={` ${validValue ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"} text-white py-3 rounded-lg font-semibold my-4 tracking-wide transition-colors duration-300`}
                        whileHover={validValue ? { scale: 1.03 } : {}}
                        whileTap={validValue ? { scale: 0.98 } : {}}
                    >
                        Register
                    </motion.button>
                </form>

                <motion.p 
                    className="text-center text-gray-600 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Already have an Fine Treats account?{" "}
                    <Link 
                        to={"/login"} 
                        className='font-semibold text-green-600 hover:text-green-800 hover:underline transition-all duration-200'
                    >
                        Login
                    </Link>
                </motion.p>
            </motion.div>
        </section>
    )
}

export default Register