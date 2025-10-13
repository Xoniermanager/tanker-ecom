"use client";
import React, { useState } from "react";
import { IoIosSearch, IoIosNotificationsOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { GoPlusCircle } from "react-icons/go";
import NotificationSidebar from "./common/NotificationSidebar";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import { SegmentPrefixRSCPathnameNormalizer } from "next/dist/server/normalizers/request/segment-prefix-rsc";
import { CgWebsite } from "react-icons/cg";

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [relatedData, setRelatedData] = useState([]);
  
  const pages = [
    {
      id: 1,
      name: "orders",
      path: "/orders"
    },
    {
      id:2,
      name: "product category",
      path: "/products/add-category"
    },
    {
      id:3,
      name: "add products",
      path: "/products/add-product"
    },
    {
      id:4,
      name: "add bulk products",
      path: "/products/add-bulk-products"
    },
    {
      id:5,
      name: "products list",
      path: "/products"
    },
    
    {
      id:7,
      name: "cms home",
      path: "/cms/home"
    },
    {
      id:8,
      name: "cms about",
      path: "/cms/about"
    },
    {
      id:9,
      name: "cms services",
      path: "/cms/services"
    },
    {
      id:10,
      name: "cms gallery",
      path: "/cms/gallery"
    },
    {
      id:11,
      name: "cms blog",
      path: "/cms/blogs"
    },
    {
      id:12,
      name: "cms contact",
      path: "/cms/contact"
    },
    {
      id:13,
      name: "testimonial",
      path: "/cms/testimonials"
    },
    {
      id:14,
      name: "queries",
      path: "/quote"
    },
    {
      id:15,
      name: "customers",
      path: "/customers"
    },
    {
      id:16,
      name: "profile",
      path: "/profile"
    },
    {
      id:17,
      name: "website settings",
      path: "/website-settings"
    },

]

const pathname = usePathname().split("/").pop()

  const router = useRouter();

  const handleChange = (e) =>{
    const {name, value} = e.target;
    const filter = pages.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
    
    setSearchData(value)
    setRelatedData(filter.length > 0 ? filter : [])
   
  }

  

  return (
    <>
      
      <NotificationSidebar
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />

      <div className="fixed top-0 p-5 z-99 w-full pl-84 bg-violet-50 flex items-center gap-5">
        <div className="w-[55%]">
          <div className="bg-white p-2 px-5 rounded-lg flex items-center gap-4 shadow-[0_0_8px_#00000010] relative z-[1111]">
            <IoIosSearch className="text-xl" />
            <input
              type="text"
              className="outline-none border-none w-full"
              placeholder="Search pages here..."
              value={searchData}
              onChange={(e)=>handleChange(e)}
            />
            {/* {searchData && <div className="backdrop-blur-sm fixed h-full w-full top-0 right-0 left-0 bottom-0 bg-black/10 z-8" onClick={()=>setSearchData("")}></div>} */}
            {searchData && <ul className="absolute w-full flex flex-col gap-2 top-[110%] left-0 p-5 px-7 bg-white rounded-lg shadow-[0_0_10px_#00000012] max-h-[400px] overflow-y-scroll overflow-hidden z-[10]">{relatedData.length> 0 ? relatedData.map((item, index)=>(
               
                <li key={item.id} className="w-full group"><Link href={`/admin${item.path}`} className={`${pathname.includes(item.path.split("/").pop()) ? "text-orange-400 bg-orange-100/80": "bg-slate-100"} capitalize block w-full group-hover:text-orange-400 px-4 py-2 rounded-md  group-hover:bg-orange-100/80`} > <CgWebsite /> {item.name}</Link></li>
              
            )) : <p className="text-center"> sorry <span className="text-orange-400">"{searchData}"</span> page not found</p>}</ul>}
          </div>
        </div>
        <div className="w-[15%] flex items-center gap-3">
          <button
            className="h-9 w-9 rounded-full bg-purple-200 hover:bg-purple-950 text-purple-950 hover:text-white flex items-center justify-center"
            onClick={() => router.back()}
          >
            <FaArrowLeft />
          </button>
          <button
            className="h-9 w-9 rounded-full bg-purple-200 hover:bg-purple-950 text-purple-950 hover:text-white flex items-center justify-center"
            onClick={() => router.forward()}
          >
            <FaArrowRight />
          </button>
        </div>
        <div className="w-[30%] flex items-center justify-end gap-7">
          <button
            className="relative cursor-pointer group"
            onClick={() => setShowNotification(true)}
          >
            <span className="text-2xl group-hover:text-orange-600">
              <IoIosNotificationsOutline />
            </span>
            <span className="bg-red-500 h-4 w-4 flex rounded-full items-center justify-center text-white absolute -top-1.5 -right-1 text-[10px]">
              {" "}
              2
            </span>
          </button>
          {/* <button className="relative cursor-pointer group" onClick={()=>toast.info("Sorry Admin service is under development")}>
               <span className='text-2xl group-hover:text-orange-600'><IoCartOutline /></span>
               <span className='bg-red-500 h-4 w-4 flex rounded-full items-center justify-center text-white absolute -top-1.5 -right-1 text-[10px]'> 2</span>
           </button> */}
          <Link
            href={"/admin/products/add-product"}
            className="bg-orange-500 flex items-center gap-3 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600"
          >
            <GoPlusCircle /> Add Product
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
