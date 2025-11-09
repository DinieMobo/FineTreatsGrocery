import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';


const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const searchText = params.search.slice(3)

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])


    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full  min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center text-neutral-500 dark:text-neutral-400 bg-slate-50 dark:bg-gray-700 group focus-within:border-primary-200 dark:focus-within:border-primary-300 transition-colors duration-300 '>
        <div>
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 dark:group-focus-within:text-primary-300 bg-white dark:bg-gray-600 rounded-full shadow-md transition-colors duration-300'>
                        <FaArrowLeft size={20}/>
                    </Link>
                ) :(
                    <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200 dark:group-focus-within:text-primary-300 transition-colors duration-300'>
                        <IoSearch size={22}/>
                    </button>
                )
            }
        </div>
        <div className='w-full h-full'>
            {
                !isSearchPage ? (
                     <div onClick={redirectToSearchPage} className='w-full h-full flex items-center text-gray-600 dark:text-gray-300 transition-colors duration-300'>
                        <TypeAnimation
                                sequence={[
                                'Chocolate Bars',
                                1000,
                                'Cereals',
                                1000,
                                'Noodles and Pasta',
                                1000,
                                'Snacks',
                                1000,
                                'Biscuits',
                                1000,
                                'Soft Drinks',
                                1000,
                                'Fruit Juices',
                                1000,
                                'Cheese',
                                1000,
                                'Face wash',
                                1000
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                     </div>
                ) : (
                    //when i was search page
                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for the products you like.'
                            autoFocus
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
        
    </div>
  )
}

export default Search