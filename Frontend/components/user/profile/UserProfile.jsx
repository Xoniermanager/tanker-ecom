"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaGlobe,
  FaComment,
  FaCopy,
  FaCheck,
  FaImage,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";
import { useAuth } from "../../../context/user/AuthContext";
import Link from "next/link";
import Image from "next/image";

const UserProfile = () => {
  const { userData } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyUserId = () => {
    navigator.clipboard.writeText(userData?._id || "not found");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "AA"
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "inactive":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-24 ">
      <div className="bg-white rounded-3xl   overflow-hidden">
        <div className="relative bg-purple-100 p-10">
          <div className="absolute inset-0 "></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  {/* {userData?.profileImage ? ( */}
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                      <Image
                        src={userData?.profileImage || "/images/admin-avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        height={80}
                        width={80}
                      />
                    </div>
                   
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <FaUserCircle className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="text-slate-800">
                  <h1 className="text-4xl font-bold mb-2">
                    {userData?.fullName}
                  </h1>
                  <p className="text-xl text-slate-600 font-medium mb-1">
                    {userData?.designation}
                  </p>
                  <p className="text-slate-600 font-medium">
                    {userData?.companyName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`${
                    userData?.status === "active" ? "bg-green-50" : "bg-red-50"
                  } backdrop-blur-sm rounded-full px-6 py-3 border ${
                    userData?.status === "active"
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 ${getStatusColor(
                        userData?.status
                      )} rounded-full shadow-sm`}
                    ></div>
                    <span
                      className={`${
                        userData?.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      } font-semibold capitalize`}
                    >
                      {userData?.status || "Active"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/profile/update`}
                  className="bg-purple-600 hover:bg-purple-700  backdrop-blur-sm flex items-center gap-2 text-white rounded-full px-6 py-3"
                >
                  <FaUserEdit className="text-xl" /> Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <FaEnvelope className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaEnvelope className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company Email
                      </p>
                      <p className="text-gray-900 font-semibold text-sm break-all">
                        {userData?.companyEmail || "admin@company2.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaEnvelope className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Alternative Email
                      </p>
                      <p className="text-gray-900 font-semibold text-sm break-all">
                        {userData?.alternativeEmail || "sdfs@gmail.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FaPhone className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Mobile Number
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {userData?.mobileNumber || "1234567890"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FaBuilding className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {userData?.companyName || "Xonier Technologies"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50/80 to-orange-50/80 rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <FaGlobe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaGlobe className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Country
                      </p>
                      <p className="text-gray-900 font-semibold capitalize">
                        {userData?.country }
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaGlobe className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Language
                      </p>
                      <p className="text-gray-900 font-semibold capitalize">
                        {userData?.preferredLanguage }
                      </p>
                    </div>
                  </div>
                </div> */}

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaComment className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Communication 
                      </p>
                      <p className="text-gray-900 font-semibold capitalize">
                        {userData?.communicationPreference || "Email"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className=" bg-purple-50  rounded-2xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg mr-3">
                  <FaUser className="w-5 h-5 text-white" />
                </div>
                Account Details
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      STATUS
                    </p>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 ${getStatusColor(
                          userData?.status
                        )} rounded-full`}
                      ></div>
                      <span
                        className={`font-medium capitalize ${getStatusTextColor(
                          userData?.status
                        )}`}
                      >
                        {userData?.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    ROLE
                  </p>
                  <div className="inline-flex items-center px-5 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 capitalize tracking-wide">
                    {userData?.role}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-2">
                    USER ID
                  </p>
                  <div className="flex items-center space-x-2 bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                    <span className="text-gray-700 text-xs font-mono flex-1 truncate">
                      {userData?._id || "68b03ad6c79a1df058f4d89e"}
                    </span>
                    <button
                      onClick={copyUserId}
                      className="text-gray-400 hover:text-purple-600 transition-colors p-1 hover:bg-purple-50 rounded"
                      title="Copy User ID"
                    >
                      {copied ? (
                        <FaCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <FaCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Recent Activity
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 shadow-sm"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Email Verified
                    </p>
                    <p className="text-sm text-gray-600">
                      {userData?.emailVerifiedAt
                        ? formatDate(userData?.emailVerifiedAt)
                        : "28 Aug 2025, 16:47"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mt-1 shadow-sm"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Account Created
                    </p>
                    <p className="text-sm text-gray-600">
                      {userData?.createdAt
                        ? formatDate(userData?.createdAt)
                        : "28 Aug 2025, 16:47"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 shadow-sm"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-600">
                      {userData?.updatedAt
                        ? formatDate(userData.updatedAt)
                        : "3 Sept 2025, 20:46"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
