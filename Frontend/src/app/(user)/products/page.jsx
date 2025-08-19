"use client";
import React, { useState, useEffect } from "react";
import PageBanner from "../../../../components/user/common/PageBanner";
import OurProducts from "../../../../components/user/Products/OurProducts";
import WorkProcess from "../../../../components/user/about/WorkProcess";
import WhoWeAre from "../../../../components/user/home/WhoWeAre";
import Counter from "../../../../components/user/Products/Counter";

import { getPageData } from "../../../../components/admin/cms/common/getPageData";
import PageLoader from "../../../../components/common/PageLoader";
import FailedDataLoading from "../../../../components/common/FailedDataLoading";
import api from "../../../../components/user/common/api";

const page = () => {
  const [productData, setProductData] = useState(null);
  const [categoryData, setCategoryData] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null)
  const [filterByName, setFilterByName] = useState(null)
  const [errMessage, setErrMessage] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(6)

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/products/frontend?limit=${pageLimit}&page=${currentPage}&${filterCategory ? `category=${filterCategory}` : ""}&${filterByName ? `name=${filterByName}` : ""}`);
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
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, pageLimit, filterCategory, filterByName]);

  useEffect(() => {
    fetchCategories();
  }, [])
  

  if (isLoading) {
    return <PageLoader />;
  }

  if (!productData) {
    return <FailedDataLoading />;
  }

  const workProcessData = productData?.sections?.find(
    (item) => item.section_id === "section-our-work-process"
  );
  const counterData = productData?.sections?.find(
    (item) => item.section_id === "section-track-record"
  );
  return (
    <>
      <PageBanner heading={"our products"} />
      <OurProducts productData={productData} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} categoryData={categoryData} setFilterCategory={setFilterCategory} filterByName={filterByName} setFilterByName={setFilterByName}/>

      {workProcessData && <WorkProcess workProcessData={workProcessData}  />}
      {/* <WhoWeAre/> */}
      {counterData && <Counter counterData={counterData} />}
    </>
  );
};

export default page;
