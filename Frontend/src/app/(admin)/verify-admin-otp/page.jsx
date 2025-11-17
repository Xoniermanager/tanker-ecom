"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "../../../../components/user/common/api";
import { IoPlayBackOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { FaEye,  FaEyeSlash } from "react-icons/fa";


const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
  });
  const [passShow, setPassShow] = useState(false)
  
  const inputRefs = useRef([]);
  const router = useRouter()

 

  useEffect(() => {
    const email = window.localStorage.getItem("verifyEmail");
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, []);

  const handleOTPChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); 
    if (!value) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value[0];
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...formData.otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setFormData((prev) => ({ ...prev, otp: newOtp }));
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({ ...prev, newPassword: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    const otpCode = formData.otp.join("");
    if (otpCode.length !== 6) {
      return toast.error("OTP must be 6 digits.");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      const response = await api.post("/auth/reset-password", {
          email: formData.email,
          otp: otpCode,
          newPassword: formData.newPassword });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        window.localStorage.removeItem("verifyEmail");
        router.push('/admin')

      } else {
        const res = await response.json();
        toast.error(res.message || "Reset failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#f2edf6] px-4 py-10">
      <div className="max-w-xl bg-white p-8 w-full rounded-xl shadow-lg space-y-6">
        <h2 className="text-4xl font-semibold text-purple-950 text-center">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 first-letter:capitalize">
          please check your <span className="font-medium text-orange-500">{formData.email}</span> for otp
        </p>

       
        <div className="flex w-full justify-between gap-3">
          {formData.otp.map((digit, index) => (
            <input
              key={index}
              type="string"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleOTPKeyDown(e, index)}
              className="w-16 h-14 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          ))}
        </div>

        
        <div>
          <label className="block text-gray-700 mb-1">New Password</label>
          <div className="border border-gray-300 bg-white rounded-md px-5 py-3 w-full flex items-center ">
          {passShow ? <input
            type="text"
            value={formData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            className="outline-none w-full"
          />:<input
            type="password"
            value={formData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            className="outline-none w-full"
          />} {passShow ? <button className="text-purple-900" onClick={()=>setPassShow(false)}><FaEye /></button>: <button className="text-purple-900" onClick={()=>setPassShow(true)}>< FaEyeSlash /></button>}</div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={formData.otp.includes("") || formData.newPassword === "" || isLoading}
          className="w-full bg-purple-900 disabled:bg-purple-300 hover:bg-purple-950 text-white py-2.5 rounded mt-4 font-medium"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
        <div className="flex items-center justify-between gap-4">
          <button className="capitalize tracking-wide hover:text-purple-900 flex items-center gap-1 cursor-pointer" onClick={()=>router.back()}><IoPlayBackOutline className="text-purple-900"/> Step Back</button>
          <button  className="capitalize hover:text-orange-500 flex items-center gap-1 cursor-pointer" onClick={()=>router.push('/')}> <AiOutlineHome /> Back to home</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
