"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import api from "../common/api";

const ContactComponent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errMessage, setErrMessage] = useState(null)
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        number:"",
        email:"",
        message:""
    })

    const handleChange=(e)=>{
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await api.post('');
            if(response.status === 200){
                setFormData({
                    firstName:"",
                    lastName:"",
                    number:"",
                    email:"",
                    message:""
                })
            }
        } catch (error) {
            console.error(error)
            setErrMessage(error?.response?.data?.message || "something went wrong")

        }
        finally{
            setIsLoading(false)
        }
    }


  return (
    <>
      <div className="py-28 bg-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col gap-22">
          <div className="flex items-center gap-12">
            <div className="w-[43%] flex flex-col gap-10">
                <div className="flex flex-col gap-4">
              <h2 className="text-5xl font-bold text-purple-950 w-[85%] leading-14">
                Let's Contact For Better Result
              </h2>
              <p className="text-zinc-500 text-lg font-medium">
                You can also reach out to us by phone or email
              </p>
              </div>
              <Link href={'/'} className="bg-white rounded-4xl p-5 px-7 flex items-center gap-8 hover:shadow-[0_0_16px_#00000012] hover:scale-103 group">
                <div className="flex flex-col gap-2">
                  <h4 className="font-black text-purple-950 text-2xl tracking-wide">
                    Head Office
                  </h4>
                  <p className="text-zinc-500 text-lg font-medium">
                    8-10 Makaro Street, Porirua, 5022, NEW ZEALAND
                  </p>
                </div>
                <div className="h-18 w-18 min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-4xl">
                       <IoLocationOutline className="group-hover:scale-108 duration-500"/>
                </div>
              </Link>
              <Link href={'/'} className="bg-white rounded-4xl p-5 px-7 flex items-center gap-8 hover:shadow-[0_0_16px_#00000012] hover:scale-103 group">
                <div className="flex flex-col gap-2">
                  <h4 className="font-black text-purple-950 text-2xl tracking-wide">
                    Service Depot
                  </h4>
                  <p className="text-zinc-500 text-lg font-medium">
                    21A Barnes Street, Seaview, Lower Hutt, 5010
                  </p>
                </div>
                <div className="h-18 w-18 min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-4xl">
                       <RiCustomerService2Fill className="group-hover:scale-108 duration-500"/>
                </div>
              </Link>
            </div>
            <div className="w-[57%] flex flex-col gap-4">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.9699898533486!2d174.8303477!3d-41.1384791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d3f531165bb3595%3A0xa90c817be87ab284!2s8%20Makaro%20Street%2C%20Elsdon%2C%20Porirua%205022%2C%20New%20Zealand!5e1!3m2!1sen!2sin!4v1751610971477!5m2!1sen!2sin" width="600" height="550" style={{border:"8"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-2xl border-8 border-white w-full"></iframe>
            </div>
          </div>
          <div className="border-b-1 border-stone-300/80 w-full"></div>
          <div className="flex items-center gap-12">
            <div className="w-[43%] flex flex-col gap-5">
  <h2 className="text-5xl font-bold text-purple-950 w-[85%] leading-14">
                Please Contact To Speak With Our Kind Staff
              </h2>
              <p className="text-zinc-500 text-lg font-medium">
                Drop us a line and we will ensure the appropriate team responds to your enquiry.
              </p>
              <Image src={'/images/contact-img.png'} className="w-full object-contain" height={300} width={300} alt="contact"/>
            </div>
            <div className="w-[57%] ">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-xl p-10">
                <div className="flex flex-col gap-3">
                    <label htmlFor="firstName" className="flex items-center gap-1.5 text-purple-950 font-medium"><FaUser /> First Name</label>
                    <input type="text" name="firstName" className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5" value={formData.firstName} placeholder="First Name" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="lastName" className="flex items-center gap-1.5 text-purple-950 font-medium"><FaUser /> Last Last</label>
                    <input type="text" name="lastName" className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5" value={formData.lastName} placeholder="Last Name" onChange={handleChange}/>
                </div>
                <div className="flex items-center gap-5 ">
                    <div className="flex w-1/2 flex-col gap-3">
                    <label htmlFor="number" className="flex items-center gap-1.5 text-purple-950 font-medium"><FaPhoneAlt /> Phone</label>
                    <input type="number" name="number" className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5" value={formData.number} placeholder="Your Contact Number" onChange={handleChange}/>
                </div>
                    <div className="flex w-1/2 flex-col gap-3">
                    <label htmlFor="email" className="flex items-center gap-1.5 text-purple-950 font-medium"><FaEnvelope /> Email</label>
                    <input type="email" name="email" className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5" value={formData.email} placeholder="Your Email" onChange={handleChange}/>
                </div>
                </div>
                 <div className="flex flex-col gap-3">
                    <label htmlFor="message" className="flex items-center gap-1.5 text-purple-950 font-medium"><BiSolidMessageRounded /> Message</label>
                    <textarea type="text" name="message" className="border-stone-200 border-1 rounded-lg outline-none px-6 py-3.5" value={formData.message} placeholder="Write Message..." onChange={handleChange} rows={5}/>
                </div>
                <div className="flex justify-end">
                   <p className="text-red-500 ">{errMessage}</p>
                </div>
                <div className="flex">
                    <button type="submit" disabled={formData.number === "" || formData.firstName === "" || formData.lastName === "" || formData.email === ""} className="uppercase font-bold tracking-wide  disabled:bg-black/60 bg-black hover:bg-orange-400 text-white px-9 py-4 rounded-md">Send message</button>
                </div>
                </form>

            </div>
            
          </div>
          <div className="grid grid-cols-3 gap-12">
                <Link href={'mailto:mark@tankersolutions.co.nz'} className="bg-white p-7 px-9 rounded-4xl hover:scale-103 flex items-center justify-between gap-5 hover:shadow-[0_0_18px_#00000020]">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-purple-950">Sales Enquiry</h2>
                        <p className="text-zinc-500 text-lg font-medium">mark@tankersolutions.co.nz</p>
                    </div>
                    <div className="h-18 w-18 min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-4xl">
                       <RiCustomerService2Fill className="group-hover:scale-108 duration-500"/>
                </div>
                </Link>
                <Link href={'mailto:scott@tankersolutions.co.nz'} className="bg-white p-7 px-9 rounded-4xl hover:scale-103 flex items-center justify-between gap-5 hover:shadow-[0_0_18px_#00000020]">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-purple-950">BDM</h2>
                        <p className="text-zinc-500 text-lg font-medium">scott@tankersolutions.co.nz</p>
                    </div>
                    <div className="h-18 w-18 min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-4xl">
                       <RiCustomerService2Fill className="group-hover:scale-108 duration-500"/>
                </div>
                </Link>
                <Link href={'tel:027 525 0551'} className="bg-white p-7 px-9 rounded-4xl hover:scale-103 flex items-center justify-between gap-5 hover:shadow-[0_0_18px_#00000020]">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-purple-950">Service Depot</h2>
                        <p className="text-zinc-500 text-lg font-medium">027 525 0551</p>
                    </div>
                    <div className="h-18 w-18 min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-4xl">
                       <RiCustomerService2Fill className="group-hover:scale-108 duration-500"/>
                </div>
                </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default ContactComponent;
