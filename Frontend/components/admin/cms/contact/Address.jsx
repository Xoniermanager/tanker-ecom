"use client";
import React, { useState, useEffect } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";
import api from "../../../user/common/api";
import { toast } from "react-toastify";
import Link from "next/link";

const Address = ({ addressData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    address: [
      {
        order: "",
        title: "",
        description: "",
      },
    ],
  });

  useEffect(() => {
    setFormData({
      heading: addressData.heading || "N/A",
      subHeading: addressData.subheading || "N/A",
      address: addressData.contents || "N/A",
    });
    setSectionId(addressData.section_id || "N/A")
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (index, name, e) => {
    const { value } = e.target;
    const updatedAddress = [...formData.address];
    if (name === "order") {
      updatedAddress[index][name] = Number(value);
    } else {
      updatedAddress[index][name] = value;
    }

    setFormData({ ...formData, list: updatedAddress });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const payload = {
        order: 1,
        section_id: "section-address",
        heading: formData.heading,
        subheading: formData.subHeading,
        contents: formData.address
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
          {formData.address.map((item, i) => (
            <div className="grid grid-cols-2 gap-5 bg-blue-50  p-6 rounded-lg" key={i}>
              <div className="flex flex-col gap-2">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  value={item.title}
                  onChange={(e) => handleAddressChange(i, "title", e)}
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
                  onChange={(e) => handleAddressChange(i, "order", e)}
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
                  onChange={(e) => handleAddressChange(i, "description", e)}
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
            disabled={formData.title === "" || formData.subHeading === "" || isLoading}
            className="px-8 py-2.5 rounded-lg disabled:bg-purple-300 bg-purple-900 hover:bg-purple-950 font-medium text-white "
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Address;
