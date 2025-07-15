import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { LuPencil } from "react-icons/lu";
import { MdDelete, MdAdd } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { FaImage, FaEye } from "react-icons/fa";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({
    _id: ""
  })
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: "Name",
      cell: ({ row }) => (
        <div
          className="font-medium text-gray-800 py-2 px-3 rounded-md transition-colors duration-200"
          style={{
            backgroundColor: hoveredRow === row.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
          }}
        >
          {row.original.name}
        </div>
      )
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className='flex justify-center items-center p-1'>
            <div className="relative group">
              <div
                className="w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-blue-400 hover:shadow-lg cursor-pointer"
                onClick={() => setImageURL(row.original.image)}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <img
                  src={row.original.image}
                  alt={row.original.name}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <FaEye className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        )
      }
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-2 py-2">
            {
              row.original.category.map((c, index) => {
                return (
                  <span
                    key={c._id + "table"}
                    className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-sm font-medium rounded-full border border-blue-100 transition-all duration-300 hover:shadow-md hover:scale-105"
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {c.name}
                  </span>
                )
              })
            }
          </div>
        )
      }
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-center gap-2'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setOpenEdit(true)
                setEditData(row.original)
              }}
              className='p-2 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full text-green-600 hover:text-white hover:bg-gradient-to-br hover:from-emerald-400 hover:to-green-500 transition-all duration-300 shadow-sm hover:shadow-md'
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <HiPencil size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategory(row.original)
              }}
              className='p-2 bg-gradient-to-br from-rose-50 to-red-100 rounded-full text-red-500 hover:text-white hover:bg-gradient-to-br hover:from-rose-400 hover:to-red-500 transition-all duration-300 shadow-sm hover:shadow-md'
              onMouseEnter={() => setHoveredRow(row.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <MdDelete size={18} />
            </motion.button>
          </div>
        )
      }
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4'
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className='p-4 bg-white rounded-lg shadow-md flex items-center justify-between mb-6 sticky top-0 z-10'
      >
        <h2 className='font-bold text-xl text-gray-800 flex items-center'>
          <span className="inline-block w-2 h-6 bg-yellow-500 rounded-full mr-2"></span>
          Sub-Categories Management
        </h2>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenAddSubCategory(true)} 
          className='text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-1'
        >
          <MdAdd size={20} />
          Add Sub Category
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='bg-white rounded-lg shadow-md p-4 overflow-hidden'
      >
        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className='overflow-auto w-full max-w-[95vw] rounded-lg'>
            <DisplayTable
              data={data}
              column={column}
            />
            {data.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <FaImage className="mx-auto text-gray-300 text-5xl mb-3" />
                <p className="text-lg">No sub-categories available</p>
                <p className="text-sm">Add a new sub-category to get started</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {openAddSubCategory && (
          <UploadSubCategoryModel
            close={() => setOpenAddSubCategory(false)}
            fetchData={fetchSubCategory}
          />
        )}

        {ImageURL && (
          <ViewImage url={ImageURL} close={() => setImageURL("")} />
        )}

        {openEdit && (
          <EditSubCategory
            data={editData}
            close={() => setOpenEdit(false)}
            fetchData={fetchSubCategory}
          />
        )}

        {openDeleteConfirmBox && (
          <ConfirmBox
            title="Delete Sub-Category"
            message={`Are you sure you want to delete "${deleteSubCategory.name}"?`}
            cancel={() => setOpenDeleteConfirmBox(false)}
            close={() => setOpenDeleteConfirmBox(false)}
            confirm={handleDeleteSubCategory}
          />
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default SubCategoryPage
