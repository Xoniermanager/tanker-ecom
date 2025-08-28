"use client"
import React, {useState, useEffect} from 'react'
import { useOrder } from '../../../context/order/OrderContext';
import { FaEye } from "react-icons/fa";
import { TbTruckLoading } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetail from './OrderDetail';
import { FaHistory } from "react-icons/fa";

const OrderTable = () => {
  const [active, setActive] = useState(1);
  const [viewOrderData, setViewOrderData] = useState(null);

  const {orderData, orderCount} = useOrder();

  const handleViewOrder = (item, number) =>{
    setViewOrderData(item)
    setActive(number)
  }


  return (
    <>
      <div className="py-24 max-w-7xl mx-auto flex items-start gap-10 ">
         <div className="w-1/4 sticky top-34">
           <ul className='border-1 border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-sky-50/10'>
            <li className={`px-6 py-3 ${(active === 1 || active === 11) ? "bg-[#16a34a12] text-orange-400 border-l-3 border-orange-400" : "hover:bg-slate-50"} cursor-pointer font-medium rounded-lg flex items-center gap-2`} onClick={()=>setActive(1)}> <TbTruckLoading /> Orders </li>
            <li className={`px-7 py-3 ${active === 2 ? "bg-[#16a34a12] text-orange-400 border-l-3 border-orange-400" : "hover:bg-slate-50"} cursor-pointer font-medium rounded-lg flex items-center gap-2`} onClick={()=>setActive(2)}> <FaRegAddressCard/> Address </li>
            <li className={`px-7 py-3 ${active === 3 ? "bg-[#16a34a12] text-orange-400 border-l-3 border-orange-400" : "hover:bg-slate-50"} cursor-pointer font-medium rounded-lg flex items-center gap-2`} onClick={()=>setActive(3)}> <FaHistory /> Order History </li>
           </ul>
         </div>
         <div className="w-3/4">
            {active === 1 && <table className='w-full'>
              <thead>
                <tr className='bg-gray-100 rounded-lg'>
                  <th  className='p-4 text-start'>Order Id</th>
                  <th className='p-4 text-start'>Date</th>
                  <th className='p-4 text-start'>Status</th>
                  <th className='p-4 text-start'>Total</th>
                  <th className='p-4 text-start'>Action</th>
                </tr>
              </thead>
              <tbody>
                {orderData ? orderData?.map((item, index)=>{
               const orderDate = new Date(item.createdAt).toLocaleDateString()
              return <tr key={item._id} className={`border-b-1 border-stone-200 ${((index % 2) !== 0) && "bg-stone-50"} hover:bg-purple-100/50`}>
                  <td className='p-4 py-6'><span className='font-medium text-sm text-purple-950 cursor-pointer' onClick={()=>handleViewOrder(item, 11)}>{item.orderNumber}</span></td>
                  <td className='p-4 py-6'><span className='bg-purple-50 px-2.5 py-1 text-purple-950 text-[12px] font-medium rounded-md'>{orderDate}</span></td>
                  <td className='p-4 py-6'><span className={`${
                      item.orderStatus === "pending" ? "bg-yellow-500" :
                      item.orderStatus === "failed" ? "bg-blue-500" :
                      // item.orderStatus === "shipped" ? "bg-purple-500" :
                      item.orderStatus === "success" ? "bg-green-500" :
                      item.orderStatus === "cancelled" ? "bg-red-500" :
                      "bg-gray-500"
                    } text-white px-2 py-1 text-[12px] capitalize rounded-lg `}>{item.orderStatus} </span></td>
                  <td className='p-4 py-6'>
                    <span className='text-white px-2 py-1 text-sm capitalize rounded-lg bg-green-400 tracking-wide'>${item.totalPrice.toFixed(2)}</span>
                  </td>
                  <td>
                    <div className='relative group '>
                    <button onClick={()=>handleViewOrder(item, 11)} className='bg-green-50 text-green-500 h-9 w-9 rounded-md flex items-center justify-center hover:bg-green-500 hover:text-white'> <FaEye /> </button>
                    <AnimatePresence>
                    <motion.div initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }} className='hidden group-hover:block absolute top-[110%] -left-[20%] bg-green-100 text-green-500  p-1 px-3 rounded-lg text-[12px]'>
                        View Order
                    </motion.div> </AnimatePresence>
                    </div>

                  </td> 
                </tr>
                }): (
                  <tr>
                     <td colSpan={5}> Data not found </td>
                  </tr>
                )}
              </tbody>

            </table>
            }
            {
              active === 11 && <OrderDetail viewOrderData={viewOrderData} />
            }
         </div>
      </div>
    </>
  )
}

export default OrderTable
