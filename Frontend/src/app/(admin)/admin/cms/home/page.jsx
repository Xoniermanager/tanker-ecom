"use client";
import React, { useState, useEffect } from "react";
import Banner from "../../../../../../components/admin/cms/home/Banner";
import OurServices from "../../../../../../components/admin/cms/home/OurServices";
import AboutUs from "../../../../../../components/admin/cms/home/AboutUs";
import Products from "../../../../../../components/admin/cms/home/Products";
import Counter from "../../../../../../components/admin/cms/common/Counter";
import Article from "../../../../../../components/admin/cms/home/Article";
import api from "../../../../../../components/user/common/api";

import {getPageData} from '../../../../../../components/admin/cms/common/getPageData'

const Page = () => {
  const [active, setActive] = useState(1);
  const [homePageData, setHomeData] = useState(null);



  const handleActive = (e) => {
    setActive(e);
  };

  const fetchData = async()=>{
    try{
     const pageData = await getPageData();
      setHomeData(pageData.data)
    }
    catch(error){
      console.error("error: ", error)
    }
  }


  useEffect(() => {
    fetchData()
    
  }, []);

  

  const bannerData = homePageData?.sections?.find(item=>item?.order === 1)
  const aboutData = homePageData?.sections?.find(item=>item?.order === 3)
  const productData = homePageData?.sections?.find(item=>item?.order === 4 )
  const counterData = homePageData?.sections?.find(item=>item?.order === 5 )
  const articleData = homePageData?.sections?.find(item=>item?.order === 6 )
  
  console.log("about data: ", aboutData)

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <ul className="p-4 bg-white rounded-xl flex items-center justify-start gap-4 shadow-[0_0_15px_#00000020]">
          <li>
            <button
              className={`${
                active === 1 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(1)}
            >
              Banner
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 2 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(2)}
            >
              Our Services
            </button>
          </li>
          <li>
            <button
              className={` ${
                active === 3 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2 rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(3)}
            >
              About Us
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 4 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2 rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(4)}
            >
              Our Products
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 5 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(5)}
            >
              Counter
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 6 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2 rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(6)}
            >
              Our Article
            </button>
          </li>
        </ul>
        <div className="">
        

            
            <>
          {active === 1 && (bannerData && <Banner homeData={ bannerData }/>)}
          {active === 2 && (
    <OurServices serviceData={homePageData?.sections.find(item => item?.order === 2)} />
  )}
          {active === 3 && (aboutData && <AboutUs aboutData={aboutData}/>)}
          {active === 4 && (productData && <Products productData={productData} />)}
          {active === 5 && (counterData && <Counter counterData={counterData}/>)}
          {active === 6 && (articleData && <Article articleData={articleData}/>)}
          </>
            
        </div>
      </div>
    </>
  );
};

export default Page;
