import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'
import Select from 'react-select'
import countryList from 'react-select-country-list'

const AddAddress = ({close}) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()
    const { fetchAddress } = useGlobalContext()
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [countryOptions] = useState(countryList().getData())

    const onSubmit = async(data)=>{
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data : {
                    address_line1 :data.addressline1,
                    address_line2 : data.addressline2,
                    city : data.city,
                    state : data.state,
                    country : selectedCountry ? selectedCountry.label : data.country,
                    zipcode : data.zipcode,
                    phone : data.phone
                }
            })

            const { data : responseData } = response
            
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
    <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
        <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
            <div className='flex justify-between items-center gap-4'>
                <h2 className='font-semibold'>Add Address</h2>
                <button onClick={close} className='hover:text-red-500'>
                    <IoClose  size={25}/>
                </button>
            </div>
            <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-1'>
                    <label htmlFor='address_line1'>Address Line 1:</label>
                    <input
                        type='text'
                        id='addressline1' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("address_line1",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='address_line2'>Address Line 2:</label>
                    <input
                        type='text'
                        id='address_line2' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("address_line2",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='city'>City :</label>
                    <input
                        type='text'
                        id='city' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("city",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='state'>State :</label>
                    <input
                        type='text'
                        id='state' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("state",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='zipcode'>Zipcode :</label>
                    <input
                        type='text'
                        id='zipcode' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("zipcode",{required : true})}
                    />
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='country'>Country :</label>
                    <Select
                        id='country'
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={option => {
                            setSelectedCountry(option)
                            setValue('country', option.label)
                        }}
                        classNamePrefix="react-select"
                        placeholder="Select a country"
                        isSearchable
                    />
                    {/* Hidden input for react-hook-form */}
                    <input
                        type='hidden'
                        {...register("country", {required: true})}
                        value={selectedCountry ? selectedCountry.label : ''}
                        readOnly
                    />
                    {errors.country && <p className="text-red-500 text-xs mt-1">Please select a country</p>}
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='phone'>Phone No. :</label>
                    <input
                        type='text'
                        id='phone' 
                        className='border bg-blue-50 p-2 rounded'
                        {...register("phone", {
                            required: true,
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Please enter a valid phone number"
                            }
                        })}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <button type='submit' className='bg-primary-200 w-full  py-2 font-semibold mt-4 hover:bg-primary-100'>Submit</button>
            </form>
        </div>
    </section>
  )
}

export default AddAddress