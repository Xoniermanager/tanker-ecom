"use client";
import React, { useState, useEffect } from "react";
import ProductList from "../../../../../components/admin/products/ProductList";
import api from "../../../../../components/user/common/api";
import { toast } from "react-toastify";

const page = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [pageLimit, setPageLimit] = useState(10)
  const [errMessage, setErrMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [deletePopupShow, setDeletePopupShow] = useState(false)
  const [deletedProductId, setDeletedProductId] = useState(null)

  
  // get category data


  const getCategoryData = async()=>{
    try {
      const response = await api.get(`/product-categories?limit=${pageLimit}`)
      if(response.status === 200){
        setCategoryData(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getProducts = async () => {
    
    try {
    const response = await api.get(`/products`)
    if(response.status === 200){
      setProductData(response.data.data.data)
      setTotalPages(response.data.data.totalPages)
      setPageLimit(response.data.data.limit)
      setCurrentPage(response.data.data.page)
    }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts()
  }, [currentPage, pageLimit])
  

  useEffect(() => {
    
    getCategoryData()
  }, [])

  const handleDelete = async()=>{
    setIsLoading(true)
    setErrMessage(null)
    try {
      const response = await api.delete(`/products/${deletedProductId}`)
      if(response.status === 200){
        toast.success("Product deleted successfully")
        setDeletePopupShow(false)
        getProducts()
      }
    } catch (error) {
       const message =
      (Array.isArray(error?.response?.data?.errors) && error.response.data.errors[0]?.message) ||
      error?.response?.data?.message ||
      "Something went wrong";
    setErrMessage(message);
    }
    finally{
      setIsLoading(false)
    }
  }

  const setDeleteProduct = (id)=>{
    setDeletePopupShow(true)
    setDeletedProductId(id)
  }


  


  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
        <ProductList categoryData={categoryData} productData={productData} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} deletePopupShow={deletePopupShow} setDeletePopupShow={setDeletePopupShow} setDeleteProduct={setDeleteProduct} handleDelete={handleDelete} isLoading={isLoading} errMessage={errMessage}/>
      </div>
    </>
  );
};

export default page;
