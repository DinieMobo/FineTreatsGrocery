import React from 'react'

const CardLoading = () => {
  return (
    <div className='border border-gray-200 dark:border-gray-700 py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white dark:bg-gray-800 animate-pulse transition-colors duration-300'>
      <div className='min-h-24 bg-blue-50 dark:bg-gray-600 rounded transition-colors duration-300'>
      </div>
      <div className='p-2 lg:p-3 bg-blue-50 dark:bg-gray-600 rounded w-20 transition-colors duration-300'>
      </div>
      <div className='p-2 lg:p-3 bg-blue-50 dark:bg-gray-600 rounded transition-colors duration-300'>
      </div>
      <div className='p-2 lg:p-3 bg-blue-50 dark:bg-gray-600 rounded w-14 transition-colors duration-300'>
      </div>

      <div className='flex items-center justify-between gap-3'>
        <div className='p-2 lg:p-3 bg-blue-50 dark:bg-gray-600 rounded w-20 transition-colors duration-300'>
        </div>
        <div className='p-2 lg:p-3 bg-blue-50 dark:bg-gray-600 rounded w-20 transition-colors duration-300'>
        </div>
      </div>

    </div>
  )
}

export default CardLoading