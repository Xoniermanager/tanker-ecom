"use client";

import React, { useState } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";

const Testimonial = () => {
    const [isLoading, setIsLoading] = useState(false);
      const [errMessage, setErrMessage] = useState(null);
      const [formData, setFormData] = useState({
        heading: "",
        subHeading: "",
        para: "",
      });

       const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        'Something went wrong';
      setErrMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="bg-white p-6 rounded-xl border  border-gray-200">
        <h3 className="font-semibold text-xl mb-4">Testimonial</h3>
        <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="grid grid-cols-2 gap-5">
            
        </div>
      </form>
      
    </div>
  )
}

export default Testimonial
