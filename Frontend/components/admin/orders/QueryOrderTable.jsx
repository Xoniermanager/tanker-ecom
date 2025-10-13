'use client'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { FaEye } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { BsCartX } from "react-icons/bs";
import Link from 'next/link';
import { ORDER_STATUS } from '../../../constants/enums';



const QueryOrderTable = ({orderData, setTotalPages, totalPages, currentPage, setCurrentPage, setPageLimit, setOrderStatus, orderStatus}) => {
  return (
    <div className="min-h-screen bg-[#f4f2ff] p-6">
      
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-black">Query Orders List</h2>
        <div className="text-sm text-gray-500 mt-1">
          <span className="text-orange-500 mr-1">Admin</span> &gt; Query Orders
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button className="text-sm px-4 py-2 rounded-md "> {(orderStatus === "") ?  "All Orders" : (orderStatus === "pending") ? "Pending Orders" : (orderStatus === "processing") ? "Orders Under Processing" : (orderStatus === "shipped") ? "Shipped Orders" : (orderStatus === "delivered") ? "Delivered orders" : (orderStatus === "cancelled") ? "Cancelled Orders" : "Orders"}</button>

          <select className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-500 capitalize" onChange={(e)=>setOrderStatus(e.target.value)}>
            <option hidden>Sort by Status</option>
            <option value="">All</option>
            <option value='pending' >pending</option>
            <option value='processing' >processing</option>
            <option value='shipped' >shipped</option>
            <option value='delivered' >delivered</option>
            <option value='cancelled' >cancelled</option>
          </select>

          <select className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-500" onClick={(e)=>setPageLimit(e.target.value)}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>

          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 text-sm pl-4 pr-10 py-2 rounded-md w-52 outline-none"
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div> */}
        </div>

        {/* <div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-md">
            Actions ⌄
          </button>
        </div> */}
      </div>

     
      <div className="rounded-xl overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left border-separate border-spacing-y-4">
          <thead className="bg-[#f4f2ff]  uppercase text-xs">
            <tr>
              {/* <th className="px-6 py-4">
                <input type="checkbox" />
              </th> */}
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {orderData?.length > 0 ? orderData.map((order, index) => (
              <tr key={index} className="bg-white rounded-xl overflow-hidden shadow">
                {/* <td className="px-6 py-6">
                  <input type="checkbox" />
                </td> */}
                <td className="px-6 py-6 "><Link href={`orders/detail/${order._id}`} className='text-red-500  font-semibold hover:text-rose-600'>  {order.orderNumber} </Link></td>
                <td className="px-6 py-6 capitalize"><Link href={`/admin/customers/${order.user}`}> {order.firstName} {order.lastName} </Link></td>
                <td className="px-6 py-6"><span className='text-white bg-purple-900 px-3 py-1 text-[12px] rounded-lg'>{new Date(order.createdAt).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })}</span></td>
                <td className="px-6 py-6"> <span className='bg-green-50 text-green-500 px-3 py-1 text-sm rounded-lg'>$ {order.totalPrice.toFixed(2)}</span></td>
                <td className="px-6 py-6">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                                order.orderStatus === ORDER_STATUS.PENDING
                                  ? "bg-yellow-500"
                                  : order.orderStatus === ORDER_STATUS.PROCESSING
                                  ? "bg-blue-500"
                                  :  order.orderStatus === ORDER_STATUS.SHIPPED ? "bg-purple-500" :
                                  order.orderStatus === ORDER_STATUS.DELIVERED
                                  ? "bg-green-500"
                                  : order.orderStatus === ORDER_STATUS.CANCELLED
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              } text-white capitalize`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-6 text-xl text-gray-500">
                  <Link href={`orders/detail/${order._id}`} className='flex items-center justify-center h-8 w-8 rounded-lg text-white bg-orange-500 hover:bg-orange-600' ><FaEye /></Link>
                </td>
              </tr>
            )): (
              <tr className='bg-white rounded-xl overflow-hidden shadow'>
                <td colSpan={6} className='p-4 text-center'> <p className='flex items-center gap-2 justify-center'> <BsCartX className='text-lg text-orange-400'/> Order Data not found </p> </td>
              </tr>
            )}
          </tbody>
        </table>
         <div className="flex items-center gap-4 justify-center mt-6">
                        {[...Array(totalPages)].map((item, index) => (
                          <button
                            className={` ${
                              currentPage === index + 1
                                ? "bg-orange-400 text-white"
                                : "bg-[#f6e7d3]"
                            } hover:bg-orange-400 hover:text-white  h-12 w-12 rounded-full border-white text-purple-950  font-bold border-1 border-dashed text-lg`}
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          disabled={
                            orderData?.length <= 0 ||
                            Number(totalPages) === Number(currentPage)
                          }
                          className={`h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#507b86c5] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl ${
                            orderData?.length <= 0 && "hidden"
                          }`}
                          onClick={() => setCurrentPage(Number(currentPage) + 1)}
                        >
                          {" "}
                          <IoArrowForward />{" "}
                        </button>
                      </div>


      </div>
    </div>
  )
}

export default QueryOrderTable
