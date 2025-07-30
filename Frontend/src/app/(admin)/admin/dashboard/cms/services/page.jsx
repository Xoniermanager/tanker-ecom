"use client";
import React, { useState, useEffect } from "react";
import Banner from "../../../../../../../components/admin/cms/home/Banner";
import {getPageData} from '../../../../../../../components/admin/cms/common/getPageData'
import Address from "../../../../../../../components/admin/cms/contact/Address";
import Contact from "../../../../../../../components/admin/cms/contact/Contact";
import OurServices from "../../../../../../../components/admin/cms/home/OurServices";
import WhoWeAre from "../../../../../../../components/admin/cms/about/WhoWeAre";
import Counter from "../../../../../../../components/admin/cms/common/Counter";
import WorkProcess from "../../../../../../../components/admin/cms/services/WorkProcess";

const Page = () => {
  const [active, setActive] = useState(1);
  const [servicePageData, setServiceData] = useState(null);

  const handleActive = (e) => {
    setActive(e);
  };

  const fetchData = async()=>{
    try{
     const pageData = await getPageData();
      setServiceData(pageData.data)
      console.log("contact data: ", pageData.data)
    }
    catch(error){
      console.error("error: ", error)
    }
  }

  useEffect(() => {
    fetchData()
    
  }, [active]);

  const serviceSecData = servicePageData?.sections?.find(item=>item?.section_id === "section-our-services")
  const workProcessData = servicePageData?.sections?.find(item=>item?.section_id === "section-our-work-process")
  const contactsData = servicePageData?.sections?.find(item=>item?.section_id === "section-contacts")
  const whoWeAreData = servicePageData?.sections?.find(item=>item?.section_id === "section-who-we-are")
  const counterData = servicePageData?.sections?.find(item=>item?.section_id === "section-track-record")
  

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
              Services
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 2 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(2)}
            >
              Work Process
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 3 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(2)}
            >
              Our Services
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 4 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(3)}
            >
              Who We Are
            </button>
          </li>
          <li>
            <button
              className={`${
                active === 5 ? "border-orange-500" : "border-transparent"
              } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
              onClick={() => handleActive(4)}
            >
              Counter
            </button>
          </li>
         
        </ul>
        <div className="">
        

            <>
          {active === 1 && (serviceSecData && <OurServices serviceData={serviceSecData}/> )}
          {active === 2 && (workProcessData && <WorkProcess workProcessData={workProcessData}/> )}
          {active === 3 && (contactsData && <Contact contactsData={contactsData}/> )}
          {active === 4 && (whoWeAreData && <WhoWeAre whoWeAreData={whoWeAreData}/> )}
          {active === 5 && (counterData && <Counter counterData={counterData}/> )}


          </>
            
        </div>
      </div>
    </>
  );
};

export default Page;