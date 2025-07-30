"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import OurArticle from '../../../../components/user/News/OurArticle'
import Counter from '../../../../components/user/home/Counter'
import  {getPageData} from "../../../../components/admin/cms/common/getPageData"
const Page = () => {

  const [newsData, setNewsData] = useState(null)
  
    const fetchData = async()=>{
        try{
         const pageData = await getPageData();
          setNewsData(pageData?.data || null)
          
        }
        catch(error){
          console.error("error: ", error)
        }
      }
    
      useEffect(() => {
        fetchData()
    
      }, []);

      const counterData = newsData?.sections?.find(item=>item?.section_id === "section-track-record") || null

  return (
    <>
      <PageBanner heading={"News Feed"}/>
      <OurArticle />
      {counterData && <Counter counterData={counterData}/>}
    </>
  )
}

export default Page
