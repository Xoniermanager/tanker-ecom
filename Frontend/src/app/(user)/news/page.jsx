"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import OurArticle from '../../../../components/user/News/OurArticle'
import Counter from '../../../../components/user/home/Counter'
import  {getPageData} from "../../../../components/admin/cms/common/getPageData"
import api from '../../../../components/user/common/api'
import axios from 'axios'
import Cookies from 'js-cookie'
import PageLoader from '../../../../components/common/PageLoader'
import FailedDataLoading from '../../../../components/common/FailedDataLoading'
const Page = () => {

  const [newsData, setNewsData] = useState(null)
  const [blogData, setBlogData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
    const fetchData = async()=>{
      setIsLoading(true)
        try{
         const pageData = await getPageData();
          setNewsData(pageData?.data || null)
          
        }
        catch(error){
          console.error("error: ", error)
        }
        finally{
          setIsLoading(false)
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

      if(isLoading){
        return <PageLoader/>
      }

      if(!newsData){
        return <FailedDataLoading/>
      }

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
