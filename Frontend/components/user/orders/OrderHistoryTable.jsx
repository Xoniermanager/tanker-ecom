"use client"
import React, {useEffect, useState} from 'react'
import { IoArrowForward } from "react-icons/io5";
import api from '../common/api';
import { useAuth } from '../../../context/user/AuthContext';
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


const OrderHistoryTable = ({handleViewOrder}) => {
    const [orderHistoryData, setOrderHistoryData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10)
    const [errMessage, setErrMessage] = useState(null)

    const {isAuthenticated} = useAuth()
    const getOrderHistoryData = async()=>{
              try {
                const response = await api.get(`/order?status=delivered${totalPages && `&page=${currentPage}`}${pageLimit && `&limit=${pageLimit}`}`);
                if(response.status === 200){
                    const responseData = response.data.data
                  setOrderHistoryData(responseData.data || null)
                
                }
              } catch (error) {
                const message =
                  (Array.isArray(error?.response?.data?.errors) &&
                    error.response.data.errors[0]?.message) ||
                  error?.response?.data?.message ||
                  "Something went wrong";
                setErrMessage(message);
              }
            }

            useEffect(() => {
              getOrderHistoryData()
            }, [])
            
  return (
     <div className="flex flex-col gap-8 overflow-x-scroll w-full">
              {" "}
              <table className="w-full overflow-x-scroll">
                <thead>
                  <tr className="bg-gray-100 rounded-lg">
                    <th className="p-4 text-start font-medium">Order Id</th>
                    <th className="p-4 text-start font-medium">Date</th>
                    <th className="p-4 text-start font-medium">Status</th>
                    <th className="p-4 text-start font-medium">Total</th>
                    <th className="p-4 text-start font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistoryData?.length > 0 ? (
                    orderHistoryData?.map((item, index) => {
                      const orderDate = new Date(
                        item.createdAt
                      ).toLocaleDateString();
                      return (
                        <tr
                          key={item._id}
                          className={`border-b-1 border-stone-200 ${
                            index % 2 !== 0 && "bg-stone-50"
                          } hover:bg-purple-100/50`}
                        >
                          <td className="p-4 py-6">
                            <span
                              className="font-medium text-sm text-purple-950 cursor-pointer"
                              onClick={() => handleViewOrder(item, 11)}
                            >
                              {item.orderNumber}
                            </span>
                          </td>
                          <td className="p-4 py-6">
                            <span className="bg-purple-50 px-2.5 py-1 text-purple-950 text-[12px] font-medium rounded-md">
                              {orderDate}
                            </span>
                          </td>
                          <td className="p-4 py-6">
                            <span
                              className={`${
                                item.orderStatus === "pending"
                                  ? "bg-yellow-500"
                                  : item.orderStatus === "processing"
                                  ? "bg-blue-500"
                                  :
                                   item.orderStatus === "shipped" ? "bg-purple-500" :
                                  item.orderStatus === "delivered"
                                  ? "bg-green-400"
                                  : item.orderStatus === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              } text-white px-2 py-1 text-[12px] capitalize rounded-lg `}
                            >
                              {item.orderStatus}{" "}
                            </span>
                          </td>
                          <td className="p-4 py-6">
                            <span className="text-white px-2 py-1 text-sm capitalize rounded-lg bg-green-400 tracking-wide">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </td>
                          <td>
                            <div className="relative group ">
                              <button
                                onClick={() => handleViewOrder(item, 11)}
                                className="bg-green-50 text-green-500 h-9 w-9 rounded-md flex items-center justify-center hover:bg-green-500 hover:text-white"
                              >
                                {" "}
                                <FaEye />{" "}
                              </button>
                              <AnimatePresence>
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                  }}
                                  className="hidden group-hover:block absolute top-[110%] -left-[20%] bg-green-100 text-green-500  p-1 px-3 rounded-lg text-[12px]"
                                >
                                  View Order
                                </motion.div>{" "}
                              </AnimatePresence>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center p-4">
                        {" "}
                        {isAuthenticated
                          ? "Order data not available till now"
                          : "Please login first to see your order data"}{" "}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex items-center gap-4 justify-center">
                {(orderHistoryData?.length) > 0 && [...Array(totalPages)].map((item, index) => (
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
                    orderHistoryData?.length <= 0 ||
                    Number(totalPages) === Number(currentPage)
                  }
                  className={`h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#507b86c5] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl ${
                    orderHistoryData?.length <= 0 && "hidden"
                  }`}
                  onClick={() => setCurrentPage(Number(currentPage) + 1)}
                >
                  {" "}
                  <IoArrowForward />{" "}
                </button>
              </div>
            </div>
  )
}

export default OrderHistoryTable
