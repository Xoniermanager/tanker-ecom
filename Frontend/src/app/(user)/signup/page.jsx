"use client";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import api from "../../../../components/user/common/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

const page = () => {
  const [passShow, setPassShow] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
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
        window.localStorage.setItem("verify-email", formData.companyEmail)
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
        router.push("/signup/verify-otp")
       ;
      }
    } catch (error) {
      console.error(error);
      const message = (Array.isArray(error?.response?.data?.errors) && error.response.data.errors[0]?.message) ||
  error?.response?.data?.message ||  "Something went wrong";

setErrMessage(message);
    } finally {
      setIsLoading(false);
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
                  <option value={""} hidden>
                    {" "}
                    Select Country or Region{" "}
                  </option>

                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia &amp; Herzegovina">
                    Bosnia &amp; Herzegovina
                  </option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Canada">Canada</option>
                  <option value="Cape Verde">Cape Verde</option>
                  <option value="Central African Republic">
                    Central African Republic
                  </option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Congo (Brazzaville)">
                    Congo (Brazzaville)
                  </option>
                  <option value="Congo (Kinshasa)">Congo (Kinshasa)</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican Republic">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Eswatini">Eswatini</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Germany">Germany</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Korea, North">Korea, North</option>
                  <option value="Korea, South">Korea, South</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North Macedonia">North Macedonia</option>
                  <option value="Norway">Norway</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua New Guinea">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Saint Lucia">Saint Lucia</option>
                  <option value="Samoa">Samoa</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Togo">Togo</option>
                  <option value="Trinidad &amp; Tobago">
                    Trinidad &amp; Tobago
                  </option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="United Arab Emirates">
                    United Arab Emirates
                  </option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
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
            <div className="flex ">
              <button
                type="submit"
                style={{ borderRadius: "8px" }}
                className="btn-two"
              >
                {isLoading ? "Submitting..." : "Sign Up"}
              </button>
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
