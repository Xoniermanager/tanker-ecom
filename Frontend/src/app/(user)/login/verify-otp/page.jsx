"use client";
import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import api from "../../../../../components/user/common/api";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../../../context/user/AuthContext";

const VerifyOtpPage = () => {
  const [verifyCredentials, setVerifyCredentials] = useState({
    email: null,
    password: null,
  });
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationOTPSend, setIsVerificationOTPSend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendActive, setResendActive] = useState(false);
  const inputRefs = useRef([]);

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");



  const {fetchUserData} = useAuth();

  useEffect(() => {
    const getVerifyLoginEmail = localStorage.getItem("verify-login-email");
    const getVerifyLoginPassword = localStorage.getItem(
      "verify-login-password"
    );

    setVerifyCredentials({
      email: getVerifyLoginEmail,
      password: getVerifyLoginPassword,
    });
  }, []);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setResendActive(true);
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrMessage("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const response = await api.post(
        `/auth/login`,
        {
          email: verifyCredentials.email,
          password: verifyCredentials.password,
          otp: enteredOtp,
        },
        { withCredentials: true }
      );
      if (response?.status === 200) {
        toast.success("OTP verify successfully");
        setOtp(Array(6).fill(""));
        fetchUserData()
        setVerifyCredentials({
          email: null,
          password: null,
        });
        window.localStorage.removeItem("verify-login-email");
        window.localStorage.removeItem("verify-login-password");

        redirect ? router.push(`${redirect}`) : router.push("/");
      }
    } catch (error) {
      setErrMessage("Verification failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!verifyCredentials.email) return setErrMessage(`Email id not found`);
    try {
      const response = await api.post(`/auth/resend-login-otp`, {
        email: verifyCredentials.email,
        password: verifyCredentials.password,
      });
      if (response.status === 200) {
        toast.success("OTP resend successfully");
        setOtp(Array(6).fill(""));
        setErrMessage(null);
        setIsVerificationOTPSend(true);
      }
    } catch (error) {
      console.error(error);
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";

      setErrMessage(message);
    }
  };

  const isOtpFilled = otp.every((digit) => digit !== "");

  return (
    <div className="py-36 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-xl w-full flex flex-col gap-7">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1 capitalize text-purple-950">
            Verify Your Email for login
          </h2>
          <p className="text-gray-600 text-sm">
            We sent a 6-digit OTP to{" "}
            <span className="font-medium text-orange-400">
              {verifyCredentials.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-6 gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="h-14 w-full text-xl text-center border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            ))}
          </div>

          {errMessage && (
            <p className="text-red-500 text-sm text-right">{errMessage}</p>
          )}

          <button
            type="submit"
            disabled={!isOtpFilled || isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              isOtpFilled && !isLoading
                ? "bg-purple-900 hover:bg-purple-950"
                : "bg-purple-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="w-full flex justify-center items-center text-sm text-gray-500">
          {resendActive ? (
            <button
              onClick={handleResend}
              type="button"
              className="text-blue-600 flex items-center justify-center gap-1 font-medium hover:underline"
            >
              Resend OTP {isVerificationOTPSend && <FaCheckCircle />}
            </button>
          ) : (
            <p>
              Resend OTP in{" "}
              <span className="text-gray-800 font-semibold">{timer}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
