"use client";

import React, { useState } from "react";
import api from "../../../../components/user/common/api";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useRouter } from "next/navigation";

const page = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const router = useRouter()

  const handleRequest = async () => {
    setIsLoading(true);
    setErrMessage("");

    try {
      const response = await api.post("/auth/request-password-reset", { email });
      if (response.status === 200) {
        localStorage.setItem("verifyEmail", email);
        toast.success("OTP sent successfully! Please check your inbox.");
        router.push(`/verify-admin-otp`)
        setEmail("");
      }
    } catch (error) {
      console.log(error);
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
    <div className="h-full flex items-center justify-center bg-[#f2edf6] px-4" >
      <div className="max-w-xl bg-white p-8 w-full rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Forgot your password?
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Enter your email to receive a reset code.
        </p>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-gray-700 font-medium">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FaEnvelope />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="border-1 border-neutral-200  py-3.5 px-5 outline-none pl-10 w-full rounded-md"
            />
          </div>
          {errMessage && (
            <p className="text-sm text-red-500 mt-1">{errMessage}</p>
          )}
        </div>

        <button
          disabled={isLoading || !email}
          onClick={handleRequest}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition ${
            isLoading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isLoading && <ImSpinner8 className="animate-spin text-lg" />}
          Request Reset Code
        </button>
        <div className="flex justify-center items-center  "><button className="text-orange-500 hover:text-orange-600 hover:underline" onClick={()=>router.back()}>Step Back</button></div>
      </div>
    </div>
  );
};

export default page;
