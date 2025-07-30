"use client"
import React, { useState } from 'react'
import { BsArrowRight } from "react-icons/bs";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

const notifications = [
  {
    id: 1,
    title: "New Order Received",
    message: "You have received a new order #12345.",
    type: "order",
    read: false,
    createdAt: "2025-07-19T10:30:00Z"
  },
  {
    id: 2,
    title: "User Registered",
    message: "Ajay Kumar has signed up as a supplier.",
    type: "user",
    read: false,
    createdAt: "2025-07-18T17:00:00Z"
  },
  {
    id: 3,
    title: "RFQ Submitted",
    message: "A new RFQ has been submitted by Mridul Saklani.",
    type: "rfq",
    read: true,
    createdAt: "2025-07-17T14:45:00Z"
  },
  {
    id: 4,
    title: "Payment Successful",
    message: "Payment of ₹25,000 was successful for invoice #7841.",
    type: "payment",
    read: true,
    createdAt: "2025-07-16T11:20:00Z"
  },
  {
    id: 5,
    title: "System Update",
    message: "Scheduled maintenance will occur on July 21 from 2AM–4AM.",
    type: "system",
    read: false,
    createdAt: "2025-07-15T09:00:00Z"
  },
  {
    id: 6,
    title: "New Message",
    message: "You received a message from Abhishek Rana.",
    type: "message",
    read: false,
    createdAt: "2025-07-14T19:30:00Z"
  },
  {
    id: 7,
    title: "New Message",
    message: "You received a message from Abhishek Rana.",
    type: "message",
    read: false,
    createdAt: "2025-07-14T19:30:00Z"
  },
  {
    id: 8,
    title: "New Message",
    message: "You received a message from Abhishek Rana.",
    type: "message",
    read: false,
    createdAt: "2025-07-14T19:30:00Z"
  },
  {
    id: 9,
    title: "New Message",
    message: "You received a message from Abhishek Rana.",
    type: "message",
    read: false,
    createdAt: "2025-07-14T19:30:00Z"
  },
  {
    id: 10,
    title: "New Message",
    message: "You received a message from Abhishek Rana.",
    type: "message",
    read: false,
    createdAt: "2025-07-14T19:30:00Z"
  },
];


const NotificationSidebar = ({showNotification, setShowNotification}) => {
    const [active, setActive] = useState(null)
    const [notificationsData, setNotificationData] = useState(notifications);

    const handleActive = (index)=>{
       setActive(active !== index ? index : null)
    }

    const handleDelete = async()=>{
        try {
            
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <>
     {showNotification && <div className="fixed w-full h-full top-0 left-0 right-0 bottom-0 z-149 bg-black/5" onClick={()=>setShowNotification(false)} ></div> }
      <div className={`fixed  ${showNotification ? "-right-0" : "-right-[100%]"} top-0 bottom-0 w-[420px] flex flex-col z-150 gap-4 bg-white `}>
       <div className="flex items-center justify-between px-10 py-6">
        <h2 className='text-xl font-medium'>Notifications</h2>
        <button className='text-2xl hover:text-orange-500' onClick={()=>setShowNotification(false)}><BsArrowRight /></button>
       </div>
       <div className="w-full border-b-1 border-slate-300"></div>
       
        
        <ul className="flex flex-col px-10 overflow-y-scroll h-[75vh]">
             {notificationsData?.length > 0 && notifications.map((item,index)=>(
              
               <li className='border-b-1 w-full border-stone-200' key={index}> <button className='flex w-full items-center gap-4 py-4  hover:bg-slate-50' onClick={()=>handleActive(index)}>
                <span className={`h-12 w-12 rounded-full flex items-center justify-center bg-blue-400 text-white text-xl`}><MdOutlineNotificationsActive /></span>
                <div className="flex flex-col gap-1">
                    <h3 className='text-orange-500 font-semibold'>{item.title}</h3>
                    <div className='flex items-center gap-1 text-[12px] text-slate-500'><CiClock2 />{item.createdAt.split('T')[0]}</div>
                </div>
                </button>
                <div className={`bg-sky-100  rounded-xl  ${active === index ? "h-auto px-5 py-2 mb-4":  "h-0 overflow-hidden"}`}>
                    <p className='text-stone-600 text-sm'>{item.message}</p>
                    </div> </li>
              
             ))}
        </ul>
        <div className="flex items-center gap-4 px-10 py-3">
            <button className='text-white capitalize font-medium bg-green-500 hover:bg-green-600 rounded-lg px-6 py-2.5 flex items-center gap-2'><FaCheck /> Make all read</button>
            <button className='text-white capitalize font-medium bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2.5 flex items-center gap-2'><MdDeleteOutline className='text-lg'/> Delete All</button>
        </div>
      
    </div>
    </>
  )
}

export default NotificationSidebar
