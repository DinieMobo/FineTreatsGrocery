import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCartShopping } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
    const { totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <>
        {
            cartItem[0] && (
            <div className='sticky bottom-4 p-2'>
            <div className='bg-green-600 dark:bg-green-700 px-2 py-1 rounded text-neutral-100 text-sm flex items-center justify-between gap-3 lg:hidden transition-colors duration-300'>
                    <div className='flex items-center gap-2'>
                        <div className='p-2 bg-green-500 dark:bg-green-600 rounded w-fit transition-colors duration-300'>
                            <FaCartShopping/>
                        </div>
                        <div className='text-xs'>
                                <p>{totalQty} items</p>
                                <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                    </div>

                    <Link to={"/cart"} className='flex items-center gap-1 hover:text-green-200 transition-colors duration-300'>
                        <span className='text-sm'>View Cart</span>
                        <FaCaretRight/>
                    </Link>
                </div>
            </div>
            )
        }
    </>
    
  )
}

export default CartMobileLink