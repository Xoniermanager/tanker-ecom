"use client";
import React, { useState, useEffect } from "react";
import { FaXmark, FaPlus } from "react-icons/fa6";
import { MdOutlineCloudUpload } from "react-icons/md";
import api from "../../../user/common/api";
import { toast } from "react-toastify";
import Link from "next/link";
import Cookies from "js-cookie";

const WorkProcess = ({ workProcessData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    process: [
      {
        title: "",
        subtitle: "",
        description: "",
        image: null,
        previewUrl: "",
        subtitle: "",
        thumbnail: {
          type: "image",
          source: "",
        },
      },
    ],
  });
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  useEffect(() => {
    setSectionId(workProcessData?.section_id || "");
    setFormData({
      heading: workProcessData?.heading || "N/A",
      subHeading: workProcessData?.subheading || "N/A",
      process: workProcessData.contents.find((item) => item.type === "cards")
        .contents,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProcessChange = (index, field, value) => {
    const updatedEmployees = [...formData.process];
    updatedEmployees[index][field] = value;
    setFormData({ ...formData, process: updatedEmployees });
  };

  const handleImageChange = (index, file) => {
    const updatedEmployees = [...formData.process];
    updatedEmployees[index].thumbnail.source = file;
    updatedEmployees[index].previewUrl = URL.createObjectURL(file);
    setFormData({ ...formData, process: updatedEmployees });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      let finalProcess = [];
     
      for (let item of formData.process) {
        const fileFormData = new FormData();
        fileFormData.append("file", item.thumbnail.source);
        let thumbRes;
        if (item.thumbnail.source.name) {
          thumbRes = await api.put("/upload-files", fileFormData);
        }
        finalProcess.push({
          ...item,
          ...(thumbRes && {
            thumbnail: {
              ...item.thumbnail,
              source: thumbRes.data.data.fullPath,
            },
          }),
        });
      }

      const formContents = [
        {
          order: 1,
          type: "cards",
          label: "Process",
          contents: finalProcess,
        },
      ];
      const payload = {
        section_id: sectionId,
        heading: formData.heading,
        subheading: formData.subHeading,
        order: 2,

        contents: formContents,
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
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-xl mb-4">Employees</h3>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        {/* <div className="flex flex-col gap-2">
          <label htmlFor="para">Para</label>
          <textarea
            name="para"
            placeholder="Paragraph"
            value={formData.para}
            onChange={handleChange}
            className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            rows={3}
          />
        </div> */}

        <div className="flex flex-col gap-8">
          {formData?.process?.map((employee, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4"
            >
              <h4 className="text-lg font-medium">Process {index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="title"
                  name="title"
                  value={employee.title}
                  onChange={(e) =>
                    handleProcessChange(index, "title", e.target.value)
                  }
                  className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Sub Title"
                  name="subtitle"
                  value={employee.subtitle}
                  onChange={(e) =>
                    handleProcessChange(index, "subtitle", e.target.value)
                  }
                  className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                />
              </div>

              <textarea
                placeholder="Description"
                name="description"
                value={employee.description}
                onChange={(e) =>
                  handleProcessChange(index, "description", e.target.value)
                }
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                rows={3}
              />

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer w-fit">
                  <MdOutlineCloudUpload className="text-xl" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="hidden"
                  />
                </label>
                {employee.previewUrl && (
                  <img
                    src={employee.previewUrl}
                    alt={`Preview ${index}`}
                    className="w-30 h-30 object-cover rounded-lg border border-gray-300"
                  />
                )}
              </div>
            </div>
          ))}
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

export default WorkProcess;
