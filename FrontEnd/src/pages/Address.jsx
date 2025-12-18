import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import { MdDelete, MdAdd, MdLocationOn } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';
import { motion, AnimatePresence } from 'framer-motion';

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()
  const [hoveredCard, setHoveredCard] = useState(null)

  const handleDisableAddress = async(id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })
      if(response.data.success){
        toast.success("Address Removed Successfully")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='max-w-5xl mx-auto'
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className='bg-white dark:bg-gray-800 shadow-lg px-4 py-3 flex justify-between gap-4 items-center rounded-lg mb-4'
      >
        <h2 className='font-semibold text-xl flex items-center gap-2 dark:text-white'>
          <MdLocationOn className="text-blue-500" size={24}/>
          <span>Address Book</span>
        </h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenAddress(true)} 
          className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2'
        >
          <MdAdd />
          Add Address
        </motion.button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg shadow-md grid gap-4'
      >
        {addressList.filter(address => address.status).length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 text-gray-500 dark:text-gray-400"
          >
            <FaHome className="mx-auto text-gray-300 dark:text-gray-600 text-6xl mb-3" />
            <p className="text-lg">No addresses found</p>
            <p className="text-sm mb-4">Add your first address to get started</p>
          </motion.div>
        )}
        
        {addressList.map((address, index) => {
          if (!address.status) return null;
          return (
            <motion.div 
              key={address._id || index}
              variants={cardVariants}
              className={`relative border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-all duration-300 ${
                hoveredCard === address._id ? 'shadow-lg transform scale-[1.01]' : 'shadow-sm'
              }`}
              onMouseEnter={() => setHoveredCard(address._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Border accent */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-yellow-500 rounded-l-lg transition-all duration-300 ${
                hoveredCard === address._id ? 'h-full' : 'h-[30%]'
              }`}></div>
              
              <div className='flex gap-4'>
                <div className='w-full pl-3'>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {address.address_line1}
                    </h3>
                    <div className={`flex gap-2 transition-opacity duration-300 ${
                      hoveredCard === address._id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setOpenEdit(true)
                          setEditData(address)
                        }} 
                        className='bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900 dark:to-green-800 p-2 rounded-full text-green-600 dark:text-green-400 hover:text-white hover:bg-gradient-to-br hover:from-emerald-400 hover:to-green-500 transition-all duration-300 shadow-sm hover:shadow-md'
                      >
                        <MdEdit size={18}/>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDisableAddress(address._id)} 
                        className='bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-900 dark:to-red-800 p-2 rounded-full text-red-500 dark:text-red-400 hover:text-white hover:bg-gradient-to-br hover:from-rose-400 hover:to-red-500 transition-all duration-300 shadow-sm hover:shadow-md'
                      >
                        <MdDelete size={18}/>  
                      </motion.button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300">{address.address_line2}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="text-blue-500">•</span> {address.city}, {address.state}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="text-blue-500">•</span> {address.country}, {address.zipcode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1 font-medium">
                      <span className="text-blue-500">•</span> {address.phone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenAddress(true)} 
          className='h-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-blue-300 dark:border-blue-700 flex justify-center items-center cursor-pointer rounded-lg gap-2 text-blue-500 hover:text-blue-600 transition-all duration-300'
        >
          <MdAdd size={24} />
          <span className="font-medium">Add New Address</span>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {openAddress && (
          <AddAddress close={() => setOpenAddress(false)}/>
        )}

        {OpenEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)}/>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Address
