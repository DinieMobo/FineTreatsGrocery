import React from 'react'
import noDataImage from '../assets/nothing not found.jpg'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center p-4 gap-2'>
      <img
        src={noDataImage}
        alt='no data'
        className='w-36' 
      />
      <p className='text-neutral-500'>No Data found!</p>
    </div>
  )
}

export default NoData