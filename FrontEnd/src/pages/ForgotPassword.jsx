import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
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

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })
                
            }

        } catch (error) {
            AxiosToastError(error)
        }



    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white dark:bg-gray-800 my-4 w-full max-w-lg mx-auto rounded p-7 shadow-md border dark:border-gray-700 transition-colors duration-300'>
                <p className='font-semibold text-lg dark:text-white transition-colors duration-300'>Forgot Password </p>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email' className='dark:text-gray-200 transition-colors duration-300'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 dark:bg-gray-700 dark:text-white p-2 border dark:border-gray-600 rounded outline-none focus:border-primary-200 dark:focus:border-primary-400 transition-colors duration-300'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                        />
                    </div>
             
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "bg-gray-500 dark:bg-gray-600" }    text-white py-2 rounded font-semibold my-3 tracking-wide transition-colors duration-300`}>Send Otp</button>

                </form>

                <p className='dark:text-gray-300 transition-colors duration-300'>
                    Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400 transition-colors duration-300'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default ForgotPassword