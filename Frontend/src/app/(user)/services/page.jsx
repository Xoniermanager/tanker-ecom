"use client"
import React,{useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import WhatWeOffer from '../../../../components/user/home/WhatWeOffer'
import WorkProcess from '../../../../components/user/about/WorkProcess'
import WhoWeAre from '../../../../components/user/home/WhoWeAre'
import Counter from '../../../../components/user/home/Counter'
import  {getPageData} from "../../../../components/admin/cms/common/getPageData"

const page = () => {
  const [servicePageData, setServicePageData] = useState(null)
  
    const fetchData = async()=>{
        try{
         const pageData = await getPageData();
          setServicePageData(pageData?.data || null)
          
        }
        catch(error){
          console.error("error: ", error)
        }
      }
    
      useEffect(() => {
        fetchData()
    
      }, []);

     const serviceSecData = servicePageData?.sections?.find(item=>item?.section_id === "section-our-services") || null
     const workProcessData = servicePageData?.sections?.find(item=>item?.section_id === "section-our-work-process") || null
     const whoWeAreData = servicePageData?.sections?.find(item=>item?.section_id === "section-who-we-are") || null
     const counterData = servicePageData?.sections?.find(item=>item?.section_id === "section-track-record") || null
  return (
    <>
      <PageBanner heading={'Our Services'}/>
     {servicePageData && <WhatWeOffer serviceData={serviceSecData}/> }
      {workProcessData && <WorkProcess workProcessData={workProcessData} /> }
      {whoWeAreData && <WhoWeAre whoWeAreData={whoWeAreData}/> }
      {counterData && <Counter counterData={counterData}/>}
    </>
  )
}

export default page
