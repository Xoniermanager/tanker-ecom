"use client"
import React, { useState } from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import CartItems from '../../../../components/user/cart/CartItems'
import api from '../../../../components/user/common/api'
import { toast } from 'react-toastify'
import { useCart } from '../../../../context/cart/CartContext'
import { useAuth } from '../../../../context/user/AuthContext'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const page = () => {
  const [errMessage, setErrMessage] = useState(null)
  const {cartData, fetchCartData} = useCart()

  const {isAuthenticated} = useAuth()
  
  const DataLength = cartData?.length || 0

   const popup = withReactContent(Swal)
  
  const handleRemoveProduct = async(id, product)=>{
    const result = await popup.fire({
         title: "Are you sure?",
      text: `Do you really want to remove ${product} product`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel"
      })

      if(!result.isConfirmed) return
     try {
      const response = await api.delete(`/cart/${id}`)
      if(response.status === 200){
        toast.success(`${product} removed successfully`)
        fetchCartData()
      }
     } catch (error) {
      if(process.env.NODE_ENV === "development") {
        console.error(error)
       
      }
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      toast.error(message)
     }
  }

  const handleClearCart = async()=>{
    

    const result = await popup.fire({
         title: "Are you sure?",
      text: "Do you really want to clear cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel"
      })

      if(!result.isConfirmed) return

    if(!isAuthenticated){
      localStorage.clear("guestCart")
      fetchCartData()
      toast.success("Cart clear successfully")
      return
    }
    
    try {
      const response = await api.delete(`/cart`)
      if(response.status === 200){
          toast.success("Cart clear successfully")
          fetchCartData()
      }
    } catch (error) {
      if(process.env.NODE_ENV === "development") {
        console.error(error)
       
      }
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      toast.error(message)
     }
    
  }

  

  return (
    <>
      <PageBanner heading={'Cart'}/>
      <CartItems handleRemoveProduct={handleRemoveProduct} handleClearCart={handleClearCart} DataLength={DataLength}/>
    </>
  )
}

export default page

