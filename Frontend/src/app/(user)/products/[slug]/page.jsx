"use client"
import React, { useEffect, useState } from 'react'
import PageBanner from '../../../../../components/user/common/PageBanner'
import ProductDetailComponents from '../../../../../components/user/Products/ProductDetailComponents'
import api from '../../../../../components/user/common/api'
import { useParams } from 'next/navigation'
import PageLoader from '../../../../../components/common/PageLoader'
import FailedDataLoading from '../../../../../components/common/FailedDataLoading'
import RelatedProductComponent from '../../../../../components/user/Products/RelatedProductComponent'


const page = () => {
  const [productData, setProductData] = useState(null)
  const [productCategory, setProductCategory] = useState(null)
  const [relatedCategoryData, setRelatedCategoryData] = useState(null)
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
        setProductCategory(response?.data?.data?.category?._id)
        
       }
     } catch (error) {
      console.error(error)
     }
     finally{
      setIsLoading(false)
     }
  }

  const fetchRelatedProduct = async()=>{
    try {
      const response = await api.get(`/products/frontend?category=${productCategory}`)
      if(response.status ===200){
        setRelatedCategoryData(response.data.data.data)
         
        console.log("related category: ", response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

 useEffect(() => {
  fetchProduct();
}, [slug]); 

useEffect(() => {
  if (productCategory) {
    fetchRelatedProduct();
  }
}, [productCategory]); 


const filter = relatedCategoryData?.filter(item=>item._id !== productData._id)



if (isLoading){
  return <PageLoader/>
}

if (!productData){
  return <FailedDataLoading />
}
  
  return (
    <>
      <PageBanner heading={'product details'}/>
      <ProductDetailComponents productData={productData} quantity={quantity} setQuantity={setQuantity} handleIncrease={handleIncrease} handleDecrease={handleDecrease }/>
      <RelatedProductComponent relatedCategoryData={filter} productData={productData} />

    </>
  )
}

export default page
