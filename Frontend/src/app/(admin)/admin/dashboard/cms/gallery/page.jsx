"use client";
import React, { useState, useEffect } from "react";
import Banner from "../../../../../../../components/admin/cms/home/Banner";
import OurServices from "../../../../../../../components/admin/cms/home/OurServices";
import AboutUs from "../../../../../../../components/admin/cms/home/AboutUs";
import Products from "../../../../../../../components/admin/cms/home/Products";
import Counter from "../../../../../../../components/admin/cms/common/Counter";
import Article from "../../../../../../../components/admin/cms/home/Article";
import api from "../../../../../../../components/user/common/api";

import {getPageData} from '../../../../../../../components/admin/cms/common/getPageData'
import Address from "../../../../../../../components/admin/cms/contact/Address";
import Contact from "../../../../../../../components/admin/cms/contact/Contact";
import GalleryManagement from "../../../../../../../components/admin/cms/gallery/GalleryManagement";

import GalleryView from "../../../../../../../components/admin/cms/gallery/GalleryView";

const Page = () => {
  const [active, setActive] = useState(1);
  const [contactPageData, setContactData] = useState(null);



  const handleActive = (e) => {
    setActive(e);
  };

  const fetchData = async()=>{
    try{
     const pageData = await getPageData();
      setContactData(pageData.data)
      
    }
    catch(error){
      console.error("error: ", error)
    }
  }


  useEffect(() => {
    fetchData()
    
  }, [active]);

  

  
  

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <GalleryManagement />
        <GalleryView />
      </div>
    </>
  );
};

export default Page;