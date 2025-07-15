import { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/valideURLConvert'
import { motion } from 'framer-motion'
import { FaAngleRight, FaSearch } from 'react-icons/fa'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoverItem, setHoverItem] = useState(null)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCategory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(Math.ceil(responseData.totalCount / 8))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params, page])


  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })

      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  const filteredSubCategories = DisplaySubCategory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.section 
      className='sticky top-24 lg:top-20'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/**Sub Categories **/}
        <div className='bg-white rounded-lg shadow-lg min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 py-2 scrollbarCustom'>
          <div className="px-3 py-2 sticky top-0 bg-white z-10">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pt-2"
          >
            {filteredSubCategories.map((s) => {
              const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validURLConvert(s.name)}-${s._id}`
              const isActive = subCategoryId === s._id;
              
              return (
                <motion.div
                  key={s._id}
                  variants={itemVariants}
                  onMouseEnter={() => setHoverItem(s._id)}
                  onMouseLeave={() => setHoverItem(null)}
                >
                  <Link 
                    to={link} 
                    className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                      relative transition-all duration-300
                      ${isActive 
                        ? "bg-green-100 border-l-4 border-l-primary-200" 
                        : hoverItem === s._id 
                          ? "bg-green-50" 
                          : ""
                      }
                    `}
                  >
                    <div className={`w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded box-border transition-all duration-300
                      ${hoverItem === s._id ? "scale-105" : ""}
                    `}>
                      <motion.img
                        src={s.image}
                        alt={s.name}
                        className='w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                    </div>
                    {hoverItem === s._id && !isActive && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:flex"
                      >
                        <FaAngleRight className="text-primary-200" />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>


        {/**Products **/}
        <div className='sticky top-20'>
          <motion.div 
            className='bg-white shadow-md p-4 z-10 rounded-t-lg'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className='font-semibold text-lg text-primary-200'>{subCategoryName}</h3>
            <div className="h-1 w-20 bg-primary-100 mt-1 rounded-full"></div>
          </motion.div>
          
          <div>
            <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
              <motion.div 
                className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.map((p, index) => (
                  <motion.div 
                    key={p._id + "productSubCategory" + index}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="transform transition-all duration-300 hover:shadow-lg"
                  >
                    <CardProduct data={p} />
                  </motion.div>
                ))}
              </motion.div>
              
              {!loading && data.length > 0 && page < totalPage && totalPage > 1 && (
                <motion.div 
                  className="flex justify-center py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-primary-100 text-white rounded-full shadow hover:bg-primary-200 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Load More
                  </motion.button>
                </motion.div>
              )}
              
              {data.length === 0 && !loading && (
                <motion.div 
                  className="flex flex-col items-center justify-center h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png" 
                    alt="No products" 
                    className="w-24 h-24 opacity-40 mb-4"
                  />
                  <p className="text-gray-500">No products found in this category</p>
                </motion.div>
              )}
            </div>

            {loading && <Loading />}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default ProductListPage