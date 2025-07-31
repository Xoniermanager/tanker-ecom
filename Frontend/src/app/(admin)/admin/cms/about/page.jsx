"use client"
import React, {useState, useEffect} from 'react'
import Banner from '../../../../../../components/admin/cms/home/Banner';
import OurServices from '../../../../../../components/admin/cms/home/OurServices';
import AboutUs from '../../../../../../components/admin/cms/home/AboutUs';
import Products from '../../../../../../components/admin/cms/home/Products';
import Counter from '../../../../../../components/admin/cms/common/Counter';
import Article from '../../../../../../components/admin/cms/home/Article';
import Employees from '../../../../../../components/admin/cms/about/Employees';
import WhoWeAre from '../../../../../../components/admin/cms/about/WhoWeAre';
import { getPageData } from '../../../../../../components/admin/cms/common/getPageData';
import Testimonial from '../../../../../../components/admin/cms/about/Testimonial';

const page = () => {
    const [active, setActive] = useState(1);
    const [aboutData, setAboutData] = useState(null)


    const handleActive = (e)=>{
        setActive(e)
        
    }

    const fetchData = async()=>{
        try{
         const pageData = await getPageData();
          setAboutData(pageData.data)
        }
        catch(error){
          console.error("error: ", error)
        }
      }
    
    
      useEffect(() => {
        fetchData()
        
      }, []);

      console.log("about data: ", aboutData)


      const EmployeeData = aboutData?.sections.find(item=>item?.section_id === "section-our-people")
      const whoWeAreData = aboutData?.sections.find(item=>item?.section_id === "section-who-we-are")
      const testimonialData = aboutData?.sections.find(item=>item?.section_id === "section-testimonials")
      const counterData = aboutData?.sections.find(item=>item?.section_id === "section-track-record")

  return (
    <>
      <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
        <ul className="p-4 bg-white rounded-xl flex items-center justify-start gap-4 shadow-[0_0_15px_#00000020]">
          <li><button className={`${active === 1 ? "border-orange-500" : "border-transparent"} px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`} onClick={()=>handleActive(1)}>Employee</button></li>
          <li><button className={`${active === 2 ? "border-orange-500" : "border-transparent"} px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`} onClick={()=>handleActive(2)}>Who We Are</button></li>
          <li><button className={`${active === 4 ? "border-orange-500" : "border-transparent"} px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`} onClick={()=>handleActive(4)}>Counter</button></li>
          <li><button className={`${active === 5 ? "border-orange-500" : "border-transparent"} px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`} onClick={()=>handleActive(5)}>Testimonials</button></li>
          
        </ul>
        <div className="">
           {(active === 1) && (EmployeeData && <Employees EmployeeData={EmployeeData} />) } 
           {(active === 2) && (whoWeAreData && <WhoWeAre whoWeAreData={whoWeAreData}/>) } 
           {(active === 3) && <AboutUs/> } 
           {(active === 4) && (counterData && <Counter counterData={counterData}/>) }
           {(active === 5) && (testimonialData && <Testimonial testimonialData={testimonialData}/>) }
           {(active === 6) && <Article/> }
        </div>
      </div>
    </>
  )
}

export default page