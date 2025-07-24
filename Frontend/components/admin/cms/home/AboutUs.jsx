"use client";
import React, { useState, useEffect } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";

const AboutUs = ({aboutData}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    firstPara: "",
    secondPara: "",
    redirectBtnTitle: "",
    redirectBtnLink: "",
    contactBtnLink: "tel:",
    list: [
      {
        listItems: "",
      },
    ],
  });

  useEffect(() => {
    setFormData({
       heading: aboutData?.heading || "",
       subHeading: aboutData?.subheading || "",
       
    })
  }, [])
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactBtnLink") {
      const cleaned = value.replace(/^tel:/, "");
      setFormData({
        ...formData,
        [name]: `tel:${cleaned}`,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleListChange = (index, e) => {
    const { value } = e.target;
    const updatedList = [...formData.list];
    updatedList[index].listItems = value;
    setFormData({ ...formData, list: updatedList });
  };

  const addListItem = () => {
    if (formData.list.length < 3) {
      setFormData({
        ...formData,
        list: [...formData.list, { listItems: "" }],
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

  console.log("about data: ", aboutData)

  return (
    <>
      <div className="bg-white p-7 rounded-lg flex flex-col gap-5">
        <h2 className="font-semibold text-2xl">About Us</h2>

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
            <div className="col-span-2 flex flex-col gap-3">
              {/* <div className="w-full border-b-1 border-stone-300"></div> */}
              <h3 className=" font-semibold text-xl">Content</h3>
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <label htmlFor="firstPara">First Para</label>
              <textarea
                name="firstPara"
                className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                placeholder="First Para"
                value={formData.firstPara}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <label htmlFor="secondPara">Second Para</label>
              <textarea
                name="secondPara"
                className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                placeholder="Second Para"
                value={formData.secondPara}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="redirectBtnTitle">Redirect Button Title</label>
              <input
                type="text"
                name="redirectBtnTitle"
                className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                placeholder="Ex: Learn More"
                value={formData.redirectBtnTitle}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="redirectBtnLink">Redirect Button Link</label>
              <input
                type="text"
                name="redirectBtnLink"
                className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                placeholder="Ex: /about"
                value={formData.redirectBtnLink}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <label htmlFor="contactBtnLink">Contact Button Link</label>
              <input
                type="text"
                name="contactBtnLink"
                className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                placeholder="Ex: 9876543210"
                value={formData.contactBtnLink}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium"><span className="text-red-500">*</span> Key Points (Max 3)</h3>
              {formData?.list?.length < 3 && (
                <button
                  type="button"
                  onClick={addListItem}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded w-fit flex items-center gap-2 font-medium group"
                >
                  <FaPlus className="group-hover:rotate-90"/> Add Item
                </button>
              )}
            </div>

            {formData?.list?.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white p-6 rounded-xl shadow-sm relative"
              >
                <input
                  type="text"
                  name="listItems"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none"
                  placeholder={`List Item ${index + 1}`}
                  value={item.listItems}
                  onChange={(e) => handleListChange(index, e)}
                />
                {formData?.list?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index)}
                    className="absolute hover:rotate-90 top-2 right-2 text-red-500 hover:text-red-600"
                  >
                    <FaXmark size={18} />
                  </button>
                )}
              </div>
            ))}
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
  );
};

export default AboutUs;
