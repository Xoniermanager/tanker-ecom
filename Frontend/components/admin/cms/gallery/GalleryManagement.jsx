"use client";
import React, { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineCloudUpload } from "react-icons/md";
import WatchImage from "../../common/WatchImage";
import Cookies from "js-cookie";
import api from "../../../user/common/api";
import { toast } from "react-toastify";

const GalleryManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  
  const [prevUrl, setPrevUrl] = useState(null);
  const [tagInput, setTagInput] = useState("");


  const generateClientId = () => `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const [formData, setFormData] = useState({
    items: [
      {
        clientId:generateClientId(),
        title: "",
        tags: [],
        alt: "",
        
        image: {
          type: "image",
          source: "",
          prev:"",
          file: null,
        },
      },
    ],
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const updatedItems = [...formData.items];
      updatedItems[index].image = {
        ...updatedItems[index].image,
        source: file,
        prev: previewUrl,
        file,
      };
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const addTag = (index) => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.items[index].tags.includes(trimmedTag)) {
      const updatedItems = [...formData.items];
      updatedItems[index].tags.push(trimmedTag);
      setFormData({ ...formData, items: updatedItems });
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e, index) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      addTag(index);
    }
  };

  const handleRemoveTag = (index, tagToRemove) => {
    const updatedItems = [...formData.items];
    updatedItems[index].tags = updatedItems[index].tags.filter((tag) => tag !== tagToRemove);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleFullPreview = (imgUrl) => {
    setPrevUrl(imgUrl);
  };

  const addGalleryItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
        clientId: generateClientId(),
          title: "",
          tags: [],
          alt: "",
          image: {
            type: "image",
            source: "",
            file: null,
          },
        },
      ],
    }));
  };

  const deleteGalleryItem = (index) => {
    const updatedItems = formData.items.filter((_, idx) => idx !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrMessage(null);

  try {
    const accessToken = Cookies.get("accessToken");

    const formDataUpload = new FormData();

    
    const cleanItems = formData.items.map((item) => ({
      ...item,
      image: null, 
    }));

    
    formDataUpload.append("items", JSON.stringify(cleanItems));

    
    formData.items.forEach((item) => {
      if (item.image.source instanceof File) {
        formDataUpload.append(`files[${item.clientId}]`, item.image.source);
      }
    });

    const response = await api.post("/gallery", formDataUpload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.status === 200 || response.status === 201) {
      toast.success("Data updated successfully");
      setErrMessage(null);
      setFormData({
          items: [
      {
        clientId: generateClientId(),
        title: "",
        tags: [],
        alt: "",
        
        image: {
          type: "image",
          source: "",
          prev:"",
          file: null,
        },
      },
    ],
      })
    }
  } catch (error) {
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
      {prevUrl && <WatchImage imgUrl={prevUrl} setPrevUrl={setPrevUrl} />}

      <div className="bg-white p-7 rounded-lg flex flex-col gap-5">
        <h2 className="font-semibold text-2xl">Gallery Management</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8 relative"
            >
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteGalleryItem(index)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-200 text-red-700 hover:bg-red-300"
                >
                  <FaTrash />
                </button>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                    placeholder="Image Title"
                    value={item.title}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="alt">Alternative Text</label>
                  <input
                    type="text"
                    name="alt"
                    className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                    placeholder="Alternative Text"
                    value={item.alt}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="image">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                />
                {item.image.prev && (
                  <img
                    src={item.image.prev}
                    alt="Preview"
                    className="mt-2 w-48 h-auto rounded-md border border-stone-200 cursor-pointer hover:scale-105"
                    onClick={() => handleFullPreview(item.image.prev)}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="tags">Tags</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="tags"
                    className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none flex-1"
                    placeholder="Type tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleTagKeyDown(e, index)}
                  />
                  <button
                    type="button"
                    onClick={() => addTag(index)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 font-medium group flex items-center gap-1"
                    disabled={!tagInput.trim()}
                  >
                    <IoMdAdd className="group-hover:rotate-90 text-xl" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <FaTimes
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(index, tag)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {errMessage && (
            <p className="text-red-600 text-sm font-medium text-right">{errMessage}</p>
          )}

          <div className="flex justify-end gap-4 items-center mt-4">
            <button
              type="button"
              onClick={addGalleryItem}
              className="px-6 py-2.5 group bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2 font-medium"
            >
              <IoMdAdd className="text-xl group-hover:rotate-90" /> Add More Images
            </button>

            <button
              type="submit"
              className="px-8 py-2.5 rounded-lg bg-purple-900 disabled:bg-purple-300 hover:bg-purple-950 text-white font-medium flex items-center gap-2"
              disabled={formData.items.some(
                (item) =>
                  item.title === "" ||
                  item.alt === "" ||
                  item.tags.length === 0 ||
                  item.image.source === ""
              )}
            >
              {isLoading ? "Updating..." : "Update"} <MdOutlineCloudUpload className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GalleryManagement;
