"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaRegUser } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useCart } from "../../../context/cart/CartContext";
import { useAuth } from "../../../context/user/AuthContext";
import { TbTruckLoading } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaXmark } from "react-icons/fa6";


const Navbar = ({siteData}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sideMenuShow, setSideMenuShow] = useState(false);
  const pathname = usePathname();



  const { cartData, isLoading, count, setCartData, } = useCart();

  const { isAuthenticated, handleLogout, userData } = useAuth();

  const handleLogoutMain = async()=> {

    await handleLogout()
    setSideMenuShow(false)
    setCartData(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`backdrop-blur-sm bg-black/10 top-0 left-0 right-0 bottom-0 fixed z-1000 ${sideMenuShow ? "block" : "hidden"}`}onClick={()=>setSideMenuShow(false)}></div>
      <div className={`fixed top-0 ${sideMenuShow ? "right-0 w-full md:w-[50%]" : "-right-[100%]  "} h-[100%] z-1001 bg-white px-6 py-4 flex flex-col gap-4`}>
        <div className="flex items-center justify-between">
          <Link href={"/"} className="">
              <Image
                src={siteData?.siteDetails?.logo?.url || "/images/tanker-solution-logo.png"}
                width={230}
                height={120}
                className="h-20 w-36  object-contain "
                alt="logo"
              />
            </Link>
            <button className="h-10 w-10 rounded-full flex group items-center justify-center bg-purple-900 text-white text-2xl" onClick={()=>setSideMenuShow(false)}>
                <FaXmark className="group-hover:rotate-90"/>
            </button>
        </div>
        <div className="w-full border-b-1 border-slate-200"></div>
         <ul className="flex flex-col items-start justify-start gap-4 md:gap-6 px-3">
                <li>
                  <Link
                    href={"/"}
                    className={`${
                      pathname === "/" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 `}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/about"}
                    className={`${
                      pathname === "/about" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li
                  className="relative"
                  // onMouseEnter={() => setIsHovered(true)}
                  // onMouseLeave={() => setIsHovered(false)}
                >
                  <Link
                    href="/products"
                    className={`${
                      pathname.includes("products") && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    Product
                  </Link>

                  {/* <AnimatePresence>
                    {(isHovered && userData?.role === "user" ) && (
                      <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute w-48 bg-white rounded-lg shadow-md z-20 top-[135%] -left-10 px-3 py-2 border border-slate-200"
                      >
                        <li>
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-orange-50 hover:text-orange-400 transition "
                          >
                           <TbTruckLoading className="text-lg"/> Orders
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence> */}
                </li>
               {isAuthenticated && <li>
                  <Link
                    href={"/orders"}
                    className={`${
                      pathname === "/orders" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    Orders
                  </Link>
                </li>}
                <li>
                  <Link
                    href={"/news"}
                    className={`${
                      pathname === "/news" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    News Feed
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/gallery"}
                    className={`${
                      pathname === "/gallery" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/contact"}
                    className={`${
                      pathname === "/contact" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    onClick={()=>setSideMenuShow(false)}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
     <div className="w-full border-b-1 border-slate-200"></div>
               {isAuthenticated ? (
              <>
              <button className="btn-two w-fit" onClick={handleLogoutMain}>
                {" "}
                Logout{" "}
              </button>
              </>
            ) : (
              <>
                <Link href={"/login"} onClick={()=>setSideMenuShow(false)} className="btn-one font-semibold">
                  B2B Login
                </Link>
                <Link href={"/signup"} onClick={()=>setSideMenuShow(false)} className="btn-two font-semibold">
                  Sign Up
                </Link>
              </>
            )}
      </div>
      <div className="w-full bg-white shadow-[5px_0_20px_#00000025] flex flex-col">
        <div className="bg-purple-950 py-2.5 w-full">
          <div className="max-w-full px-4 mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              {siteData?.contactDetails?.socialMediaLinks?.facebook && (
                <Link
                  href={siteData?.contactDetails?.socialMediaLinks?.facebook}
                  className="text-white"
                >
                  {" "}
                  <FaFacebookF />{" "}
                </Link>
              )}
              <span className="h-[20px] border-r-1 border-white"></span>
              <Image src={"/images/box.png"} width={20} height={20} alt="box" />
              <span className="text-white text-[12px] sm:text-sm lg:text-[16px]">
                {siteData?.siteDetails?.slogan}
              </span>
            </div>
            <Link
              href={`tel:${siteData?.contactDetails?.phoneNumbers?.contact_one}`}
              className="flex items-center gap-4 group"
            >
              <span className="h-9 md:h-11 w-9 md:w-11 bg-black rounded-full text-white flex items-center justify-center text-lg md:text-2xl">
                <FiPhoneCall />
              </span>
              <div className=" hidden md:flex flex-col gap-0">
                <h4 className="uppercase font-semibold text-white sm:text-[12px] md:text-sm lg:text-[16px]">support</h4>
                <p className="group-hover:text-orange-400 text-white">
                  {siteData?.contactDetails?.phoneNumbers?.contact_one}
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div
          className={`max-w-full px-4 py-2 md:py-3 flex items-center bg-white mid-nav transition-all duration-300 ${
            isSticky
              ? "fixed top-0 left-0 w-full z-[400] shadow-lg animate-slideDown"
              : "relative"
          }`}
        >
          <div className="w-[60%] lg:w-[20%] ">
            <Link href={"/"}>
              <Image
                src={siteData?.siteDetails?.logo?.url || "/images/tanker-solution-logo.png"}
                width={190}
                height={120}
                className="h-18 w-38 lg:w-44 object-contain "
                alt="logo"
              />
            </Link>
          </div>

          <div className="hidden lg:block lg:w-[45%] ">
            <nav>
              <ul className="flex items-start justify-start gap-6">
                <li>
                  <Link
                    href={"/"}
                    className={`${
                      pathname === "/" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400`}
                   
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/about"}
                    className={`${
                      pathname === "/about" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    
                  >
                    About Us
                  </Link>
                </li>
                <li
                  className="relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Link
                    href="/products"
                    className={`${
                      pathname.includes("products") && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    
                  >
                    Product
                  </Link>

                  <AnimatePresence>
                    {(isHovered && userData?.role === "user" ) && (
                      <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute w-48 bg-white rounded-lg shadow-md z-20 top-[135%] -left-10 px-3 py-2 border border-slate-200"
                      >
                        <li>
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-orange-50 hover:text-orange-400 transition "
                          >
                           <TbTruckLoading className="text-lg"/> Orders
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <Link
                    href={"/news"}
                    className={`${
                      pathname === "/news" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                   
                  >
                    News Feed
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/gallery"}
                    className={`${
                      pathname === "/gallery" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/contact"}
                    className={`${
                      pathname === "/contact" && "text-orange-400"
                    } text-neutral-900 text-lg hover:text-orange-400 text-nowrap`}
                    
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="w-[40%] flex items-center justify-end gap-3 md:gap-5">
            {(isAuthenticated && userData.role === "user")  && (userData.profileImage ? <Link href={"/profile"} className="h-11 group w-11 rounded-full overflow-hidden"><Image src={userData.profileImage} height={100} width={100} alt={userData.fullName} className="object-cover h-11 w-11 object-center  group-hover:scale-115" /></Link> : <Link href={"/profile"} className="h-11 w-11 bg-purple-900 hover:bg-purple-950 rounded-full flex items-center justify-center text-white">
            <FaRegUser className=""/>
            </Link>)}
            {(userData?.role !== "admin")  && <div className="relative">
              <Link
                href={"/cart"}
                className="h-10 w-10 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center text-white"
              >
                <IoCartOutline className="text-lg" />
              </Link>
              <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full flex items-center justify-center bg-purple-950 text-white text-[11px]">
                {isLoading ? "..." : count || 0}
              </span>
            </div>}
             {(isAuthenticated && userData.role === "admin")  &&<div className="relative group"> <Link
                href={"/admin/dashboard"}
                className="h-10 w-10 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center text-white"
              >
                <MdOutlineDashboard className="text-lg" />
              </Link> <span className="bg-slate-900 p-0.5 px-2 rounded-md text-[12px] text-white hidden group-hover:block absolute text-nowrap w-fit top-[114%]  z-100 -left-1/2">Go to dashboard</span> </div>}
            {isAuthenticated ? (
              <>
              <button className="hidden lg:block btn-two" onClick={handleLogoutMain}>
                {" "}
                Logout{" "}
              </button>
              <button className="h-10 w-10 rounded-full lg:hidden text-white bg-orange-500 flex items-center justify-center" onClick={()=>setSideMenuShow(true)}><GiHamburgerMenu /></button></>
            ) : (
              <>
                <button className="h-10 w-10 rounded-full lg:hidden text-white bg-orange-500 flex items-center justify-center" onClick={()=>setSideMenuShow(true)}><GiHamburgerMenu /></button>
                <Link href={"/login"} className="btn-one hidden lg:block font-semibold">
                  B2B Login
                </Link>
                <Link href={"/signup"} className="btn-two hidden lg:block font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
