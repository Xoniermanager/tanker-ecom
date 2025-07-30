"use client";
import React, { useState, useEffect } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";
import api from "../../../user/common/api";
import { toast } from "react-toastify";
import Link from "next/link";

const Contact = ({contactsData}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    contact: [
      {
        order: "",
        title: "",
        description: "",
      },
    ],
  });

  useEffect(() => {
      setFormData({
        heading: contactsData.heading || "N/A",
        subHeading: contactsData.subheading || "N/A",
        contact: contactsData.contents || "N/A",
      });
      setSectionId(contactsData.section_id || "N/A")
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactChange = (index, name, e) => {
    const { value } = e.target;
    const updatedContact = [...formData.contact];
    if (name === "order") {
      updatedContact[index][name] = Number(value);
    } else {
      updatedContact[index][name] = value;
    }

    setFormData({ ...formData, list: updatedContact });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const payload = {
        order: 2,
        section_id: sectionId,
        heading: formData.heading,
        subheading: formData.subHeading,
        contents: formData.contact
      };

      const response = await api.put(`/cms/sections/${sectionId}`, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success("Data updated successfully");
        setErrMessage(null);
      }
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
        <h2 className="font-semibold text-2xl">Address</h2>
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
          </div>
          <div className=" flex flex-col gap-6">
          {formData.contact.map((item, i) => (
            <div className="grid grid-cols-2 gap-5 bg-blue-50  p-6 rounded-lg">
              <div className="flex flex-col gap-2">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  value={item.title}
                  onChange={(e) => handleContactChange(i, "title", e)}
                  className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                  placeholder="Address Title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="order">Order</label>
                <input
                  type="number"
                  name="order"
                  value={item.order}
                  onChange={(e) => handleContactChange(i, "order", e)}
                  className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                  placeholder="order"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="description">Address</label>
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleContactChange(i, "description", e)}
                  className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                  placeholder="Enter you address"
                />
              </div>
            </div>
          ))}
        </div>
        {errMessage && (
          <div className="col-span-2 flex justify-end">
            <p className="text-red-500">{errMessage}</p>
          </div>
        )}

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={formData.title === "" || formData.subHeading === ""}
            className="px-8 py-2.5 rounded-lg disabled:bg-purple-300 bg-purple-900 hover:bg-purple-950 font-medium text-white "
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
        </form>
      </div>
    </>
  );
};

export default Contact;
