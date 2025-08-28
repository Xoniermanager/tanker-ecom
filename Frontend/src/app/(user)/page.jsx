"use client"
import AboutCompany from "../../../components/user/home/AboutCompany";
import Counter from "../../../components/user/home/Counter";
import FooterStripe from "../../../components/user/home/FooterStripe";
import HomePage from "../../../components/user/home/Home";
import OurArticles from "../../../components/user/home/OurArticles";
import OurProducts from "../../../components/user/home/OurProducts";
import WhatWeOffer from "../../../components/user/home/WhatWeOffer";
import WhoWeAre from "../../../components/user/home/WhoWeAre";

import {getPageData} from "../../../components/admin/cms/common/getPageData"
import { useEffect, useState } from "react";
import FailedDataLoading from "../../../components/common/FailedDataLoading";
import PageLoader from "../../../components/common/PageLoader";



export default function Home() {
  const [homeData, setHomeData] = useState(null)
  const [pageId, setPageId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)


  const fetchData = async()=>{
    setIsLoading(true)
    try{
     const pageData = await getPageData();
      setHomeData(pageData?.data || null)
      setPageId(pageData?.data?.pageId || null)
    }
    catch(error){
      console.error("error: ", error)
    }
    finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

  }, []);

  if(isLoading){
    return (
    <PageLoader/>
    )
  }

   if (!homeData) {
    return (
      <FailedDataLoading/>
    );
  }

  
  const bannerData = homeData?.sections?.find(item=>item?.section_id === "section-banner") || null
  const whatWeOfferData = homeData?.sections?.find(item=>item?.section_id === "section-our-services") || null
  const aboutData = homeData?.sections?.find(item=>item?.section_id === "section-about-company") || null
  const productData = homeData?.sections?.find(item=>item?.section_id === "section-our-products") || null
  const counterData = homeData?.sections?.find(item=>item?.section_id === "section-track-record") || null
  const articleData = homeData?.sections?.find(item=>item?.section_id === "section-articles") || null


  return (
    <>
     {bannerData && <HomePage  bannerData={bannerData}/> }
     {whatWeOfferData && <WhatWeOffer serviceData={whatWeOfferData}/> }
      {aboutData && <AboutCompany aboutData={aboutData}/>}
      {productData && <OurProducts productData={productData}/>}
     {counterData && <Counter counterData={counterData}/> }
      {/* <WhoWeAre/> */}
      {articleData && <OurArticles articleData={articleData}/>}
      <FooterStripe/>
    </>
  );
}