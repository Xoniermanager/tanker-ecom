"use client";
import React, { useState, useEffect } from "react";
import ProductList from "../../../../../components/admin/products/ProductList";
import api from "../../../../../components/user/common/api";
import { toast } from "react-toastify";
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set";

const page = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [errMessage, setErrMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deletePopupShow, setDeletePopupShow] = useState(false)
  const [deletedProductId, setDeletedProductId] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [filterByName, setFilterByName] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  


  const getCategoryData = async()=>{
    try {
      const response = await api.get(`/product-categories`)
      if(response.status === 200){
        setCategoryData(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getProducts = async () => {
    setIsLoading(true)
    try {
    const response = await api.get(`/products?limit=${pageLimit}&page=${currentPage}${filterByName ? `&name=${filterByName}`: ""}${
        selectedCategories.length > 0 ? `&category=${selectedCategories.join(",")}`: ""}`)
    if(response.status === 200){
      setProductData(response.data.data.data)
      setTotalPages(response.data.data.totalPages)
      setPageLimit(response.data.data.limit)
      setCurrentPage(response.data.data.page)
    }
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const delayDebouncing = setTimeout(() => {
      setFilterByName(searchInput)
      setCurrentPage(1)
    }, 400);
  
    return () => {
      clearTimeout(delayDebouncing)
    }
  }, [searchInput])

  useEffect(() => {
    getProducts()
  }, [currentPage, pageLimit, filterByName, selectedCategories])
  

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

  const handleCategoryChange = (id) => {
  setSelectedCategories((prev) =>
    prev.includes(id)
      ? prev.filter((catId) => catId !== id) 
      : [...prev, id] 
  );
};

const handleToggleStatus = async(id)=>{
  // setIsLoading(true)
    try {
      const response = await api.patch(`/products/${id}`)
      if(response.status === 200){
        toast.success(response.data.message || "Product status changed successfully");
        getProducts()
      }
    } catch (error) {
      const message =
      (Array.isArray(error?.response?.data?.errors) && error.response.data.errors[0]?.message) ||
      error?.response?.data?.message ||
      "Something went wrong";
    setErrMessage(message);
     toast.error(message)
    } 
}

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
        <ProductList categoryData={categoryData} productData={productData} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} deletePopupShow={deletePopupShow} setDeletePopupShow={setDeletePopupShow} setDeleteProduct={setDeleteProduct} handleDelete={handleDelete} isLoading={isLoading} errMessage={errMessage} searchInput={searchInput} setSearchInput={setSearchInput} setPageLimit={setPageLimit} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} handleCategoryChange={handleCategoryChange} handleToggleStatus={handleToggleStatus}/>
      </div>
    </>
  );
};

export default page;
