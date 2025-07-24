"use client";

import React, { useState } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";


const WhoWeAre = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    para: "",
    list: [
      {
        icon: null,
        iconPreview: null,
        listHeading: "",
        listDescription: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleListChange = (e, index) => {
    const { name, value } = e.target;
    const updatedList = [...formData.list];
    updatedList[index][name] = value;
    setFormData({ ...formData, list: updatedList });
  };

  const handleIconChange = (e, index) => {
    const file = e.target.files[0];
    if (
      file &&
      ["image/svg+xml", "image/png", "image/jpeg"].includes(file.type)
    ) {
      const updatedList = [...formData.list];
      updatedList[index].icon = file;

      const reader = new FileReader();
      reader.onloadend = () => {
        updatedList[index].iconPreview = reader.result;
        setFormData({ ...formData, list: updatedList });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only SVG, PNG, or JPG files are allowed.");
    }
  };

  const addListItem = () => {
    if (formData.list.length < 3) {
      setFormData({
        ...formData,
        list: [
          ...formData.list,
          {
            icon: null,
            iconPreview: null,
            listHeading: "",
            listDescription: "",
          },
        ],
      });
    }
  };

  const removeListItem = (index) => {
    const updatedList = [...formData.list];
    updatedList.splice(index, 1);
    setFormData({ ...formData, list: updatedList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      console.log("Submitted data:", formData);
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
    <div className="bg-white p-6 rounded-xl border  border-gray-200">
      <h3 className="font-semibold text-xl mb-4">Who We Are</h3>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Heading</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            placeholder="Enter heading"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Subheading</label>
          <input
            type="text"
            name="subHeading"
            value={formData.subHeading}
            onChange={handleChange}
            className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            placeholder="Enter subheading"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Paragraph</label>
          <textarea
            name="para"
            value={formData.para}
            onChange={handleChange}
           className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            placeholder="Enter description"
            rows={4}
          />
        </div>

        {/* List Section */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">List Items</label>
          {formData.list.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 border border-gray-200 rounded-xl flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">List {index + 1}</h4>
                {formData.list.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index)}
                    className="text-red-500 text-xl hover:rotate-90"
                  >
                    <FaXmark />
                  </button>
                )}
              </div>

               <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">List Heading</label>
                <input
                  type="text"
                  name="listHeading"
                  value={item.listHeading}
                  onChange={(e) => handleListChange(e, index)}
                  className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                  placeholder="Enter list heading"
                />
              </div>

               <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">List Description</label>
                <textarea
                  name="listDescription"
                  value={item.listDescription}
                  onChange={(e) => handleListChange(e, index)}
                  className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                  rows={3}
                  placeholder="Enter list description"
                />
              </div>

              <div>
                
                <label className="flex items-center gap-2 cursor-pointer bg-purple-100 border border-purple-300 text-purple-700 rounded-xl px-4 py-2 font-medium w-fit">
                  <MdOutlineCloudUpload className="text-xl" />
                  Upload Icon
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleIconChange(e, index)}
                  />
                </label>

                {item.iconPreview && (
                  <img
                    src={item.iconPreview}
                    alt="icon-preview"
                    className="mt-2 w-16 h-16 object-contain border border-gray-200 rounded"
                  />
                )}
              </div>
            </div>
          ))}
          
        </div>
       <div className="flex items-center gap-4 justify-end">
        {formData.list.length < 3 && (
            <button
              type="button"
              onClick={addListItem}
              className="  bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 "
            >
              <FaPlus /> Add List Item
            </button>
          )}
       <button
                   type="submit"
                   disabled={isLoading}
                   className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
                 >
                   {isLoading ? 'Submitting...' : 'Submit'}
                   <MdOutlineCloudUpload />
                 </button>
        </div>

        {errMessage && <p className="text-red-500 mt-2">{errMessage}</p>}
      </form>
    </div>
  );
};

export default WhoWeAre;
