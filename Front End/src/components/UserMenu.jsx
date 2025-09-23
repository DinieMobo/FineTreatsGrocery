import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink, HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
import { MdOutlineCategory, MdSubdirectoryArrowRight } from "react-icons/md";
import { FaRegAddressCard, FaBox, FaBoxOpen, FaShoppingBag, FaCog } from "react-icons/fa";
import isAdmin from '../utils/isAdmin'
import { motion } from 'framer-motion'

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [hoveredItem, setHoveredItem] = useState(null)

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }

   const containerVariants = {
     hidden: { opacity: 0, y: -5 },
     visible: { 
       opacity: 1, 
       y: 0,
       transition: {
         staggerChildren: 0.05
       }
     }
   };

   const itemVariants = {
     hidden: { opacity: 0, x: -10 },
     visible: { opacity: 1, x: 0 }
   };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-lg transition-colors duration-300"
    >
        <motion.div 
          variants={itemVariants}
          className='flex items-center gap-3 mb-2'
        >
          {user?.profileImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-300 dark:border-orange-400">
              <img 
                src={user.profileImage} 
                alt={`${user?.name || 'User'}'s profile`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-300 dark:border-orange-400 flex items-center justify-center bg-orange-200 dark:bg-orange-300">
              <HiOutlineUser className="text-orange-600 dark:text-orange-700" size={20} />
            </div>
          )}
          <div>
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200 transition-colors duration-300">Hello, {user?.name || user?.mobile}!</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{user?.email || "Member"}</p>
          </div>
        </motion.div>

        <Divider className="my-3 bg-orange-200 dark:bg-gray-600" />

        <motion.div variants={containerVariants} className='text-sm grid gap-1'>
            <MenuItem 
              to="/dashboard/profile" 
              text="My Account" 
              icon={<HiOutlineUser />} 
              onClick={handleClose}
              isHovered={hoveredItem === "profile"}
              onHover={() => setHoveredItem("profile")}
              onLeave={() => setHoveredItem(null)}
            />
            
            {isAdmin(user.role) && (
              <MenuItem 
                to="/dashboard/category" 
                text="Categories" 
                icon={<MdOutlineCategory />} 
                onClick={handleClose}
                isHovered={hoveredItem === "category"}
                onHover={() => setHoveredItem("category")}
                onLeave={() => setHoveredItem(null)}
              />
            )}
            
            {isAdmin(user.role) && (
              <MenuItem 
                to="/dashboard/subcategory" 
                text="Sub-Categories" 
                icon={<MdSubdirectoryArrowRight />} 
                onClick={handleClose}
                isHovered={hoveredItem === "subcategory"}
                onHover={() => setHoveredItem("subcategory")}
                onLeave={() => setHoveredItem(null)}
              />
            )}
            
            {isAdmin(user.role) && (
              <MenuItem 
                to="/dashboard/upload-product" 
                text="Upload a Product" 
                icon={<FaBoxOpen />} 
                onClick={handleClose}
                isHovered={hoveredItem === "upload-product"}
                onHover={() => setHoveredItem("upload-product")}
                onLeave={() => setHoveredItem(null)}
              />
            )}
            
            {isAdmin(user.role) && (
              <MenuItem 
                to="/dashboard/product" 
                text="Products" 
                icon={<FaBox />} 
                onClick={handleClose}
                isHovered={hoveredItem === "product"}
                onHover={() => setHoveredItem("product")}
                onLeave={() => setHoveredItem(null)}
              />
            )}

            {isAdmin(user.role) && (
              <MenuItem 
                to="/dashboard/admin-orders" 
                text="Manage Orders" 
                icon={<FaCog />} 
                onClick={handleClose}
                isHovered={hoveredItem === "admin-orders"}
                onHover={() => setHoveredItem("admin-orders")}
                onLeave={() => setHoveredItem(null)}
              />
            )}
            
            <MenuItem 
              to="/dashboard/myorders" 
              text="My Orders" 
              icon={<FaShoppingBag />} 
              onClick={handleClose}
              isHovered={hoveredItem === "myorders"}
              onHover={() => setHoveredItem("myorders")}
              onLeave={() => setHoveredItem(null)}
            />
            
            <MenuItem 
              to="/dashboard/address" 
              text="Address Book" 
              icon={<FaRegAddressCard />} 
              onClick={handleClose}
              isHovered={hoveredItem === "address"}
              onHover={() => setHoveredItem("address")}
              onLeave={() => setHoveredItem(null)}
            />
            
            <motion.button 
              variants={itemVariants}
              onClick={handleLogout} 
              className={`flex items-center gap-2 w-full text-left px-3 py-2 my-1 rounded-md transition-all duration-300 group hover:bg-gradient-to-r from-red-500 to-orange-500 hover:text-white text-gray-700 dark:text-gray-200`}
              onMouseEnter={() => setHoveredItem("logout")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className={`transition-transform duration-300 ${hoveredItem === "logout" ? "rotate-12" : ""}`}>
                <HiOutlineLogout />
              </span>
              <span>Log Out</span>
              <motion.span 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ 
                  opacity: hoveredItem === "logout" ? 1 : 0,
                  scale: hoveredItem === "logout" ? 1 : 0  
                }}
                className="ml-auto"
              >
                →
              </motion.span>
            </motion.button>
        </motion.div>
    </motion.div>
  )
}

const MenuItem = ({ to, text, icon, onClick, isHovered, onHover, onLeave }) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
      <Link 
        to={to} 
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 my-1 rounded-md transition-all duration-300 text-gray-700 dark:text-gray-200 ${
          isHovered 
            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md transform translate-x-1' 
            : 'hover:bg-orange-100 dark:hover:bg-gray-600'
        }`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <span className={`transition-transform duration-300 ${isHovered ? "scale-125" : ""}`}>
          {icon}
        </span>
        <span>{text}</span>
        <motion.span 
          initial={{ opacity: 0, scale: 0 }} 
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0  
          }}
          className="ml-auto"
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default UserMenu