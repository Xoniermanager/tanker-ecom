"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import api from "../../../user/common/api";
import { toast } from "react-toastify";

const Counter = ({ counterData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  const [formData, setFormData] = useState({
    boxOne: { count: "", order: "", suffix:"", description: "" },
    boxTwo: { count: "", order: "", suffix:"", description: "" },
    boxThree: { count: "", order: "", suffix:"", description: "" },
    boxFour: { count: "", order: "", suffix:"", description: "" },
  });

  const handleBoxChange = (boxKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [boxKey]: {
        ...prev[boxKey],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    if (!counterData || !Array.isArray(counterData.contents)) return;

    setSectionId(counterData?.section_id || null);

    const mapGroupToBox = (group) => {
      const count = group.contents?.find((c) => c.label === "Number")?.text || "";
      const suffix = group.contents?.find((c) => c.label === "Number")?.suffix || "";
      const description = group.contents?.find((c) => c.label === "Text")?.text || "";
      const order = group.order?.toString() || "";
      return { count, suffix, description, order };
    };

    setFormData({
      boxOne: mapGroupToBox(counterData.contents[0] || {}),
      boxTwo: mapGroupToBox(counterData.contents[1] || {}),
      boxThree: mapGroupToBox(counterData.contents[2] || {}),
      boxFour: mapGroupToBox(counterData.contents[3] || {}),
    });
  }, [counterData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const payload = {
        order: counterData?.order || 5,
        section_id: sectionId,
        heading: counterData?.heading || "Track Record",
        subheading: counterData?.subheading || "N/A",
        contents: Object.values(formData).map((box, idx) => ({
          order: Number(box.order),
          type: "group",
          contents: [
            {
              order: 1,
              type: "text",
              label: "Number",
              text: box.count,
              suffix: box.suffix
            },
            {
              order: 2,
              type: "text",
              label: "Text",
              text: box.description,
            },
          ],
        })),
      };

      
      const response =  await api.put(`/cms/sections/${sectionId}`, payload);
    if(response.status === 201 || response.status === 200){
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

  const renderBox = (boxKey, label) => {
    const box = formData[boxKey];

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200" key={boxKey}>
        <h3 className="font-semibold text-xl mb-4">{label}</h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${boxKey}-count`}>Count</label>
            <input
              type="text"
              id={`${boxKey}-count`}
              name="count"
              className="border border-gray-300 rounded-md px-5 py-3 outline-none"
              placeholder="Enter count"
              value={box.count}
              onChange={(e) =>
                handleBoxChange(boxKey, "count", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={`order`}>Order</label>
            <input
              type="number"
              name="order"
              className="border border-gray-300 rounded-md px-5 py-3 outline-none"
              placeholder="Enter order"
              value={box.order}
              onChange={(e) =>
                handleBoxChange(boxKey, "order", e.target.value)
              }
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor={`suffix`}>Suffix</label>
            <input
              type="text"
              name="suffix"
              className="border border-gray-300 rounded-md px-5 py-3 outline-none"
              placeholder="Enter Suffix"
              value={box.suffix}
              onChange={(e) =>
                handleBoxChange(boxKey, "suffix", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor={`${boxKey}-description`}>Description</label>
            <textarea
              id={`${boxKey}-description`}
              name="description"
              className="border border-gray-300 rounded-md px-5 py-3 outline-none"
              placeholder="Ex: Happy Clients"
              value={box.description}
              onChange={(e) =>
                handleBoxChange(boxKey, "description", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-7 rounded-lg flex flex-col gap-5">
      <h2 className="font-semibold text-2xl">Counter</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-6">
          {renderBox("boxOne", "Box One")}
          {renderBox("boxTwo", "Box Two")}
          {renderBox("boxThree", "Box Three")}
          {renderBox("boxFour", "Box Four")}
        </div>
        <div className="flex items-center justify-end w-full">
        {errMessage && (
          <p className="text-red-500 font-medium mt-2">{errMessage}</p>
        )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded flex items-center gap-2"
          >
            {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default Counter;
