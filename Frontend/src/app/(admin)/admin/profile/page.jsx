"use client"
import React, { useState, useEffect } from 'react'
import UserProfile from '../../../../../components/admin/profile/UserProfile'
import api from '../../../../../components/user/common/api'

import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import ChangePassword from '../../../../../components/admin/profile/ChangePassword';
import { toast } from 'react-toastify';
import { MdOutlineAlternateEmail } from "react-icons/md";
import UpdateAdminProfile from '../../../../../components/admin/profile/UpdateAdminProfile';
import { LuUserRoundPen } from "react-icons/lu";
const page = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [active, setActive] = useState(1)

  const [formData, setFormData] = useState({
    companyEmail: "",
    companyName: "",
    fullName: "",
    mobileNumber: "",
    profileImage: ""
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword:"",
    newPassword:"",
    confirmNewPassword:""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  
  };
console.log(passwordData)
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getUserData = async () => {
    try {
      const response = await api.get(`/auth/me`);
      if (response.status === 200) {
        setUserData(response.data.data);
        
        setFormData({
          companyEmail: response.data.data.companyEmail || "",
          companyName: response.data.data.companyName || "",
          fullName: response.data.data.fullName || "",
          mobileNumber: Number(response.data.data.mobileNumber) || "",
          profileImage: ""
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleActive = (n)=>{
    setActive(n)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null)
    try {
      
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


  const handlePasswordChange = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null)
      try {
        if(String(passwordData.newPassword) !== String(passwordData.confirmNewPassword)) return setErrMessage('Your new password not match, please check and try again')

          const response = await api.patch('/auth/change-password', passwordData)
          if(response.status === 200){
            toast.success("Your password changed successfully")
            setPasswordData({
              oldPassword:"",
    newPassword:"",
    confirmNewPassword:""
            })
          }
      } catch (error) {
        const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
      }
      finally{
        setIsLoading(false);
      }
  }

  return (
    <div className="pl-86 pt-26 p-6 w-full min-h-screen bg-violet-50 flex items-start  gap-6">
      <div className="w-[64%] rounded-t-2xl flex flex-col gap-4">
       {active === 1 && <UserProfile
          userData={userData}
          
         
         
        />}
        {active === 2 && <ChangePassword passwordData={passwordData} handlePasswordChange={handlePasswordChange} handlePasswordDataChange={handlePasswordDataChange} isLoading={isLoading} errMessage={errMessage}/>}
        {active === 3 && <UpdateAdminProfile/>}
      </div>
      <div className="w-[36%]  sticky top-24 ">
        <ul className='flex flex-col gap-1 bg-white rounded-lg p-4 px-6'>
          <li className={`flex px-4 py-2.5 items-center rounded-lg gap-2 cursor-pointer ${active === 1 && "bg-orange-100 text-orange-500"} `} onClick={()=>handleActive(1)}>
            <FaRegUser /> Profile
          </li>
          <li className={`flex px-4 py-2.5 items-center rounded-lg capitalize gap-2 cursor-pointer ${active === 2 && "bg-orange-100 text-orange-500"} `} onClick={()=>handleActive(2)}>
            <RiLockPasswordLine /> change password
          </li>
          <li className={`flex px-4 py-2.5 items-center rounded-lg capitalize gap-2 cursor-pointer ${active === 3 && "bg-orange-100 text-orange-500"} `} onClick={()=>handleActive(3)}>
            <LuUserRoundPen /> Update Profile
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default page;

