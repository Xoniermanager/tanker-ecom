"use client"
import React, {useState, useEffect} from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import AboutCompany from '../../../../components/user/home/AboutCompany'
import WorkProcess from '../../../../components/user/about/WorkProcess'
import WhoWeAre from '../../../../components/user/home/WhoWeAre'
import Counter from '../../../../components/user/home/Counter'
import ClientFeedback from '../../../../components/user/about/ClientFeedback'
import OurPeople from '../../../../components/user/about/OurPeople'
import  {getPageData} from "../../../../components/admin/cms/common/getPageData"
import api from '../../../../components/user/common/api'
const Page = () => {
   const [aboutData, setAboutData] = useState(null)
   const [frontendTestimonialData, setFrontendTestimonialData] = useState(null)

  const fetchData = async()=>{
      try{
       const pageData = await getPageData();
        setAboutData(pageData?.data || null)
        
      }
      catch(error){
        console.error("error: ", error)
      }
    }

    const getTestimonialData = async()=>{
      try {
        const response = await api.get(`/testimonials/frontend`)
        if(response.status === 200){
            setFrontendTestimonialData(response.data.data)
            
        }
      } catch (error) {
        console.log(error)
      }
    }
  
    useEffect(() => {
      fetchData()
      getTestimonialData()
    }, []);

    const aboutDatas = aboutData?.sections?.find(item=>item?.section_id === "section-about-company") || null
    const counterData = aboutData?.sections?.find(item=>item?.section_id === "section-track-record") || null
    const ourPeopleData = aboutData?.sections?.find(item=>item?.section_id === "section-our-people") || null
    const whoWeAreData = aboutData?.sections?.find(item=>item?.section_id === "section-who-we-are") || null
    const testimonialData = aboutData?.sections?.find(item=>item?.section_id === "section-testimonials") || null
  
    
  return (
    <>
      <PageBanner heading={'About Us'}/>
     {aboutDatas && <AboutCompany aboutData={aboutDatas}/> }
     {ourPeopleData && <OurPeople peopleData={ourPeopleData}/> }
      {whoWeAreData && <WhoWeAre whoWeAreData={whoWeAreData}/>}
      {counterData && <Counter counterData={counterData}/>}
     {testimonialData && <ClientFeedback testimonialData={testimonialData} testimonials={frontendTestimonialData}/> }
    </>
  )
}

export default Page
