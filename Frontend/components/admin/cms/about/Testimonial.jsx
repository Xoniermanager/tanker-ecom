"use client";

import React, { useState, useEffect } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";
import api from "../../../user/common/api";
import { toast } from "react-toastify";

const Testimonial = ({ testimonialData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null)
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
  });

 useEffect(() => {
        setFormData({
          heading: testimonialData?.heading || "N/A",
          subHeading: testimonialData?.subheading || "N/A"
        })
      }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const payload = {
        section_id: sectionId,
        heading: formData.heading,
        subheading: formData.subHeading,
        order: 5,

       
      };

      const response = await api.put(`/cms/sections/${sectionId}`, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success("Data updated successfully");
        setErrMessage(null);
      }
    } catch (error) {
      // console.error(error);
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
    <div className="bg-white p-6 rounded-xl border  border-gray-200">
      <h3 className="font-semibold text-xl mb-4">Testimonial</h3>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="grid grid-cols-2 gap-5">
           <div className="flex flex-col gap-2">
            <label htmlFor="heading">Heading </label>
            <input
              type="text"
              name="heading"
              placeholder="Heading"
              value={formData.heading}
              onChange={handleChange}
              className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subHeading">Sub Heading</label>
            <input
              type="text"
              name="subHeading"
              placeholder="Sub Heading"
              value={formData.subHeading}
              onChange={handleChange}
              className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
                  {errMessage && (
                    <p className="text-sm text-red-600 font-medium">{errMessage}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
                  >
                    {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
                  </button>
                </div>
      </form>
    </div>
  );
};

export default Testimonial;
