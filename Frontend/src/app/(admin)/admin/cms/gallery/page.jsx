"use client";
import React, { useState, useEffect } from "react";

import {getPageData} from '../../../../../../components/admin/cms/common/getPageData'
import Address from "../../../../../../components/admin/cms/contact/Address";
import Contact from "../../../../../../components/admin/cms/contact/Contact";
import GalleryManagement from "../../../../../../components/admin/cms/gallery/GalleryManagement";

import GalleryView from "../../../../../../components/admin/cms/gallery/GalleryView";
import api from "../../../../../../components/user/common/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Page = () => {
  const [errMessage, setErrMessage] = useState(null)
  const [galleryData, setGalleryData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)

  


  const getGalleryData = async()=>{
     try {
       const accessToken = Cookies.get('accessToken')

       const response = await api.get(`/gallery?page=${currentPage}&limit=${pageLimit}`, {headers:{
        Authorization: `Bearer ${accessToken}`
       }})
       if(response.status === 200){
        setGalleryData(response.data.data.data)

       }
     } catch (error) {
      console.error(error)
     }
  }
  
  useEffect(() => {
    getGalleryData()
  }, [pageLimit])
  
  const handleToggleStatus = async(id, status)=>{
     try {
      const accessToken = Cookies.get('accessToken')
        const statusBlog = galleryData.find(item=>item._id === id)
        const payload = ({
          items:[{
          ...statusBlog,
          status:status ? false : true
     }]})
        await toast.promise(
  api.put(`/gallery`, payload, { headers: { Authorization: `Bearer ${accessToken}` } }),
  {
    pending: 'Updating status...',
    success: 'Status updated successfully',
    error: 'Failed to update status',
  }
);
     } catch (error) {
      const message =
      (Array.isArray(error?.response?.data?.errors) &&
        error.response.data.errors[0]?.message) ||
      error?.response?.data?.message ||
      "Something went wrong";
    setErrMessage(message);
     }
  }
  

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <GalleryManagement getGalleryData={getGalleryData} />
        <GalleryView galleryData={galleryData} setGalleryData={setGalleryData} setPageLimit={setPageLimit} handleToggleStatus={handleToggleStatus}/>
      </div>
    </>
  );
};

export default Page;