'use client';
import React, { useState, useEffect } from 'react';
import { FaXmark, FaPlus } from 'react-icons/fa6';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../../../user/common/api';
import Cookies from 'js-cookie';

const OurServices = ({serviceData}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null)
  

  const [formData, setFormData] = useState({
    heading: '',
    subHeading: '',
    para: '',
    services: [
      {
        title: '',
        description: '',
        order: '',
        link: '',
      },
    ],
  });
 
  
  useEffect(() => {
    setFormData({
        heading: serviceData?.heading || "",
    subHeading: serviceData?.subheading || "",
    para: serviceData?.contents?.find(item=>item.type === "text")?.text || "",
    services: serviceData?.contents?.find(item=>item?.type === "cards").contents?.map(item=>item) || []
    })
    setSectionId(serviceData?.section_id || "")
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...formData.services];
    if(name === "order"){
      updatedServices[index][name] = Number(value);
    
    }
    else{

      updatedServices[index][name] = value;
    }
    
    setFormData({ ...formData, services: updatedServices });
  };

  const addService = () => {
    if(formData.services.length >= 6) return toast.info("You add a maximum number of services")
    setFormData({
      ...formData,
      
      services: [
        ...formData.services,
        {
          title: '',
        description: '',
          order: '',
          link: '',
          type: "card"
        },
      ],
    });
  };

  const removeService = (index) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    const formContents = [
      {
        order: 1,
        type:"text",
        text:formData.para
      },
      {
        order: 2,
        type:"cards",
        contents: formData.services.map((item=>item))
      }
    ]

    try {
      const accessToken = Cookies.get("accessToken")
      const payload = {
      section_id: sectionId,
      order: 2,
      heading: formData.heading,
      subheading: formData.subHeading,
      contents: formContents,
    };
    
    const response =  await api.put(`/cms/sections/${sectionId}`, payload , {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if(response.status === 201 || response.status === 200){
          toast.success("Data updated successfully");
          setErrMessage(null);
    }
    } catch (error) {
      console.error(error);
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        'Something went wrong';
      setErrMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-7 rounded-lg flex flex-col gap-5">
      <h2 className="font-semibold text-2xl">Our Services</h2>

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
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="para">Para</label>
            <textarea
              name="para"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              placeholder="Para"
              value={formData.para}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-medium">
            <span className="text-red-500">*</span> Service Boxes
          </h3>

          {formData?.services.map((service, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-white p-6 rounded-xl relative"
            >
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label>Service Heading</label>
                  <input
                    type="text"
                    name="title"
                    className="border border-gray-300 rounded-md px-5 py-3 outline-none"
                    placeholder="Service Heading"
                    value={service?.title}
                    onChange={(e) => handleServiceChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Order</label>
                  <input
                    type="number"
                    name="order"
                    className="border border-gray-300 rounded-md px-5 py-3 outline-none"
                    placeholder="1, 2, 3..."
                    value={service?.order}
                    onChange={(e) => handleServiceChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label>Service Description</label>
                  <textarea
                    name="description"
                    className="border border-gray-300 rounded-md px-5 py-3 outline-none"
                    placeholder="Description"
                    rows={3}
                    value={service?.description}
                    onChange={(e) => handleServiceChange(index, e)}
                  />
                </div>
                {/* <div className="flex flex-col gap-2 col-span-2">
                  <label>Link</label>
                  <input
                    type="text"
                    name="link"
                    className="border border-gray-300 rounded-md px-5 py-3 outline-none"
                    placeholder="/services/example"
                    value={service.link}
                    onChange={(e) => handleServiceChange(index, e)}
                  />
                </div> */}
              </div>

              {formData?.services?.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:rotate-90"
                  title="Remove"
                >
                  <FaXmark size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="col-span-2 flex gap-4 items-center justify-end">
          <button
            type="button"
            onClick={addService}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded w-fit flex items-center gap-2 font-medium group"
          >
            <FaPlus className="group-hover:rotate-90" /> Add Service
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
            <MdOutlineCloudUpload />
          </button>
        </div>

      <div className='flex items-center justify-end'>
        {errMessage && (
          <p className="text-red-500 font-medium mt-2">{errMessage}</p>
        )}
        </div>
      </form>
    </div>
  );
};

export default OurServices;
