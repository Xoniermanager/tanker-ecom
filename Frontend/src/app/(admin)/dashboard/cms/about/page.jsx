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

const page = () => {
    const [active, setActive] = useState(1);


    const handleActive = (e)=>{
        setActive(e)
        
    }

  return (
    <>
      <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
        <ul className="p-4 bg-white rounded-xl flex items-center justify-start gap-4 shadow-[0_0_15px_#00000020]">
          <li><button className={`${active === 1 ? "border-orange-500" : "border-transparent"} px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`} onClick={()=>handleActive(1)}>Employee</button></li>
          <li><button className={`${active === 2 ? "border-orange-500" : "border-transparent"} px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`} onClick={()=>handleActive(2)}>Who We Are</button></li>
          
        </ul>
        <div className="">
           {(active === 1) && <Employees/> } 
           {(active === 2) && <WhoWeAre/> } 
           {(active === 3) && <AboutUs/> } 
           {(active === 4) && <Products/> }
           {(active === 5) && <Counter/> }
           {(active === 6) && <Article/> }
        </div>
      </div>
    </>
  )
}

export default page