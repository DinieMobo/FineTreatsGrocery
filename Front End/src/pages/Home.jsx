import React, { useState, useEffect, useRef } from 'react';
import banner from '../assets/banner.jpg';
import bannnerMobile2 from '../assets/banner-mobile 2.jpg';
import bannnerMobile3 from '../assets/banner-mobile 3.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import banner2 from '../assets/banner-2.jpg';
import banner3 from '../assets/banner-3.jpg';
import { useSelector } from 'react-redux';
import { validURLConvert } from '../utils/valideURLConvert';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const DEFAULT_BANNER = '/default-banner.jpg';
const DEFAULT_BANNER_MOBILE = '/default-banner-mobile.jpg';

const LoadingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-36 grid gap-2 shadow-md relative overflow-hidden border dark:border-gray-700 transition-colors duration-300">
    <div className="bg-blue-100 dark:bg-gray-600 min-h-24 rounded-lg transition-colors duration-300"></div>

    <div className="bg-blue-100 dark:bg-gray-600 h-8 rounded-lg transition-colors duration-300"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-400/30 to-transparent animate-shimmer transition-colors duration-300" 
         style={{ backgroundSize: '200% 100%' }}></div>
  </div>
);

const CategoryCard = ({ category, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="w-full h-full overflow-hidden rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 transition-colors duration-300"
      initial={{ opacity: 0.9 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
        y: -5
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-3 flex flex-col items-center">
        <div className="overflow-hidden rounded-lg mb-2 w-full aspect-square flex items-center justify-center">
          <motion.img
            src={category.image}
            className="w-full object-contain transition-all duration-300"
            alt={`Category: ${category.name}`}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ type: 'tween', duration: 0.3 }}
          />
        </div>
        <motion.div 
          className="w-full bg-blue-50 dark:bg-gray-700 rounded-lg py-2 mt-1 transition-colors duration-300"
          animate={{ 
            backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.1)' : undefined
          }}
        >
          <motion.span 
            className={`text-center block text-sm font-medium transition-colors duration-300 ${
              isHovered ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {category.name}
          </motion.span>
        </motion.div>
        
        {isHovered && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </motion.div>
  );
};

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerImages = [banner || DEFAULT_BANNER, banner2, banner3];
  const mobileBannerImages = [bannerMobile, bannnerMobile2, bannnerMobile3 || DEFAULT_BANNER_MOBILE, '/banner-mobile 2.jpg', '/banner-mobile 3.jpg'];
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (bannerRef.current) {
      const { left, top, width, height } = bannerRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) - 0.5;
      const y = ((e.clientY - top) / height) - 0.5;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData?.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    if (!subcategory) {
      console.error('No matching subcategory found');
      toast.error("Category not found. Please try another one.");
      return;
    }

    const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);
  };

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Enhanced Banners with Parallax */}
      <div className="container mx-auto p-4">
        <motion.div
          ref={bannerRef}
          className="relative w-full overflow-hidden rounded-xl shadow-lg"
          style={{ minHeight: '250px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
            {bannerImages.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300`}
                animate={{ 
                  scale: currentBannerIndex === idx ? 1.3 : 1,
                  backgroundColor: currentBannerIndex === idx ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.5)'
                }}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Banner for Desktop */}
          <div className="hidden lg:block">
            {bannerImages.map((img, idx) => (
              <motion.div
                key={idx}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  display: currentBannerIndex === idx ? 'block' : 'none',
                }}
              >
                <motion.img
                  src={img}
                  className="w-full h-full object-cover transition-opacity duration-1000"
                  alt={`Banner slide ${idx + 1}`}
                  animate={{ 
                    x: mousePosition.x * -15, 
                    y: mousePosition.y * -15,
                    scale: 1.05 
                  }}
                  transition={{ type: 'spring', stiffness: 75, damping: 25 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Banner for Mobile */}
          <div className="lg:hidden">
            {mobileBannerImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className={`absolute top-0 left-0 w-full h-[250px] object-cover transition-opacity duration-1000 ${
                  currentBannerIndex === idx ? 'opacity-100' : 'opacity-0'
                }`}
                alt={`Banner slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Categories Section */}
      <div className="container mx-auto px-4 my-8">
        <motion.h2 
          className="text-2xl font-semibold mb-6 text-gray-800 relative inline-block"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="relative z-10">Shop by Category</span>
          <motion.span 
            className="absolute -bottom-1 left-0 h-1 bg-yellow-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.6, duration: 0.5 }}
          ></motion.span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
        >
          {loadingCategory ? (
            new Array(12).fill(null).map((_, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ))
          ) : (
            categoryData?.map((cat, index) => (
              <motion.div 
                key={`${cat._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CategoryCard
                  category={cat}
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Products filtered by Category with enhanced hover effects */}
      <div className="space-y-12 mb-12">
        {categoryData?.map((c, index) => (
          <motion.div 
            key={`${c?._id}-CategorywiseProduct`}
            className="py-6 px-4 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ backgroundColor: 'rgba(239, 246, 255, 0.7)' }}
          >
            <motion.div 
              className="absolute inset-x-0 h-0.5 bg-blue-100 top-0" 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (0.1 * index) }}
            />
            
            <div className="container mx-auto">
              <CategoryWiseProductDisplay
                id={c?._id}
                name={c?.name}
              />
            </div>
            
            <motion.div 
              className="absolute inset-x-0 h-0.5 bg-blue-100 bottom-0" 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (0.1 * index) }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Home;