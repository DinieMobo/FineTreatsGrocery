import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data,setData] = useState({
    email : "",
    newPassword : "",
    confirmPassword : ""
  })
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)

  const validValue = Object.values(data).every(el => el)

  useEffect(()=>{
    if(!(location?.state?.data?.success)){
        navigate("/")
    }

    if(location?.state?.email){
        setData((preve)=>{
            return{
                ...preve,
                email : location?.state?.email
            }
        })
    }
  },[])

  const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

  console.log("data reset password",data)

  const handleSubmit = async(e)=>{
    e.preventDefault()

    ///optional 
    if(data.newPassword !== data.confirmPassword){
        toast.error("New password and confirm password must be same.")
        return
    }

    try {
        const response = await Axios({
            ...SummaryApi.resetPassword, //change
            data : data
        })
        
        if(response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success){
            toast.success(response.data.message)
            navigate("/login")
            setData({
                email : "",
                newPassword : "",
                confirmPassword : ""
            })
            
        }

    } catch (error) {
        AxiosToastError(error)
    }



}

  return (
    <section className='w-full container mx-auto px-2'>
            <div className='bg-white dark:bg-gray-800 my-4 w-full max-w-lg mx-auto rounded p-7 shadow-md border dark:border-gray-700 transition-colors duration-300'>
                <p className='font-semibold text-lg dark:text-white transition-colors duration-300'>Enter Your Password </p>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='newPassword' className='dark:text-gray-200 transition-colors duration-300'>New Password :</label>
                        <div className='bg-blue-50 dark:bg-gray-700 p-2 border dark:border-gray-600 rounded flex items-center focus-within:border-primary-200 dark:focus-within:border-primary-400 transition-colors duration-300'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent dark:text-white transition-colors duration-300'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword' className='dark:text-gray-200 transition-colors duration-300'>Confirm Password :</label>
                        <div className='bg-blue-50 dark:bg-gray-700 p-2 border dark:border-gray-600 rounded flex items-center focus-within:border-primary-200 dark:focus-within:border-primary-400 transition-colors duration-300'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none bg-transparent dark:text-white transition-colors duration-300'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword(preve => !preve)} className='cursor-pointer dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                    </div>
             
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "bg-gray-500 dark:bg-gray-600" }    text-white py-2 rounded font-semibold my-3 tracking-wide transition-colors duration-300`}>Change Password</button>

                </form>

                <p className='dark:text-gray-300 transition-colors duration-300'>
                    Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300'>Login</Link>
                </p>
            </div>
        </section>
  )
}

export default ResetPassword