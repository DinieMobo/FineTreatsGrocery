import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'



const DisplayTable = ({ data, column }) => {
  const table = useReactTable({
    data,
    columns : column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
    <table className='w-full py-0 px-0 border-collapse'>
      <thead className='bg-black dark:bg-gray-800 text-white dark:text-gray-100 transition-colors duration-300'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            <th className='border border-gray-300 dark:border-gray-600 px-2 py-1 transition-colors duration-300'>Sr.No</th>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='border border-gray-300 dark:border-gray-600 whitespace-nowrap px-2 py-1 transition-colors duration-300'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'>
        {table.getRowModel().rows.map((row,index) => (
          <tr key={row.id}>
            <td className='border border-gray-300 dark:border-gray-600 px-2 py-1 transition-colors duration-300'>{index+1}</td>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='border border-gray-300 dark:border-gray-600 px-2 py-1 whitespace-nowrap transition-colors duration-300'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="h-4" />
  </div>
  )
}

export default DisplayTable