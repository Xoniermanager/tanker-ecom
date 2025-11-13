"use client"
import React, { useState, useEffect } from 'react'
import { MdOutlineCloudUpload, MdCamera, MdClose, MdDelete } from "react-icons/md";
import { useAuth } from '../../../context/user/AuthContext';
import { COUNTRIES } from '../../../constants/enums';
import { toast } from 'react-toastify';
import api from '../common/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UserProfileUpdate = () => {
    const [prevImage, setPrevImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [errMessage, setErrMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",
        companyName: "",
        designation: "",
        country: "",
        communicationPreference:"",
        profileImage: ""
    });

    const router = useRouter();
    const { userData, fetchUserData } = useAuth();

   useEffect(() => {
     if(userData){
       setFormData({
        fullName: userData.fullName || "",
        mobileNumber: userData.mobileNumber || "",
        companyName: userData.companyName || "",
        designation : userData.designation || "",
        country: userData.country || "",
        communicationPreference: userData.communicationPreference || "",
        profileImage: ""
       })
     }
   }, [userData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
       
        if (errMessage) setErrMessage(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrMessage('Please select a valid image file');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrMessage('Image size should not exceed 5MB');
                return;
            }

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

            if (formData.profileImage && typeof formData.profileImage === 'object') {
                const newFormData = new FormData();
                newFormData.append("file", formData.profileImage);
                
                const uploadResponse = await api.put("/upload-files", newFormData);
                
                if (uploadResponse.status === 200 && uploadResponse.data?.data?.file?.url) {
                    profileImageUrl = uploadResponse.data.data.file.url;
                }
            }

            const profileUpdateData = {
                fullName: formData.fullName,
                mobileNumber: formData.mobileNumber,
                companyName: formData.companyName,
                designation: formData.designation,
                country: formData.country,
                communicationPreference: formData.communicationPreference,
                profileImage: profileImageUrl
            };

            const response = await api.put('/auth/profile-update', profileUpdateData);
            
            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                setSuccessMessage("Profile updated successfully!");
                setPrevImage(null);
                await fetchUserData();
                setTimeout(()=>setSuccessMessage(null),5000)
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

    const handleRemoveProfile = async() => {
        setIsDeleting(true);
        setErrMessage(null);
        setSuccessMessage(null);
        
        try {
            const response = await api.patch("/auth/remove-profile-img", {});
            
            if(response.status === 200){
                toast.success("Profile image removed successfully!");
                setSuccessMessage("Profile image removed successfully!");
                setPrevImage(null);
                setShowDeleteConfirm(false);
                await fetchUserData();
                setTimeout(()=>setSuccessMessage(null),5000)
            }
        } catch (error) {
            const message =
                (Array.isArray(error?.response?.data?.errors) &&
                    error.response.data.errors[0]?.message) ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove profile image";
            
            setErrMessage(message);
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const hasProfileImage = prevImage || userData?.profileImage;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl py-20 px-5 mx-auto">
               
                <div className="bg-purple-100/70 rounded-lg shadow-sm p-4 md:p-6 px-5 md:px-8 mb-6">
                    <div className="flex items-center flex-col gap-4 md:flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <h1 className='font-semibold text-2xl md:text-3xl text-purple-950'>Edit Profile</h1>
                            <p className='text-gray-500'>Update your personal and professional information.</p>
                        </div>
                       
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => router.back()}
                                className='bg-purple-200 hover:bg-purple-900 px-6 py-2.5 rounded-lg flex items-center gap-2 text-md font-medium tracking-wide text-purple-900 text-sm md:text-base hover:text-white group transition-colors'
                            >
                                <MdClose size={20} className='group-hover:rotate-90 transition-transform'/>
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className='bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 md:px-6 py-2.5 rounded-lg flex items-center text-sm md:text-base gap-2 text-md font-medium tracking-wide text-white transition-colors'
                            >
                                <MdOutlineCloudUpload size={20} />
                                {isLoading ? "Saving Changes..." : "Save Changes"}
                            </button>
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Picture Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto relative overflow-hidden ring-4 ring-purple-100 transition-all hover:ring-purple-200">
                                        {hasProfileImage ? (
                                            <Image 
                                                src={prevImage || userData?.profileImage} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover" 
                                                height={128} 
                                                width={128}
                                            />
                                        ) : (
                                            <Image 
                                                src={`/images/admin-avatar.png`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover" 
                                                height={128} 
                                                width={128}
                                            />
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
                                        className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 p-2 rounded-full text-white cursor-pointer transition-all hover:scale-110 shadow-lg"
                                        title="Change photo"
                                    >
                                        <MdCamera size={16} />
                                    </label>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{userData?.fullName || 'User Name'}</h3>
                                <p className="text-gray-500 text-sm">{userData?.companyEmail}</p>
                                
                                <div className="mt-4 flex flex-col gap-2">
                                    <label
                                        htmlFor="profileImage"
                                        className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer transition-colors"
                                    >
                                        Change Photo
                                    </label>
                                    
                                    {hasProfileImage && (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            Remove Photo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            {/* Personal Information */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-purple-900 mb-6">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData?.fullName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            value={formData?.mobileNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-purple-900 mb-6">Professional Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData?.companyName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter company name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData?.designation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter your designation"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-purple-900 mb-6">Preferences</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <select
                                            name="country"
                                            value={formData?.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                        >
                                            <option value="">Select Country</option>
                                            {Object.values(COUNTRIES).map((country) => (
                                                <option key={country.code} value={country.value}>{country.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Communication Preference</label>
                                        <select
                                            name="communicationPreference"
                                            value={formData?.communicationPreference}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                        >
                                            <option value="">Select Communication Preference</option>
                                            <option value="email">Email</option>
                                            <option value="phone">Phone</option>
                                            <option value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/20  bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <MdDelete className="text-red-600" size={24} />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                            Remove Profile Image?
                        </h3>
                        
                        <p className="text-gray-500 text-center mb-6">
                            Are you sure you want to remove your profile image? This action cannot be undone.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRemoveProfile}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <MdDelete size={18} />
                                        Remove
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileUpdate;