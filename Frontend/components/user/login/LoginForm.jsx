"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import api from "../common/api";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [passShow, setPassShow] = useState(false);
  const [formData, setFormData] = useState({
    companyEmail: "",
    password: "",
  });

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
    try {
      const response = await api.post(`/auth/request-login-otp`, {
        email: formData.companyEmail,
        password: formData.password,
      });
      if (response.status === 200) {
        toast.success("Credentials accepted, please verify otp");
        window.localStorage.setItem(
          "verify-login-email",
          formData.companyEmail
        );
        window.localStorage.setItem("verify-login-password", formData.password);
        setFormData({ companyEmail: "", password: "" });
      
        router.push(`/login/verify-otp${redirect && `?redirect=${redirect}`}`);
      }
    } catch (error) {
     
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
    <>
      <div className="bg-slate-100 py-14 md:py-18 lg:py-24 px-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-[42%] flex flex-col items-center lg:items-start gap-2">
            <h1 className=" text-3xl md:text-[40px] font-bold text-purple-950 ">
              Welcome Back
            </h1>
            <p className="text-zinc-500 text-lg text-center lg:text-start font-medium">
              Please login to shopping with us and manage your profile and
              orders
            </p>
            <Image
              src={"/images/login.webp"}
              width={460}
              height={460}
              className="md:block hidden"
              alt="signup image "
            />
          </div>
          <div className="w-full md:w-[57%] bg-white rounded-lg shadow-[0_0_14px_#00000015] lg:p-9 p-6 flex flex-col gap-6">
            <form className="flex flex-col gap-4 lg:gap-6" onSubmit={handleSubmit}>
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="companyEmail"
                  className="text-purple-950 flex text-sm md:text-base gap-1.5 items-center font-medium"
                >
                  {" "}
                  <FaEnvelope /> Company Email
                </label>
                <input
                  type="text"
                  name="companyEmail"
                  value={formData.companyEmail}
                  className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none"
                  onChange={handleChange}
                  placeholder="Enter Company Email"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="password"
                  className="text-purple-950 flex text-sm md:text-base gap-1.5 items-center font-medium"
                >
                  {" "}
                  <RiLockPasswordFill className="text-base md:text-xl" /> Password
                </label>
                <div className="border-1 border-neutral-200 rounded py-3.5 px-5 outline-none flex items-center">
                  {passShow ? (
                    <input
                      type="text"
                      name="password"
                      className="w-full outline-none"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type="password"
                      name="password"
                      className="w-full outline-none"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
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
              <div className="flex justify-end">
                <Link
                  href={"/login/forgot-password"}
                  className="text-orange-500 hover:underline text-sm text-base font-medium"
                >
                  {" "}
                  Forgot your password?
                </Link>
              </div>
              {errMessage && (
                <div className="flex justify-end">
                  <p className="text-red-500">{errMessage}</p>
                </div>
              )}
              <div className="flex">
                <button
                  style={{ borderRadius: "8px" }}
                  type="submit"
                  className="btn-two w-full lg:w-fit uppercase"
                >
                  {isLoading ? "Submitting..." : "Login"}
                </button>
              </div>
              <div className="flex justify-center md:justify-start">
                <p className="text-zinc-500 text-center lg:text-start lg:text-lg font-medium">
                  {" "}
                  Don't have an account? please{" "}
                  <Link
                    href={"/signup"}
                    className="text-orange-500 font-medium underline"
                  >
                    {" "}
                    Sign Up{" "}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
