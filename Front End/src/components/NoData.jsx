import React from 'react'
import noDataImage from '../assets/nothing not found.jpg'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center p-4 gap-2 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm transition-colors duration-300'>
      <div className='w-36 h-36 overflow-hidden rounded-full border-4 border-gray-100 dark:border-gray-700 transition-colors duration-300'>
        <img
          src={noDataImage}
          alt='no data'
          className='w-full h-full object-cover' 
        />
      </div>
      <p className='text-neutral-500 dark:text-neutral-400 transition-colors duration-300 font-medium'>No Data found!</p>
      <p className='text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300'>Try using different filters or search terms</p>
    </div>
  )
}

export default NoData