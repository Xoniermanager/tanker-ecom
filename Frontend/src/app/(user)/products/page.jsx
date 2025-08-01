"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import OurProducts from '../../../../components/user/Products/OurProducts'
import WorkProcess from '../../../../components/user/about/WorkProcess'
import WhoWeAre from '../../../../components/user/home/WhoWeAre'
import Counter from '../../../../components/user/Products/Counter'

import  {getPageData} from "../../../../components/admin/cms/common/getPageData"


const page = () => {
  const [productData, setProductData] = useState(null)
    
      const fetchData = async()=>{
          try{
           const pageData = await getPageData();
            setProductData(pageData?.data || null)
            
          }
          catch(error){
            console.error("error: ", error)
          }
        }
      
        useEffect(() => {
          fetchData()
      
        }, []);

        const workProcessData = productData?.sections?.find(item=>item.section_id === "section-our-work-process")
        const counterData = productData?.sections?.find(item=>item.section_id === "section-track-record")
  return (
    <>
      <PageBanner heading={"our products"}/>
      <OurProducts/>
       {workProcessData && <WorkProcess workProcessData={workProcessData}/>}
      {/* <WhoWeAre/> */}
      {counterData && <Counter counterData={counterData}/>}
    </>
  )
}

export default page
