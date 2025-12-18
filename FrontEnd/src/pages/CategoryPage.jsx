import React, { useEffect, useState } from 'react';
import UploadCategoryModel from '../components/UploadCategoryModel';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import EditCategory from '../components/EditCategory';
import ConfirmBox from '../components/ConfirmBox';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaPlus, FaPencilAlt, FaTrash, FaEye } from 'react-icons/fa';

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    });
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    });
    const [hoveredCard, setHoveredCard] = useState(null);
    const allCategory = useSelector(state => state.product.allCategory);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [showCursor, setShowCursor] = useState(false);

    useEffect(() => {
        setCategoryData(allCategory);
    }, [allCategory]);
    
    const fetchCategory = async() => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getCategory
            });
            const { data: responseData } = response;

            if(responseData.success) {
                setCategoryData(responseData.data);
            }
            
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleDeleteCategory = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            });

            const { data: responseData } = response;

            if(responseData.success) {
                toast.success(responseData.message);
                fetchCategory();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring",
                damping: 15 
            }
        }
    };

    return (
        <motion.section 
            className='relative min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-300'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => setShowCursor(true)}
            onMouseLeave={() => setShowCursor(false)}
        >
            {/* Custom cursor effect */}
            <AnimatePresence>
                {showCursor && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.15 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed w-20 h-20 rounded-full bg-yellow-500 pointer-events-none z-50"
                        style={{ 
                            left: cursorPosition.x - 40, 
                            top: cursorPosition.y - 40,
                            mixBlendMode: 'multiply'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                )}
            </AnimatePresence>
            
            {/* Background grid decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
            </div>
            
            {/* Header section */}
            <motion.div 
                className='p-4 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg flex items-center justify-between mb-6 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 transition-colors duration-300'
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <motion.h2 
                    className='font-bold text-xl text-gray-800 dark:text-gray-200 flex items-center transition-colors duration-300'
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <motion.span 
                        className='inline-block w-2 h-6 bg-yellow-500 dark:bg-yellow-400 rounded-full mr-2 transition-colors duration-300'
                        animate={{ 
                            height: [24, 20, 24],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    ></motion.span>
                    Categories Management
                </motion.h2>
                <motion.button 
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenUploadCategory(true)} 
                    className='text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <FaPlus className="text-white" />
                    Add Category
                </motion.button>
            </motion.div>

            {!categoryData[0] && !loading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <NoData />
                </motion.div>
            )}

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5'
            >
                {categoryData.map((category, index) => (
                    <motion.div
                        variants={cardVariants}
                        key={category._id}
                        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg overflow-hidden transition-all duration-300 border dark:border-gray-700"
                        onMouseEnter={() => setHoveredCard(category._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        whileHover={{ 
                            y: -8, 
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {/* Overlay gradient on hover */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/60 dark:to-blue-800/70 z-10 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredCard === category._id ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />

                        <div className='p-4 flex flex-col items-center'>
                            <motion.div 
                                className='w-full h-40 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-600 mb-3 transition-colors duration-300'
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.img 
                                    alt={category.name}
                                    src={category.image}
                                    className="w-full h-full object-contain p-2"
                                    initial={{ scale: 1 }}
                                    animate={{ 
                                        scale: hoveredCard === category._id ? 1.1 : 1,
                                        y: hoveredCard === category._id ? -3 : 0
                                    }}
                                    transition={{ duration: 0.4 }}
                                />
                            </motion.div>
                            <motion.h3 
                                className="text-center font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200 transition-colors duration-300"
                                animate={{ 
                                    color: hoveredCard === category._id ? "#2563eb" : undefined,
                                    y: hoveredCard === category._id ? -2 : 0
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {category.name}
                            </motion.h3>
                            
                            {/* Action buttons with reveal effect on hover */}
                            <AnimatePresence>
                                {hoveredCard === category._id && (
                                    <motion.div 
                                        className="w-full flex gap-2 z-20 relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    >
                                        <motion.button 
                                            whileHover={{ scale: 1.08, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setOpenEdit(true);
                                                setEditData(category);
                                            }} 
                                            className='flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-medium py-2.5 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5'
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            <FaPencilAlt size={14} />
                                            Edit
                                        </motion.button>
                                        <motion.button 
                                            whileHover={{ scale: 1.08, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setOpenConfirmBoxDelete(true);
                                                setDeleteCategory(category);
                                            }} 
                                            className='flex-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium py-2.5 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5'
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            <FaTrash size={14} />
                                            Delete
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* View icon indicator on hover */}
                            <AnimatePresence>
                                {hoveredCard === category._id && (
                                    <motion.div 
                                        className="absolute top-3 right-3 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg z-20"
                                        initial={{ opacity: 0, scale: 0, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0, rotate: 45 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                    >
                                        <FaEye className="text-blue-500 dark:text-blue-400" size={16} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {loading && <Loading />}

            <AnimatePresence>
                {openUploadCategory && (
                    <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
                )}

                {openEdit && (
                    <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
                )}

                {openConfirmBoxDelete && (
                    <ConfirmBox
                        title="Delete Category"
                        message={`Are you sure you want to delete "${deleteCategory.name}"?`}
                        cancel={() => setOpenConfirmBoxDelete(false)}
                        close={() => setOpenConfirmBoxDelete(false)}
                        confirm={handleDeleteCategory}
                    />
                )}
            </AnimatePresence>
            
            {/* Add styles for grid pattern background */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-size: 25px 25px;
                    background-image: 
                        linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
                }
            `}</style>
        </motion.section>
    );
};

export default CategoryPage;