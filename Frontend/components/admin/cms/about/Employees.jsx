"use client";

import React, { useState } from "react";

import { MdOutlineCloudUpload } from "react-icons/md";

const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const [formData, setFormData] = useState({
    order: "",
    heading: "",
    subHeading: "",
    para: "",
    employees: [
      { name: "", designation: "", description: "", image: null, previewUrl: "" },
      { name: "", designation: "", description: "", image: null, previewUrl: "" },
      { name: "", designation: "", description: "", image: null, previewUrl: "" },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...formData.employees];
    updatedEmployees[index][field] = value;
    setFormData({ ...formData, employees: updatedEmployees });
  };

  const handleImageChange = (index, file) => {
    const updatedEmployees = [...formData.employees];
    updatedEmployees[index].image = file;
    updatedEmployees[index].previewUrl = URL.createObjectURL(file);
    setFormData({ ...formData, employees: updatedEmployees });
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
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-xl mb-4">Employees</h3>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="order"
            placeholder="Order"
            value={formData.order}
            onChange={handleChange}
            className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
          />
          <input
            type="text"
            name="heading"
            placeholder="Heading"
            value={formData.heading}
            onChange={handleChange}
            className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
          />
          <input
            type="text"
            name="subHeading"
            placeholder="Sub Heading"
            value={formData.subHeading}
            onChange={handleChange}
            className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
          />
        </div>

        <textarea
          name="para"
          placeholder="Paragraph"
          value={formData.para}
          onChange={handleChange}
          className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
          rows={3}
        />

        <div className="flex flex-col gap-8">
          {formData.employees.map((employee, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col gap-4"
            >
              <h4 className="text-lg font-medium">Employee {index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={employee.name}
                  onChange={(e) =>
                    handleEmployeeChange(index, "name", e.target.value)
                  }
                  className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Designation"
                  value={employee.designation}
                  onChange={(e) =>
                    handleEmployeeChange(index, "designation", e.target.value)
                  }
                  className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                />
              </div>

              <textarea
                placeholder="Description"
                value={employee.description}
                onChange={(e) =>
                  handleEmployeeChange(index, "description", e.target.value)
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
                                         className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
                                       >
                                         {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
                                       </button>
        </div>
      </form>
    </div>
  );
};

export default Employees;
