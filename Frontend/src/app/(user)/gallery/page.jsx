"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import GalleryComponent from '../../../../components/user/gallery/GalleryComponent'
import Counter from '../../../../components/user/home/Counter'
import  {getPageData} from "../../../../components/admin/cms/common/getPageData"


const page = () => {
  const [galleryData, setGalleryData] = useState(null)
    
      const fetchData = async()=>{
          try{
           const pageData = await getPageData();
            setGalleryData(pageData?.data || null)
            
          }
          catch(error){
            console.error("error: ", error)
          }
        }
      
        useEffect(() => {
          fetchData()
      
        }, []);
  
        const counterData = galleryData?.sections?.find(item=>item?.section_id === "section-track-record") || null
  return (
    <>
      <PageBanner heading={'our gallery'}/>
      <GalleryComponent />
      {counterData && <Counter counterData={counterData} />}
    </>
  )
}

export default page
