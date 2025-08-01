"use client";
import Image from "next/image";
import Link from "next/link";
import React, { act, useState } from "react";
import { HiOutlineChartBar, HiArrowLongRight } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { BsBoxSeam, BsQuestionCircle } from "react-icons/bs";
import { FiTruck } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { MdContentPaste } from "react-icons/md";

const Sidebar = () => {
  const [active, setActive] = useState(0);

  const path = usePathname();
  const pathname = path.split("/");
  const pathpop = path.split("/").pop();

  const handleActive = (no) => {
    setActive(active !== no ? no : 0);
  };

  return (
    <div className="fixed top-0 left-0 w-80 z-100 flex flex-col gap-8 p-6 bg-violet-100 h-full">
      <div className="">
        <Image
          className="bg-contain"
          src={"/images/tanker-solution-logo.png"}
          height={200}
          width={200}
          alt="Tanker Logo"
        />
      </div>
      <div className="bg-white flex items-center gap-4 p-3 rounded-lg">
        <Image
          className="bg-cover rounded-full w-11 h-11"
          src={"/images/Employee_one.jpg"}
          height={40}
          width={40}
          alt="user"
        />
        <div className="flex flex-col gap-0.5">
          <h3 className="text-orange-600 font-bold">Mridul Saklani</h3>
          <span className="text-sm text-gray-500 font-medium">Admin</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500 font-medium">E-Commerce</span>
        <ul className="flex flex-col gap-0">
          <li>
            {" "}
            <Link
              href={`/dashboard`}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl ${
                pathpop === "dashboard"
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500"
                  : "bg-transparent  "
              } `}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center  rounded-full text-lg ${
                  pathpop === "dashboard" && "text-orange-600 bg-white"
                }`}
              >
                <HiOutlineChartBar />
              </span>
              <span
                className={`font-medium ${
                  pathpop === "dashboard" && "text-orange-600"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            {" "}
            <div
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl group cursor-pointer ${
                pathname.includes("orders")
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500 "
                  : "bg-transparent  "
              } `}
              onClick={() => handleActive(1)}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center rounded-full  text-lg ${
                  pathname.includes("orders") && "text-orange-600 bg-white "
                }`}
              >
                <BsBoxSeam className="group-hover:scale-110 group-hover:text-orange-600 text-lg" />
              </span>
              <span
                className={`font-medium ${
                  pathname.includes("orders") && "text-orange-600"
                } group-hover:text-orange-600`}
              >
                Orders
              </span>
              <span
                className={`text-slate-500 group-hover:text-orange-600 ${
                  active === 1 && "rotate-90"
                }`}
              >
                <HiArrowLongRight />
              </span>
            </div>
            <ul
              className={`flex flex-col gap-4 pl-16  h-0 overflow-hidden ${
                active === 1 && "h-auto my-4"
              }`}
            >
              <li className="">
                <Link
                  href={`/dashboard/orders`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("orders") && "text-orange-600"
                  } `}
                >
                  {" "}
                  List{" "}
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/detail`}
                  className="font-medium hover:text-orange-600"
                >
                  {" "}
                  Details{" "}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            {" "}
            <div
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl group cursor-pointer ${
                pathname.includes("products")
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500 "
                  : "bg-transparent  "
              } `}
              onClick={() => handleActive(2)}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center rounded-full  text-lg ${
                  pathname.includes("products") && "text-orange-600 bg-white "
                }`}
              >
                <FiTruck className="group-hover:scale-110 group-hover:text-orange-600 text-lg" />
              </span>
              <span
                className={`font-medium ${
                  pathname.includes("products") && "text-orange-600"
                } group-hover:text-orange-600`}
              >
                Products
              </span>
              <span
                className={`text-slate-500 group-hover:text-orange-600 ${
                  active === 2 && "rotate-90"
                }`}
              >
                <HiArrowLongRight />
              </span>
            </div>
            <ul
              className={`flex flex-col gap-4 pl-16  h-0 overflow-hidden ${
                active === 2 && "h-auto my-4"
              }`}
            >
              <li className="">
                <Link
                  href={`/dashboard/products/add-category`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("add-category") && "text-orange-600"
                  } `}
                >
                  {" "}
                  Add Category
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/products/add-product`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("add-product") && "text-orange-600"
                  } `}
                >
                  {" "}
                  Add Product
                </Link>
              </li>
              
              <li className="">
                <Link
                  href={`/dashboard/products`}
                  className={`font-medium hover:text-orange-600 ${
                    pathpop === "products" && "text-orange-600"
                  } `}
                >
                  {" "}
                  List View{" "}
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/detail`}
                  className="font-medium hover:text-orange-600"
                >
                  {" "}
                  Product Details{" "}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            {" "}
            <div
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl group cursor-pointer ${
                pathname.includes("cms")
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500 "
                  : "bg-transparent  "
              } `}
              onClick={() => handleActive(3)}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center rounded-full  text-lg ${
                  pathname.includes("products") && "text-orange-600 bg-white "
                }`}
              >
                <MdContentPaste  className="group-hover:scale-110 group-hover:text-orange-600 text-lg" />
              </span>
              <span
                className={`font-medium ${
                  pathname.includes("products") && "text-orange-600"
                } group-hover:text-orange-600`}
              >
                CMS
              </span>
              <span
                className={`text-slate-500 group-hover:text-orange-600 ${
                  active === 3 && "rotate-90"
                }`}
              >
                <HiArrowLongRight />
              </span>
            </div>
            <ul
              className={`flex flex-col gap-4 pl-16  h-0 overflow-hidden ${
                active === 3 && "h-auto my-4"
              }`}
            >
              <li className="">
                <Link
                  href={`/dashboard/cms/home`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("home") && "text-orange-600"
                  } `}
                >
                  {" "}
                  Home
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/cms/about`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("about") && "text-orange-600"
                  } `}
                >
                  {" "}
                  About Us
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/cms/services`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("services") && "text-orange-600"
                  } `}
                >
                  {" "}
                  Services
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/cms/contact`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("contact") && "text-orange-600"
                  } `}
                >
                  {" "}
                  Contact Us
                </Link>
              </li>
              
            </ul>
          </li>
          <li>
            {" "}
            <Link
              href={`/dashboard/customers`}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl ${
                pathpop === "customers"
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500"
                  : "bg-transparent  "
              } `}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center  rounded-full text-lg ${
                  pathpop === "customers" && "text-orange-600 bg-white"
                }`}
              >
                <FaRegUser />
              </span>
              <span
                className={`font-medium ${
                  pathpop === "customers" && "text-orange-600"
                }`}
              >
                Customers
              </span>
            </Link>
          </li>
          <li>
            {" "}
            <Link
              href={`/dashboard/invoice`}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl ${
                pathpop === "invoices"
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500"
                  : "bg-transparent  "
              } `}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center  rounded-full text-lg ${
                  pathpop === "invoices" && "text-orange-600 bg-white"
                }`}
              >
                <LiaFileInvoiceDollarSolid />
              </span>
              <span
                className={`font-medium ${
                  pathpop === "invoices" && "text-orange-600"
                }`}
              >
                Invoices
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500 font-medium capitalize">
          pages
        </span>
        <ul className="flex flex-col gap-0">
          <li>
            {" "}
            <div
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl group cursor-pointer ${
                pathname.includes("profile")
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500 "
                  : "bg-transparent  "
              } `}
              onClick={() => handleActive(3)}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center rounded-full  text-lg ${
                  pathname.includes("profile") && "text-orange-600 bg-white "
                }`}
              >
                <CgProfile className="group-hover:scale-110 group-hover:text-orange-600 text-xl" />
              </span>
              <span
                className={`font-medium ${
                  pathname.includes("profile") && "text-orange-600"
                } group-hover:text-orange-600`}
              >
                Profile
              </span>
              <span
                className={`text-slate-500 group-hover:text-orange-600 ${
                  active === 3 && "rotate-90"
                }`}
              >
                <HiArrowLongRight />
              </span>
            </div>
            <ul
              className={`flex flex-col gap-4 pl-16  h-0 overflow-hidden ${
                active === 3 && "h-auto my-4"
              }`}
            >
              <li className="">
                <Link
                  href={`/dashboard/profile`}
                  className={`font-medium hover:text-orange-600 ${
                    pathname.includes("profile") && "text-orange-600"
                  } `}
                >
                  {" "}
                  My Profile{" "}
                </Link>
              </li>
              <li className="">
                <Link
                  href={`/dashboard/detail`}
                  className="font-medium hover:text-orange-600"
                >
                  {" "}
                  Details{" "}
                </Link>
              </li>
            </ul>
          </li>
          <li>
            {" "}
            <Link
              href={`/dashboard/settings`}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl ${
                pathpop === "settings"
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500"
                  : "bg-transparent  "
              } `}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center  rounded-full text-lg ${
                  pathpop === "settings" && "text-orange-600 bg-white"
                }`}
              >
                <IoSettingsOutline />
              </span>
              <span
                className={`font-medium ${
                  pathpop === "settings" && "text-orange-600"
                }`}
              >
                Settings
              </span>
            </Link>
          </li>
          <li>
            {" "}
            <Link
              href={`/dashboard/faqs`}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-bl-3xl rounded-tr-3xl ${
                pathpop === "faqs"
                  ? "bg-amber-200/50 border-r-2 border-l-orange-600 border-l-2 border-r-orange-500"
                  : "bg-transparent  "
              } `}
            >
              <span
                className={`h-9 w-9 flex items-center justify-center  rounded-full text-lg ${
                  pathpop === "faqs" && "text-orange-600 bg-white"
                }`}
              >
                <BsQuestionCircle />
              </span>
              <span
                className={`font-medium ${
                  pathpop === "faqs" && "text-orange-600"
                }`}
              >
                Faqs
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
