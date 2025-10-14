"use client"
import React, { useEffect, useState } from 'react'

import QueryOrderTable from '../../../../../../components/admin/orders/QueryOrderTable';
import api from '../../../../../../components/user/common/api';

const page = () => {
const [orderData, setOrderData] = useState(null);
   
      const [errMessage, setErrMessage] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [orderCount, setOrderCount] = useState(0)
      const [currentPage, setCurrentPage] = useState(1);
       const [totalPages, setTotalPages] = useState(1);
        const [pageLimit, setPageLimit] = useState(10);
        const [orderStatus, setOrderStatus] = useState("")



        const getOrderData = async () => {
          setIsLoading(true)
          try {
            const response = await api.get(`/order?page=${currentPage}&limit=${pageLimit}&paymentMethod=cod${orderStatus && `&status=${orderStatus}`}`);
            if (response.status === 200 || response.data === 304) {
              setOrderData(response.data.data.data || null)
              setOrderCount(response.data.data.total || null)
              setPageLimit(Number(response.data.data.limit))
              setTotalPages(response.data.data.totalPages)
              setCurrentPage(Number(response.data.data.page))
            }
          } catch (error) {
            const message =
              (Array.isArray(error?.response?.data?.errors) &&
                error.response.data.errors[0]?.message) ||
              error?.response?.data?.message ||
              "Something went wrong";
            
            setErrMessage(message);
          } finally{
            setIsLoading(false)
          }
        };

      
        useEffect(() => {
          getOrderData();
         
        }, [currentPage, pageLimit, totalPages, orderStatus]);

  return (
    <>
      <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
        <QueryOrderTable orderData={orderData} setTotalPages={setTotalPages} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} setPageLimit={setPageLimit} setOrderStatus={setOrderStatus} orderStatus={orderStatus}/>
      </div>
    </>
  )
}

export default page
