import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t shadow-inner bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 transition-colors duration-300'>
        <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
            <p className='text-gray-700 dark:text-gray-300 transition-colors duration-300'>©2025 Fine Treats Grocery (Pvt) Ltd. All Rights Reserved.</p>

            <div className='flex items-center gap-4 justify-center text-2xl'>
                <a href='https://www.facebook.com' className='hover:text-primary-100 dark:hover:text-primary-200 text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                    <FaFacebook/>
                </a>
                <a href='https://www.instagram.com' className='hover:text-primary-100 dark:hover:text-primary-200 text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                    <FaInstagram/>
                </a>
                <a href='https://www.youtube.com' className='hover:text-primary-100 dark:hover:text-primary-200 text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                    <FaYoutube/>
                </a>
                <a href='https://www.tiktok.com' className='hover:text-primary-100 dark:hover:text-primary-200 text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                    <FaTiktok/>
                </a>
                <a href='https://www.threads.net' className='hover:text-primary-100 dark:hover:text-primary-200 text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                    <FaThreads/>
                </a>
                <a href='https://www.linkedin.com' className='hover:text-primary-100 dark:hover:text-primary-200 text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                    <FaLinkedin/>
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer