"use client";
import React, { useState } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";

const Article = () => {
     const [isLoading, setIsLoading] = useState(false);
      const [errMessage, setErrMessage] = useState(null);
      const [formData, setFormData] = useState({
        heading: "",
        subHeading: "",
        para: "",
      });
    
      const handleChange = (e)=>{
          const {name, value} = e.target;
          setFormData({...formData, [name]: value})
      }
    
       const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrMessage(null);
    
        try {
        } catch (error) {
          console.error(error);
          const message =
            (Array.isArray(error?.response?.data?.errors) &&
              error.response.data.errors[0]?.message) ||
            error?.response?.data?.message ||
            "Something went wrong";
          setErrMessage(message);
        } finally {
          setIsLoading(false);
        }
      };
  return (
    <>
       <div className="bg-white p-7 rounded-lg flex flex-col gap-5">
           <h2 className="font-semibold text-2xl">Article</h2>
           <form
                onSubmit={handleSubmit}
                className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
              >
                   <div className="grid grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                    <label htmlFor="heading">Heading</label>
                    <input
                      type="text"
                      name="heading"
                      className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                      placeholder="Heading"
                      value={formData.heading}
                      onChange={handleChange}
                    />
                  </div>
      
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subHeading">Sub Heading</label>
                    <input
                      type="text"
                      name="subHeading"
                      className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                      placeholder="Sub Heading"
                      value={formData.subHeading}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-2">
                    <label htmlFor="para">Para</label>
                    <textarea
                      name="para"
                      className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                      placeholder="Para"
                      value={formData.para}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                   </div>
                   <div className=" flex justify-end">
                               <button
                                 type="submit"
                                 disabled={isLoading}
                                 className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 font-medium rounded flex items-center gap-2"
                               >
                                 {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
                               </button>
                             </div>
                   
                             {errMessage && (
                               <p className="text-red-500 font-medium mt-2">{errMessage}</p>
                             )}
              
           </form>
         </div>
    </>
  )
}

export default Article
