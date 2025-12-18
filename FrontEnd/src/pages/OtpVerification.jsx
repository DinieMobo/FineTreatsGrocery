import React, { useEffect, useRef, useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    console.log("location",location)

    useEffect(()=>{
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    },[])

    const validValue = data.every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data : {
                    otp : data.join(""),
                    email : location?.state?.email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password",{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                })
            }

        } catch (error) {
            console.log('error',error)
            AxiosToastError(error)
        }



    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white dark:bg-gray-800 my-4 w-full max-w-lg mx-auto rounded p-7 shadow-md border dark:border-gray-700 transition-colors duration-300'>
                <p className='font-semibold text-lg dark:text-white'>Enter OTP</p>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='otp' className='dark:text-gray-200'>Enter Your OTP :</label>
                        <div className='flex items-center gap-2 justify-between mt-3'>
                            {
                                data.map((element,index)=>{
                                    return(
                                        <input
                                            key={"otp"+index}
                                            type='text'
                                            id='otp'
                                            ref={(ref)=>{
                                                inputRef.current[index] = ref
                                                return ref 
                                            }}
                                            value={data[index]}
                                            onChange={(e)=>{
                                                const value =  e.target.value
                                                console.log("value",value)

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if(value && index < 5){
                                                    inputRef.current[index+1].focus()
                                                }


                                            }}
                                            maxLength={1}
                                            className='bg-blue-50 dark:bg-gray-700 w-full max-w-16 p-2 border dark:border-gray-600 rounded outline-none focus:border-primary-200 dark:focus:border-primary-400 text-center font-semibold dark:text-white transition-colors duration-300'
                                        />
                                    )
                                })
                            }
                        </div>
                        
                    </div>
             
                    <button disabled={!validValue} className={` ${validValue ? "bg-green-800 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600" : "bg-gray-500 dark:bg-gray-600" }    text-white py-2 rounded font-semibold my-3 tracking-wide transition-colors duration-300`}>Verify OTP</button>

                </form>

                <p className='dark:text-gray-300'>
                    Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300'>Login</Link>
                </p>
            </div>
        </section>
    )
}

export default OtpVerification



