import React from 'react'
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({close,value,onChange,submit}) => {
  return (
   <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 z-50 flex justify-center items-center p-4'>
        <div className='bg-white dark:bg-gray-800 rounded p-4 w-full max-w-md transition-colors duration-300'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300'>Add Field</h1>
                <button onClick={close} className='text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300'>
                    <IoClose size={25}/>
                </button>
            </div>
            <input
                 className='bg-blue-50 dark:bg-gray-700 dark:text-gray-100 my-3 p-2 border border-gray-300 dark:border-gray-600 outline-none focus-within:border-primary-100 dark:focus-within:border-primary-200 rounded w-full transition-colors duration-300'
                 placeholder='Enter field name'
                 value={value}
                 onChange={onChange}
            />
            <button
                onClick={submit}
                className='bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded mx-auto w-fit block text-gray-900 transition-colors duration-300'
            >Add Field</button>
        </div>
   </section>
  )
}

export default AddFieldComponent