import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({cancel,confirm,close}) => {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 dark:bg-black bg-opacity-70 dark:bg-opacity-80 p-4 flex justify-center items-center transition-colors duration-300'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-md p-4 rounded-lg border dark:border-gray-700 shadow-xl transition-colors duration-300'>
           <div className='flex justify-between items-center gap-3'>
                <h1 className='font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300'>Delete Category</h1>
                <button onClick={close} className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300'>
                    <IoClose size={25} />
                </button>
           </div>
           <p className='my-4 text-gray-700 dark:text-gray-300 transition-colors duration-300'>Are you sure to delete category Permanently?</p>
           <div className='w-fit ml-auto flex items-center gap-3'>
                <button onClick={cancel} className='px-4 py-1 border rounded border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors duration-300'>Cancel</button>
                <button onClick={confirm} className='px-4 py-1 border rounded border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-500 transition-colors duration-300'>Confirm</button>
           </div>
      </div>
    </div>
  )
}

export default ConfirmBox