"use client"
import React, { useEffect, useState } from 'react'
import PageBanner from '../../../../../components/user/common/PageBanner'
import ProductDetailComponents from '../../../../../components/user/Products/ProductDetailComponents'
import api from '../../../../../components/user/common/api'
import { useParams } from 'next/navigation'
import PageLoader from '../../../../../components/common/PageLoader'
import FailedDataLoading from '../../../../../components/common/FailedDataLoading'


const page = () => {
  const [productData, setProductData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1);



  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); 
  };

  const {slug} = useParams();

 

  const fetchProduct = async()=>{
    setIsLoading(true)
     try {
       const response = await api.get(`/products/${slug}`);
       if(response.status === 200){
        setProductData(response.data.data)
        
       }
     } catch (error) {
      console.error(error)
     }
     finally{
      setIsLoading(false)
     }
  }

  useEffect(()=>{
     fetchProduct()
  },[])



if (isLoading){
  return <PageLoader/>
}

if (!productData){
  return <FailedDataLoading />
}
  
  return (
    <>
      <PageBanner heading={'product details'}/>
      <ProductDetailComponents productData={productData} quantity={quantity} setQuantity={setQuantity} handleIncrease={handleIncrease} handleDecrease={handleDecrease}/>
    </>
  )
}

export default page
