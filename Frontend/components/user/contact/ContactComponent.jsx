"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { RiCustomerService2Fill } from "react-icons/ri";
import { FaUser, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";
import api from "../common/api";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

const ContactComponent = ({ addressData, contactsData }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const [captchaToken, setCaptchaToken] = useState(null)
  const [errMessage, setErrMessage] = useState(null);
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errMessage) setErrMessage(null);
  };

  // const handleCaptcha = (token)=>{
  //     console.log("Captcha token received:", token);
  //     setCaptchaToken(token)
  //     if(errMessage && errMessage.includes('robot')) setErrMessage(null)
  // }

  // const handleCaptchaExpired = () => {
  //     console.log("Captcha expired");
  //     setCaptchaToken(null)
  // }

  // const handleCaptchaError = () => {
  //     console.log("Captcha error");
  //     setCaptchaToken(null)
  //     setErrMessage("reCAPTCHA error occurred. Please try again.")
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMessage(null);

    // if(!captchaToken) {
    //     setErrMessage('Please verify that you are not a robot')
    //     return
    // }

    const token = await recaptchaRef.current.executeAsync();
    recaptchaRef.current.reset();

    setIsLoading(true);

    try {
      const requestData = {
        ...formData,
        captchaToken: token,
      };

      const response = await api.post(`/contact`, requestData);

      if (response.status === 200) {
        toast.success("Your query sent successfully");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const listData = addressData?.contents.sort((a, b) => a.order - b.order);
  const contactData = contactsData.contents.sort((a, b) => a.order - b.order);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    console.log("reCAPTCHA Site Key:", siteKey);

    if (!siteKey) {
      console.error(
        "NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set in environment variables"
      );
    } else if (!siteKey.startsWith("6L")) {
      console.error(
        "Invalid reCAPTCHA site key format. Site key should start with '6L'"
      );
    }
  }, []);

  return (
    <>
      <div className="py-22 md:py-28 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col gap-22">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-[43%] flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl md:text-5xl font-bold text-center md:text-start text-purple-950 md:w-[85%] leading-12 md:leading-14">
                  {addressData?.heading || "N/A"}
                </h2>
                <p className="text-zinc-500 text-lg font-medium text-center md:text-start">
                  {addressData?.subheading || "N/A"}
                </p>
              </div>
              {listData.map((item, i) => (
                <Link
                  key={i}
                  href={"/"}
                  className="bg-white rounded-4xl p-4 md:p-5 px-6 md:px-7 flex items-center gap-8 hover:shadow-[0_0_16px_#00000012] hover:scale-103 group"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="font-black text-purple-950 text-xl md:text-2xl tracking-wide">
                      {item?.title || "N/A"}
                    </h4>
                    <p className="text-zinc-500 text-sm md:text-lg font-medium">
                      {item?.description || "N/A"}
                    </p>
                  </div>
                  <div className="h-12 md:h-18 w-14 md:w-12 min-w-12 md:min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-2xl md:text-4xl">
                    <IoLocationOutline className="group-hover:scale-108 duration-500" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="w-full md:w-[57%] flex flex-col gap-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.9699898533486!2d174.8303477!3d-41.1384791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d3f531165bb3595%3A0xa90c817be87ab284!2s8%20Makaro%20Street%2C%20Elsdon%2C%20Porirua%205022%2C%20New%20Zealand!5e1!3m2!1sen!2sin!4v1751610971477!5m2!1sen!2sin"
                width="600"
                height="550"
                style={{ border: "8" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl h-60 md:h-[550px] border-8 border-white w-full"
              />
            </div>
          </div>

          <div className="border-b-1 border-stone-300/80 w-full"></div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-[43%]  flex flex-col gap-5">
              <h2 className="text-4xl md:text-5xl text-center md:text-start font-bold text-purple-950 md:w-[85%] leading-12 md:leading-14">
                {contactsData?.heading || "N/A"}
              </h2>
              <p className="text-zinc-500 text-lg font-medium text-center md:text-start">
                {contactsData?.subheading || "N/A"}
              </p>
              <Image
                src={"/images/contact-img.png"}
                className="w-full object-contain"
                height={300}
                width={300}
                alt="contact"
              />
            </div>

            <div className="md:w-[57%] w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4  bg-white rounded-xl p-6 md:p-10"
              >
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="firstName"
                    className="flex items-center gap-1.5 text-purple-950 font-medium"
                  >
                    <FaUser /> First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5"
                    value={formData.firstName}
                    placeholder="First Name"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="lastName"
                    className="flex items-center gap-1.5 text-purple-950 font-medium"
                  >
                    <FaUser /> Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5"
                    value={formData.lastName}
                    placeholder="Last Name"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5 ">
                  <div className="flex w-full md:w-1/2 flex-col gap-3">
                    <label
                      htmlFor="phone"
                      className="flex items-center gap-1.5 text-purple-950 font-medium"
                    >
                      <FaPhoneAlt /> Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5"
                      value={formData.phone}
                      placeholder="Your Contact Number"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="flex w-full md:w-1/2 flex-col gap-3">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-1.5 text-purple-950 font-medium"
                    >
                      <FaEnvelope /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="border-stone-200 border-1 rounded-md outline-none px-6 py-3.5"
                      value={formData.email}
                      placeholder="Your Email"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="message"
                    className="flex items-center gap-1.5 text-purple-950 font-medium"
                  >
                    <BiSolidMessageRounded /> Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    className="border-stone-200 border-1 rounded-lg outline-none px-6 py-3.5"
                    value={formData.message}
                    placeholder="Write Message..."
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <div className="flex justify-start">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  />
                </div>

                {errMessage && (
                  <div className="flex justify-center">
                    <p className="text-red-500 text-center">{errMessage}</p>
                  </div>
                )}

                <div className="flex">
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      formData.phone === "" ||
                      formData.firstName === "" ||
                      formData.email === "" ||
                      formData.message === ""
                    }
                    className="uppercase font-bold tracking-wide disabled:bg-black/60 bg-black hover:bg-orange-400 text-white px-9 py-4 rounded-md"
                  >
                    {isLoading ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {contactData.map((item, i) => {
              let link;
              if (item.description.includes("@")) {
                link = `mailto:${item.description}`;
              } else {
                link = `tel:${item.description}`;
              }
              return (
                <Link
                  key={i}
                  href={`${link}`}
                  className="bg-white p-5 md:p-7 px-5 md:px-9 rounded-4xl hover:scale-103 flex items-center justify-between gap-3 md:gap-5 hover:shadow-[0_0_18px_#00000020]"
                >
                  <div className="flex flex-col gap-1 md:gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-purple-950">
                      {item.title || "N/A"}
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-lg font-medium">
                      {item.description || "N/A"}
                    </p>
                  </div>
                  <div className="h-12 md:h-18 w-12 md:w-18 min-w-12 md:min-w-18 bg-orange-400 text-white rounded-full flex items-center justify-center text-2xl md:text-4xl">
                    <RiCustomerService2Fill className="group-hover:scale-108 duration-500" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactComponent;
