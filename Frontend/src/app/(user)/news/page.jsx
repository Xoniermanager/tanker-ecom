"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import OurArticle from '../../../../components/user/News/OurArticle'
import Counter from '../../../../components/user/home/Counter'
import  {getPageData} from "../../../../components/admin/cms/common/getPageData"
import api from '../../../../components/user/common/api'
import axios from 'axios'
import Cookies from 'js-cookie'
const Page = () => {

  const [newsData, setNewsData] = useState(null)
  const [blogData, setBlogData] = useState(null)
  
    const fetchData = async()=>{
        try{
         const pageData = await getPageData();
          setNewsData(pageData?.data || null)
          console.log("blog data: ", pageData?.data)
          
        }
        catch(error){
          console.error("error: ", error)
        }
      }

      const getBlogData = async()=>{
         try {
          const accessToken = Cookies.get('accessToken')
          const response = await api.get(`/blogs/published`, {headers:{Authorization: `Bearer ${accessToken}`}})
          if(response.status === 200){
            setBlogData(response?.data?.data?.data)
            
          }
         } catch (error) {
            console.log(error)
         }
      }
    
      useEffect(() => {
        fetchData()
        getBlogData()
      }, []);

      const counterData = newsData?.sections?.find(item=>item?.section_id === "section-track-record") || null

  return (
    <>
      <PageBanner heading={"News Feed"}/>
      {blogData && <OurArticle blogData={blogData}/>}
      {counterData && <Counter counterData={counterData}/>}
    </>
  )
}

export default Page
