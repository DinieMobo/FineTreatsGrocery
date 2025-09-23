import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({url,close}) => {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 dark:bg-black bg-opacity-70 dark:bg-opacity-80 flex justify-center items-center z-50 p-4 transition-colors duration-300'>
        <div className='w-full max-w-md max-h-[80vh] p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-xl transition-colors duration-300'>
            <button onClick={close} className='w-fit ml-auto block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300'>
                <IoClose size={25}/>
            </button>
            <img 
                src={url}
                alt='full screen'
                className='w-full h-full object-scale-down'
            />
        </div>
    </div>
  )
}

export default ViewImage