"use client";
import Image from "next/image";
import React, { useState, useEffect, act } from "react";
import api from "../../user/common/api";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuUpload } from "react-icons/lu";

const ProfileSettingComponent = () => {
  const [userData, setUserData] = useState(null);
  const [active, setActive] = useState(1);
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
   
    name: "",
    email: "",
    alternativeEmail: "",
    number: "",
    profileImage:"",
    address:"",
    websiteLink:""
    
    
  })

  // Handle Change

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData(prev=> ({...prev, [name]: value}))
  }

  // GET USER DATA

  const getData = async () => {
    try {
      const response = await api.get(`/`, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  // Handle Submit

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.get(``, {withCredentials: true})
    } catch (error) {
      // console.error(error)
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex  gap-8">
      <div className="w-2/3 flex flex-col gap-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-6">
            <Image
              className="rounded-full object-cover w-28 h-28"
              src={"/images/Employee_one.jpg"}
              height={150}
              width={150}
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold">Mridul Saklani</h3>
              <div className="flex items-center gap-4">
                <button className="bg-purple-400 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-lg">
                  {" "}
                  Change Avatar
                </button>{" "}
                <button className="h-10 w-12 rounded-lg flex items-center justify-center border-1 border-purple-400 text-purple-400 text-xl hover:bg-purple-500 hover:border-purple-500 hover:text-white">
                  <MdOutlineDelete />
                </button>
              </div>
              <p className="text-slate-500 text-sm">
                For best results, use an image at least 256px by 256px in either
                .jpg or .png format
              </p>
            </div>
          </div>

          <div className="w-full bg-white p-6 rounded-xl">
             <h2 className="text-2xl font-semibold mb-4">Admin Details</h2>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
             
              <div className="grid grid-cols-2 gap-6 ">
                 <div className="flex flex-col gap-2">
                  <label htmlFor="name">Name</label>
                  <input
                  type="text"
                  name="name"
                  className="border-1 border-neutral-200 rounded-lg py-2.5 px-5 outline-none"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                 </div>
                 <div className="flex flex-col gap-2">
                  <label htmlFor="email">Email</label>
                  <input
                  type="email"
                  name="email"
                  className="border-1 border-neutral-200 rounded-lg py-2.5 px-5 outline-none"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                 </div>
                 <div className="flex flex-col gap-2">
                  <label htmlFor="alternativeEmail">Alternative Email</label>
                  <input
                  type="email"
                  name="alternativeEmail"
                  className="border-1 border-neutral-200 rounded-lg py-2.5 px-5 outline-none"
                  placeholder="Enter Your Alternative Email"
                  value={formData.alternativeEmail}
                  onChange={handleChange}
                  required
                />
                 </div>
                 <div className="flex flex-col gap-2">
                  <label htmlFor="number">Contact Number</label>
                  <input
                  type="number"
                  name="number"
                  className="border-1 border-neutral-200 rounded-lg py-2.5 px-5 outline-none"
                  placeholder="Enter Your Contact"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
                 </div>
                 <div className="flex flex-col gap-2">
                  <label htmlFor="websiteLink">Website Link</label>
                  <input
                  type="url"
                  name="websiteLink"
                  className="border-1 border-neutral-200 rounded-lg py-2.5 px-5 outline-none"
                  placeholder="Enter Your Website Link"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  required
                />
                 </div>
                 
              </div>
              <div className="flex w-full justify-end">
                <button type="submit" className="text-white bg-orange-400 px-6 py-2.5 rounded-lg hover:bg-orange-500 flex items-center gap-2">Submit <LuUpload /></button>
              </div>
              
              
            </form>

          </div>
        </div>
      </div>
      <div className="w-1/3">
        <ul className="bg-white p-6 rounded-xl flex flex-col gap-2">
          <li>
            <button
              className={`${
                active === 1
                  ? "bg-orange-100 text-orange-400"
                  : "text-slate-600 hover:text-slate-900"
              } flex p-2 px-4 w-full rounded-md items-center gap-2 `}
              onClick={() => setActive(1)}
            >
              {" "}
              <FaRegUser /> Profile{" "}
            </button>
          </li>
          <li>
            <button
              className={` ${
                active === 2
                  ? "bg-orange-100 text-orange-400"
                  : "text-slate-600 hover:text-slate-900"
              } flex p-2 px-4 rounded-md items-center w-full gap-2 `}
              onClick={() => setActive(2)}
            >
              {" "}
              <TbLockPassword className="text-md" /> Password{" "}
            </button>
          </li>
          <li>
            <button
              className={` ${
                active === 3
                  ? "bg-orange-100 text-orange-400"
                  : "text-slate-600 hover:text-slate-900"
              } flex p-2 px-4 rounded-md items-center w-full gap-2 `}
              onClick={() => setActive(3)}
            >
              {" "}
              <IoIosNotificationsOutline className="text-md" /> Notifications{" "}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSettingComponent;
