"use client";
import React, { useState } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";

const Counter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const [formData, setFormData] = useState({
    boxOne: {
      count: "",
      description: "",
    },
    boxTwo: {
      count: "",
      description: "",
    },
    boxThree: {
      count: "",
      description: "",
    },
    boxFour: {
      count: "",
      description: "",
    },
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

  const renderBox = (boxKey, label) => {
    const box = formData[boxKey];

    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200" key={boxKey}>
        <h3 className="font-semibold text-xl mb-4">{label}</h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${boxKey}-count`}>Count</label>
            <input
              type="number"
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
            <label htmlFor={`${boxKey}-description`}>Description</label>
            <input
              type="text"
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
  );
};

export default Counter;
