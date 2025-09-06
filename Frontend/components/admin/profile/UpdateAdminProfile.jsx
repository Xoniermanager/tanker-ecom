"use client";
import React, { useState, useEffect } from "react";
import { MdOutlineCloudUpload, MdCamera, MdClose } from "react-icons/md";

import { COUNTRIES } from "../../../constants/enums";
import { toast } from "react-toastify";
import api from "../../user/common/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/user/AuthContext";


const UpdateAdminProfile = () => {
  const [prevImage, setPrevImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    companyName: "",
    designation: "",
    
    country: "",
   
    profileImage: "",
  });

  const router = useRouter();

  const { userData, fetchUserData } = useAuth();

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        mobileNumber: userData.mobileNumber || "",
        companyName: userData.companyName || "",
        designation: userData.designation || "",
       
        country: userData.country || "",
       
        profileImage: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errMessage) setErrMessage(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrevImage(e.target.result);
        setFormData({ ...formData, profileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
    setSuccessMessage(null);

    try {
      let profileImageUrl = userData?.profileImage || "";

      if (formData.profileImage && typeof formData.profileImage === "object") {
        const newFormData = new FormData();
        newFormData.append("file", formData.profileImage);

        const uploadResponse = await api.put("/upload-files", newFormData);

        if (
          uploadResponse.status === 200 &&
          uploadResponse.data?.data?.file?.url
        ) {
          profileImageUrl = uploadResponse.data.data.file.url;
        }
      }

      const profileUpdateData = {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        companyName: formData.companyName,
        designation: formData.designation,
       
        country: formData.country,
        
        profileImage: profileImageUrl,
      };

      const response = await api.put("/auth/profile-update", profileUpdateData);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setSuccessMessage("Profile updated successfully!");
        fetchUserData();
        setTimeout(() => {
            setSuccessMessage(null)
        }, 3500);
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      setErrMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-white">

        <div className="grid grid-cols-1 p-5 gap-y-6">
          <div className="lg:col-span-1">
            <div className="bg-purple-50/50 rounded-lg border border-slate-200 shadow-[0_0_8px_#00000010] p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto relative overflow-hidden">
                    {prevImage || userData?.profileImage ? (
                      <Image
                        src={prevImage || userData?.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        height={80}
                        width={80}
                      />
                    ) : (
                      <span>Y</span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 p-2 rounded-full text-white cursor-pointer transition-colors"
                  >
                    <MdCamera size={16} />
                  </label>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {userData?.fullName}
                </h3>
                <p className="text-gray-500">{userData?.companyEmail}</p>
                <button className="mt-3 text-purple-600 hover:text-purple-700 font-medium cursor-auto"  >
                  Change Photo
                </button>
              </div>
              
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-purple-900 mb-6">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData?.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none  transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData?.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none  transition-colors"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-purple-900 mb-6">
                  Professional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData?.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none  transition-colors"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData?.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none  transition-colors"
                      placeholder="Enter your designation"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-purple-900 mb-6">
                  Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData?.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none  transition-colors bg-white"
                    >
                      <option value="">Select Country</option>
                      {Object.values(COUNTRIES).map((country) => (
                        <option key={country.code} value={country.value}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                </div>
              </div>
            </div>
           <div className="relative">

  <div
    className={`transition-all duration-500 ease-in-out ${
      errMessage
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none absolute"
    } mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700`}
  >
    {errMessage}
  </div>


  <div
    className={`transition-all duration-500 ease-in-out ${
      successMessage
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none absolute"
    } mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700`}
  >
    {successMessage}
  </div>
</div>

            <div className="flex items-center justify-end mt-7 gap-3">
                            
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className='bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg flex items-center gap-2 text-md font-medium tracking-wide text-white transition-colors'
                            >
                                <MdOutlineCloudUpload size={20} />
                                {isLoading ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
          </div>
        </div>
      </div>
    
  );
};

export default UpdateAdminProfile;
