"use client"
import { useEffect, useState } from "react";
import {OrderContext} from "./OrderContext.js";
import api from "../../components/user/common/api.js";



const OrderContextProvider = ({children}) =>{
    const [orderData, setOrderData] = useState(null);
    const [orderHistoryData, setOrderHistoryData] = useState(null)
      const [errMessage, setErrMessage] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [orderCount, setOrderCount] = useState(0)

const getOrderData = async () => {
    try {
      const response = await api.get(`/order`);
      if (response.status === 200) {
        setOrderData(response.data.data.data || null);
        setOrderCount(response.data.data.total || null)
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      
      setErrMessage(message);
    }
  };

  const getOrderHistoryData = async()=>{
    try {
      const response = await api.get(`/order?status=delivered`);
      if(response.status === 200){
        setOrderHistoryData(response.data.data.data || null)
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
    getOrderData();
    getOrderHistoryData();
  }, []);


    return (
        <OrderContext.Provider value={{orderData, orderCount}}>
           {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider