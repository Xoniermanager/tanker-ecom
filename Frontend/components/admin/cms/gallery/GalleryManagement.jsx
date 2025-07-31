"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineCloudUpload } from "react-icons/md";

const GalleryManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    tags: [],
    alt: "",
    image: {
      type: "image",
      source: "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: {
          ...prev.image,
          source: previewUrl,
        },
      }));
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      // submit logic
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
      <h2 className="font-semibold text-2xl">Gallery Management</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              placeholder="Image Title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="alt">Alternative Text </label>
            <input
              type="text"
              name="alt"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              placeholder="Alternative Text"
              value={formData.alt}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
          />
          {formData.image.source && (
            <img
              src={formData.image.source}
              alt="Preview"
              className="mt-2 w-48 h-auto rounded-md border"
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
              onKeyDown={handleTagKeyDown}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-300 font-medium group flex items-center gap-1"
              disabled={!tagInput.trim()}
            >
            <IoMdAdd className="group-hover:rotate-90 text-xl"/> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{tag}</span>
                <FaTimes
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </div>
            ))}
          </div>
        </div>

        {errMessage && (
          <div className="col-span-2 flex justify-end">
            <p className="text-red-600 text-sm font-medium">{errMessage}</p>
          </div>
        )}

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={
              formData.title === "" ||
              formData.alt === "" ||
              formData.tags.length === 0 ||
              formData.image.source === ""
            }
            className="px-8 py-2.5 rounded-lg disabled:bg-purple-300 bg-purple-900 flex items-center gap-2 hover:bg-purple-950 font-medium text-white"
          >
            {isLoading ? "Updating..." : "Update"} <MdOutlineCloudUpload className="text-xl"/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryManagement;
