"use client";
import React, { useState,useEffect } from "react";
import PageBanner from "../../../../components/user/common/PageBanner";

import OrderTable from "../../../../components/user/orders/OrderTable";
import api from "../../../../components/user/common/api";
import PageLoader from "../../../../components/common/PageLoader";

const page = () => {
   const [orderData, setOrderData] = useState(null);
    const [orderHistoryData, setOrderHistoryData] = useState(null)
      const [errMessage, setErrMessage] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [orderCount, setOrderCount] = useState(0)
      const [currentPage, setCurrentPage] = useState(1);
       const [totalPages, setTotalPages] = useState(1);
        const [pageLimit, setPageLimit] = useState(10)


        const getOrderData = async () => {
          setIsLoading(true)
          try {
            const response = await api.get(`/order?page=${currentPage}&limit=${pageLimit}`);
            if (response.status === 200 || response.data === 304) {
              setOrderData(response.data.data.data || null);
           
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
         
        }, [currentPage, pageLimit]);

    if(isLoading){
      return <PageLoader/>
    }

        


  return (
    <>
      <PageBanner heading={"Order"} />
      <OrderTable orderData={orderData} currentPage={currentPage} setCurrentPage={setCurrentPage} pageLimit={pageLimit} totalPages={totalPages} isLoading={isLoading} getOrderData={getOrderData}/>
      
    </>
  );
};

export default page;
