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

  

  const addressData = contactPageData?.sections?.find(item=>item?.section_id === "section-address")
  const contactsData = contactPageData?.sections?.find(item=>item?.section_id === "section-contacts")
  

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
              Address
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
         
        </ul>
        <div className="">
        

            <>
          {active === 1 && (addressData && <Address addressData={addressData}/> )}
          {active === 2 && (contactsData && <Contact contactsData={contactsData}/> )}


          </>
            
        </div>
      </div>
    </>
  );
};

export default Page;