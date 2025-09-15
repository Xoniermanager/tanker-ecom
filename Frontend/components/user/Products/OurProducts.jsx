"use client";
import React, { useRef, useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import { FaCircleArrowRight } from "react-icons/fa6";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";
import Link from "next/link";

import { IoArrowForward } from "react-icons/io5";
import api from "../common/api";
import BlockPageLoader from "../../common/BlockPageLoader";

const OurProducts = ({
 
}) => {
  const [productData, setProductData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [brandData, setBrandData] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState(null)
    const [searchTerm, setSearchTerm] = useState("");
    const [filterByName, setFilterByName] = useState(null)
    const [filterBrand, setFilterBrand] = useState(null)
    const [errMessage, setErrMessage] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(6)
  const [activePage, setActivePage] = useState(1);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products/frontend?limit=${pageLimit}&page=${currentPage}&${filterCategory ? `category=${filterCategory}` : ""}&${filterByName ? `name=${filterByName}` : ""}&${filterBrand ? `brand=${filterBrand}` : ""}`);
      if(response.status === 200){
        setProductData(response?.data?.data.data || null);
        
        setTotalPages(response?.data?.data?.totalPages)
        setPageLimit(response?.data?.data?.limit)
        setCurrentPage(response?.data?.data?.page)
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async()=>{
    try {
      const response = await api.get(`/product-categories/active`)
      if(response.status === 200){
        setCategoryData(response.data.data)
      }
    } catch (error) {
      console.error(error)
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
    }
  }

  const fetchBrand = async()=>{
    try {
      const response = await api.get(`/products/brands`)
      if(response.status === 200){
         setBrandData(response.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  
  useEffect(() => {
    fetchCategories();
    fetchBrand()
  }, [])

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    setFilterByName(searchTerm);  
    setCurrentPage(1);           
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

  useEffect(() => {
      fetchData();
    }, [currentPage, pageLimit, filterCategory, filterByName, filterBrand]);

    const handleBrandFilter = (e) =>{
      setFilterBrand(e)
      setCurrentPage(1)
    }
    const handleCategoryFilter = (e) =>{
      setFilterCategory(e)
      setCurrentPage(1)
    }
  
    if(isLoading){
      <BlockPageLoader/>
    }

  return (
    <div className="w-full py-28 px-4 flex flex-col gap-10">
      <div className="flex flex-col gap-4 items-center mb-20">
        <div className="flex items-center gap-2">
          <Image src="/images/arrows.png" width={43} height={11} alt="arrow" />
          <span className="text-orange-400 font-semibold text-[22px]">
            WHAT WE OFFER
          </span>
          <Image src="/images/arrows.png" width={43} height={11} alt="arrow" />
        </div>
        <h2 className="font-black text-7xl text-purple-950"> Our Products </h2>
        <p className="text-zinc-500 w-1/2 text-center text-lg font-medium">
          Tanker Solutions is the New Zealand distributor for some of the very
          best global petroleum equipment suppliers for tankers and tank
          trailers.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-5 border-1 border-gray-200 rounded-lg max-w-7xl mx-auto w-full p-3">
        <div className="flex flex-col gap-2 col-span-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">
            {" "}
            Search Product{" "}
          </label>
          <div className="flex items-center border-gray-200 capitalize border-1 px-4 py-3 gap-3 rounded-xl font-medium bg-gray-50">
            <IoMdSearch className="text-xl text-orange-500" />
            <input
              type="text"
              className="w-full outline-none"
              placeholder="Search here..."
              value={searchTerm}
  onChange={(e)=>setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">
            {" "}
            Brand{" "}
          </label>
          <select
            name="brand"
            id="brand"
            className="border-gray-200 border-1 px-1 py-3 rounded-xl font-medium bg-gray-50"
            onChange={(e)=>handleBrandFilter(e.target.value)}
          >
             <option value="" hidden>
              Choose Brand
            </option>
            <option value="">All Brands</option>
            {brandData?.map((item,i)=>(
             <option value={item.value} key={i}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-semibold text-gray-700">
            {" "}
            Categories{" "}
          </label>
          <select
            name="brand"
            id="brand"
            className="border-gray-200 capitalize border-1 px-1 py-3 rounded-xl font-medium bg-gray-50"
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="" hidden>
              Choose Categories
            </option>
            <option value="">All Categories</option>
            {categoryData?.map((item, index) => (
              <option value={item._id} key={item._id}>{item.name}</option>
            ))}
          </select>
        </div>
       
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-7xl w-full mx-auto">
        {productData?.length > 0  ? productData?.map((item, index) => (
          <div className="main-box w-full" key={index}>
            <div
              style={{ backgroundImage: `url('/images/truckOne.jpg')` }}
              className="bg-purple-200 product-truck-img relative bg-cover bg-center rounded-[46px] flex items-center justify-center text-2xl font-bold h-74 overflow-hidden"
            ></div>
            <div className="bg-white content-box p-3 w-4/5 -mt-52 mx-auto z-20 relative">
              <div className="border-2 border-orange-400 border-dashed p-6 flex items-center flex-col justify-between gap-5">
                <Image
                  src={item.images[0]?.source || "/images/dummy.jpg"}
                  width={75}
                  height={75}
                  alt="truck icon"
                  className="h-16 w-20 object-contain"
                />
                <h3 className="text-2xl font-bold text-purple-950 text-center truncate w-full capitalize">
                  {item.name}
                </h3>
                <p className="text-zinc-500 font-medium text-base text-center leading-8 line-clamp-3 h-22">
                  {item.shortDescription}
                </p>

                <Link
                  href={`/products/${item.slug}`}
                  className="relative inline-flex items-center justify-start w-46 h-12 px-8 overflow-hidden capitalize text-lg font-bold text-purple-950 group rounded-md ml-4"
                >
                  <span className="z-10 transition-all duration-300 transform group-hover:-translate-x-4">
                    view product
                  </span>
                  <span className="absolute -left-0 z-0 transition-all duration-300 transform group-hover:translate-x-[140px] text-orange-400">
                    <FaCircleArrowRight />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center w-full col-span-3 text-stone-500"> Product data not found</div>
        )}
      </div>
      <div className="flex items-center gap-4 justify-center">
        {[...Array(totalPages)].map((item, index) => (
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
        disabled={productData?.length <= 0}
          className={`h-12 w-12 rounded-full border-white bg-[#42666f] hover:bg-[#334f56] disabled:bg-[#507b86c5] font-bold border-1 border-dashed text-white flex items-center justify-center text-2xl ${productData?.length <= 0 && "hidden"}`}
          onClick={() => setCurrentPage(Number(activePage) + 1)}
        >
          {" "}
          <IoArrowForward />{" "}
        </button>
      </div>
    </div>
  );
};

export default OurProducts;
