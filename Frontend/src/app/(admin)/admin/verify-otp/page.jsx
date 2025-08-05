"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", "", "", ""],
    newPassword: "",
  });

  const inputRefs = useRef([]);

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
    const otpCode = formData.otp.join("");
    if (otpCode.length !== 6) {
      return toast.error("OTP must be 6 digits.");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otpCode,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password reset successfully!");
        window.localStorage.removeItem("verifyEmail");
      } else {
        const res = await response.json();
        toast.error(res.message || "Reset failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#f2edf6] px-4 py-10">
      <div className="max-w-xl bg-white p-8 w-full rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 text-center">
          Reset Password
        </h2>
        <p className="text-center text-gray-600">
          Welcome <span className="font-medium">{formData.email}</span>
        </p>

       
        <div className="flex justify-center gap-3">
          {formData.otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleOTPKeyDown(e, index)}
              className="w-10 h-12 text-center border rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        
        <div>
          <label className="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-900 hover:bg-purple-950 text-white py-2 rounded mt-4 font-medium"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
