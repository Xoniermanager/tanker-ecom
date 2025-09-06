"use client";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import api from "../../../../components/user/common/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

import { HiMiniBuildingOffice } from "react-icons/hi2";
import {
  FaUser,
  FaPhoneAlt,
  FaGlobe,
  FaLanguage,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { PiOfficeChairFill } from "react-icons/pi";
import { BiSolidMessageCheck } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import Link from "next/link";
import { COUNTRIES } from "../../../../constants/enums";

const page = () => {
  const [passShow, setPassShow] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [captchaToken, setCaptchaToken] = useState(null);
  const [formData, setFormData] = useState({
    companyEmail: "",
    companyName: "",
    fullName: "",
    designation: "",
    mobileNumber: "",
    alternativeEmail: "",
    country: "",
    preferredLanguage: "",
    communicationPreference: "",
    password: "",
    confirmPassword: "",
  });
  const recaptchaRef = useRef(null);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formDisable = formData.fullName === "" || formData.companyName === "" || formData.alternativeEmail === "" || formData.communicationPreference === "" || formData.confirmPassword === "" || formData.country === "" || formData.designation === "" || formData.mobileNumber === "" || formData.password === "" || formData.preferredLanguage === "" || formData.password.length < 8 || !captchaToken;

  const handleCaptcha = (token) => {
    
    setCaptchaToken(token);
    if (errMessage && errMessage.includes("robot")) setErrMessage(null);
  };

  const handleCaptchaExpired = () => {
   
    setCaptchaToken(null);
  };

  const handleCaptchaError = () => {
    
    setCaptchaToken(null);
    setErrMessage("reCAPTCHA error occurred. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!captchaToken) {
        setErrMessage("Please verify that you are not a robot");
        return;
      }
      if (formData.password.trim() !== formData.confirmPassword.trim())
        return setErrMessage(
          "Your password does not matching please fill again"
        );

      if (formData.password.trim().length < 8)
        return setErrMessage("Password should be 8 words or above");
      const response = await api.post(`/auth/register`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        window.localStorage.setItem("verify-email", formData.companyEmail);
        setFormData({
          companyEmail: "",
          companyName: "",
          fullName: "",
          designation: "",
          mobileNumber: "",
          alternativeEmail: "",
          country: "",
          preferredLanguage: "",
          communicationPreference: "",
          password: "",
          confirmPassword: "",
        });
        toast.success("Your account created successfully");
        router.push("/signup/verify-otp");
      }
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
      setCaptchaToken(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  };

  const passLength = formData.password.trim().length;

  return (
    <>
      <div className="py-24 max-w-7xl mx-auto flex items-start gap-5">
        <div className="w-[43%] flex flex-col gap-2 sticky top-28">
          <h1 className="text-[40px] font-bold text-purple-950 ">
            Create Your Account
          </h1>
          <p className="text-zinc-500 text-lg font-medium">
            Fill in your details to register and join our platform.
          </p>
          <Image
            src={"/images/signup.avif"}
            width={460}
            height={460}
            alt="signup image"
          />
        </div>
        <div className="w-[57%] bg-white rounded-lg shadow-[0_0_14px_#00000015] p-9 flex flex-col gap-6">
          <div className="bg-orange-100 p-3 px-4 font-semibold text-purple-950 text-xl rounded">
            Login Details
          </div>
          <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
            <div className="flex items-center gap-5">
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="companyEmail"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <FaEnvelope /> Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Enter Company Email"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <label
                  htmlFor="companyName"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <HiMiniBuildingOffice /> Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Enter Company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="bg-orange-100 p-3 px-4 font-semibold text-purple-950 text-xl rounded">
              Contact Person Details
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="fullName"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <FaUser />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="designation"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <PiOfficeChairFill />
                  Designation / Job Title
                </label>
                <input
                  type="text"
                  name="designation"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Enter Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="mobileNumber"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <FaPhoneAlt />
                  Mobile Number
                </label>
                <input
                  type="number"
                  name="mobileNumber"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="alternativeEmail"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <FaEnvelope />
                  Alternative Email
                </label>
                <input
                  type="email"
                  name="alternativeEmail"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Enter Alternative Email"
                  value={formData.alternativeEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="country"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <FaGlobe />
                  Country / Region
                </label>
                <select
                  name="country"
                  id="country"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Country</option>
                  {Object.values(COUNTRIES).map((country) => (
                    <option key={country.code} value={country.value}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="preferredLanguage"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <FaLanguage className="text-xl" />
                  Preferred Language
                </label>
                <select
                  name="preferredLanguage"
                  id="preferredLanguage"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  onChange={handleChange}
                  required
                >
                  <option hidden> Select Preferred Language</option>
                  <option value="english">English</option>
                  <option value="mandarin">Mandarin</option>
                  <option value="spanish">Spanish</option>
                </select>
              </div>
              <div className="w-full flex flex-col gap-2 col-span-2">
                <label
                  htmlFor="communicationPreference"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <BiSolidMessageCheck />
                  Communication Preference
                </label>
                <select
                  name="communicationPreference"
                  id="communicationPreference"
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  value={formData.communicationPreference}
                  onChange={handleChange}
                  required
                >
                  <option hidden> Select Communication Preference</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <RiLockPasswordFill />
                  Password
                </label>
                <div
                  className={`border-1 border-neutral-200 focus-within:border-2 rounded py-3.5 px-5 ${
                    passLength < 8
                      ? "focus-within:border-red-400 "
                      : "focus-within:border-green-500"
                  } flex items-center`}
                >
                  {passShow ? (
                    <input
                      type="text"
                      name="password"
                      className="w-full outline-none "
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <input
                      type="password"
                      name="password"
                      className="w-full outline-none"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  )}{" "}
                  {passShow ? (
                    <span
                      className="text-lg hover:text-purple-950 hover:cursor-pointer hover:scale-105 "
                      onClick={() => setPassShow(false)}
                    >
                      {" "}
                      <FaEye />
                    </span>
                  ) : (
                    <span
                      className="text-lg hover:text-purple-950 hover:cursor-pointer hover:scale-105 "
                      onClick={() => setPassShow(true)}
                    >
                      {" "}
                      <FaEyeSlash />
                    </span>
                  )}{" "}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-purple-950 flex gap-1.5 items-center font-medium"
                >
                  <RiLockPasswordFill />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  placeholder="Re-enter Password"
                />
              </div>
            </div>
            {errMessage && (
              <div className="flex justify-end">
                <p className="text-red-500">{errMessage}</p>
              </div>
            )}
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={handleCaptcha}
              onExpired={handleCaptchaExpired}
              onError={handleCaptchaError}
              theme="light"
            />
            <div className="flex relative group">
              <button
                type="submit"
                disabled={formDisable}
               
                className="bg-purple-900 disabled:bg-purple-400 hover:bg-purple-950 text-white px-9 tracking-wide py-3 rounded-md font-medium"
              >
                {isLoading ? "Submitting..." : "Sign Up"}
              </button>
              {formDisable && (
                              <span className="absolute left-0 -translate-x-4 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
                                Please fill all the fields properly
                              </span>
                            )}
            </div>

            <div className="flex">
              <p className="text-zinc-500 text-lg font-medium">
                {" "}
                Already have an account? please{" "}
                <Link
                  href={"/login"}
                  className="text-orange-500 font-medium underline"
                >
                  {" "}
                  Login{" "}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default page;
