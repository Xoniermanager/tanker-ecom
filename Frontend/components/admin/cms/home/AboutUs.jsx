"use client";
import React, { useState, useEffect } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";
import api from "../../../user/common/api";
import { toast } from "react-toastify";
import Link from "next/link";
import Cookies from "js-cookie";

const AboutUs = ({ aboutData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [webOrigin, setWebOrigin] = useState(null);

  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    firstPara: "",
    secondPara: "",
    redirectBtnTitle: "",
    redirectBtnLink: "",
    contactBtnLink: "",
    list: [
      {
        order: "",
        text: "",
      },
    ],
    thumbnail: {
      type: "",
      source: "",
    },
  });

  useEffect(() => {
    setFormData({
      heading: aboutData?.heading || "",
      subHeading: aboutData?.subheading || "",
      thumbnail: { type: aboutData?.thumbnail?.type || "", source: "" },
      firstPara:
        aboutData?.contents.find((item) => item.order === 1).text || "",
      secondPara:
        aboutData?.contents.find((item) => item.order === 4).text || "",

      list:
        aboutData?.contents?.find((item) => item.type === "list").contents ||
        [],
      contactBtnLink:
        aboutData?.contents
          ?.find((item) => item.type === "group")
          .contents.find((item) => item.type === "phone").phone_number || "",
      redirectBtnTitle:
        aboutData?.contents
          ?.find((item) => item.type === "group")
          .contents.find((item) => item.type === "link").text || "",
      redirectBtnLink:
        aboutData?.contents
          ?.find((item) => item.type === "group")
          .contents.find((item) => item.type === "link").link || "",
    });
    setSectionId(aboutData?.section_id || "");
  }, []);

  useEffect(() => {
    setWebOrigin(window?.location?.origin || null);
  }, [formData.buttonLink]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === 'type'){
      setFormData((prev)=>({...prev, thumbnail: {
        ...prev.thumbnail, [name]:value
      }}))
    }
    else{
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleListChange = (index, name, e) => {
    const { value } = e.target;
    const updatedList = [...formData.list];
    if (name === "order") {
      updatedList[index][name] = Number(value);
    } else {
      updatedList[index][name] = value;
    }

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validImageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    const validVideoTypes = ["video/mp4", "video/webm"];

    const isValid =
      validImageTypes.includes(file.type) ||
      validVideoTypes.includes(file.type);

    if (!isValid) {
      setErrMessage("Only JPG, PNG, SVG, MP4, or WEBM files are allowed.");
      setFormData((prev) => ({
        ...prev,
        thumbnail: { ...prev.thumbnail, source: "" },
      }));
      setPreview(null);
      return;
    }

    setErrMessage(null);
    const fileURL = URL.createObjectURL(file);
    setPreview(fileURL);

    setFormData((prev) => ({
      ...prev,
      thumbnail: {
        ...prev.thumbnail,
        source: file,
      },
    }));
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const fileFormData = new FormData();

      const accessToken = Cookies.get(`accessToken`);

      let uploadedThumbnailUrl;

      if (formData.thumbnail.source) {
        fileFormData.append("file", formData.thumbnail.source);
        const thumbRes = await api.put("/upload-files", fileFormData);

        uploadedThumbnailUrl = thumbRes.data.data.file.url;
      }

      const aboutContents = [
        {
          order: 1,
          type: "text",
          text: formData.firstPara,
        },
        {
          order: 2,
          type: "list",
          contents: formData.list,
        },
        {
          order: 3,
          type: "group",
          contents: [
            {
              order: 1,
              type: "phone",
              text: "Have Question",
              phone_number: formData.contactBtnLink,
            },
            {
              order: 2,
              type: "link",
              text: formData.redirectBtnTitle,
              link: formData.redirectBtnLink,
            },
          ],
        },
        {
          order: 4,
          type: "text",
          text: formData.secondPara,
        },
      ];
      const payload = {
        section_id: sectionId,
        heading: formData.heading,
        subheading: formData.subHeading,
        order: 3,
        ...(uploadedThumbnailUrl && {
          thumbnail: {
            type: formData.thumbnail.type,
            source: uploadedThumbnailUrl,
          },
        }),
        contents: aboutContents,
      };

      const response = await api.put(`/cms/sections/${sectionId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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
              <select
                name="redirectBtnLink"
                id="redirectBtnLink"
                value={formData.redirectBtnLink}
                onChange={handleChange}
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                required
              >
                <option hidden>Choose Pages</option>
                <option value="/contact">Contact Page</option>
                <option value="/about">About Us Page</option>
                <option value="/products">Products Page</option>
                <option value="/news">News Page</option>
                <option value="/gallery">Gallery Page</option>
                <option value="/services">Services Page</option>
              </select>
              {webOrigin && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Preview:</span>
                  <Link
                    href={`${webOrigin}${formData.redirectBtnLink}`}
                    target="_blank"
                    className="text-green-500"
                  >
                    {webOrigin}
                    {formData.redirectBtnLink}
                  </Link>
                </div>
              )}
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
              <h3 className="text-lg font-medium">
                <span className="text-red-500">*</span> Key Points (Max 3)
              </h3>
              {formData?.list?.length < 3 && (
                <button
                  type="button"
                  onClick={addListItem}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded w-fit flex items-center gap-2 font-medium group"
                >
                  <FaPlus className="group-hover:rotate-90" /> Add Item
                </button>
              )}
            </div>

            {formData?.list?.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white p-6 rounded-xl shadow-sm relative grid grid-cols-1 gap-4"
              >
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="order">Order</label>
                  <input
                    type="number"
                    name="order"
                    className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                    placeholder="1,2,3..."
                    value={item.order}
                    onChange={(e) => handleListChange(index, "order", e)}
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="text">List Items</label>
                  <textarea
                    type="text"
                    name="text"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none"
                    placeholder={`List Item ${index + 1}`}
                    value={item.text}
                    onChange={(e) => handleListChange(index, "text", e)}
                    rows={4}
                  />
                </div>
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
          <div className="col-span-2 grid grid-cols-2 gap-5 p-5 bg-blue-50 rounded-xl">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="type">Thumbnail Type</label>
              <select
                name="type"
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                value={formData?.thumbnail?.type}
                onChange={handleChange}
                required
              >
                <option hidden>Select Thumbnail Type</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 ">
              <label htmlFor="thumbnailSource">Thumbnail File Source</label>
              <input
                type="file"
                accept={formData.thumbnail.type === "video"? "video/*": "image/*"}
                // "image/*,video/*"
                onChange={handleFileChange}
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
              />
            </div>

            {preview && (
              <div className="col-span-2">
                <label className="font-medium text-sm">Preview:</label>
                <div className="mt-2">
                  {formData.thumbnail.type === "video" ? (
  <video
    key={preview} 
    controls
    className='rounded-md w-full max-h-[250px] object-contain'
  >
    <source src={preview} />
    Your browser does not support the video tag.
  </video>
) : (
  <img
    src={preview}
    alt="Preview"
    className='rounded-md w-full max-h-[250px] object-contain'
  />
)}
                </div>
              </div>
            )}
          </div>

          <div className=" flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded flex items-center gap-2"
            >
              {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
            </button>
          </div>
          <div className="flex justify-end">
            {errMessage && (
              <p className="text-red-500 font-medium mt-2">{errMessage}</p>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AboutUs;
