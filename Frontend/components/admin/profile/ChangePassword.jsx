import React, {useState} from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = ({passwordData, handlePasswordChange, handlePasswordDataChange, isLoading, errMessage}) => {
    const [oldPassShow, setOldPassShow] = useState(false)
    const [newPassShow, setNewPassShow] = useState(false)
    const [conPassShow, setConPassShow] = useState(false)
  return (
    <div className='bg-white rounded-lg p-6 px-8 flex flex-col gap-8'>
      <h2 className='font-semibold text-2xl'><span className='text-red-500'>*</span> Change Admin Password</h2>
      <form onSubmit={handlePasswordChange} className='grid grid-cols-2 gap-5'>
         <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="oldPassword">Old Password</label>
            <div className='flex gap-2 items-center border border-gray-300 bg-white rounded-md px-5 py-3 outline-none'>
            {oldPassShow ? <input
              type="text"
              name="oldPassword"
              value={passwordData.oldPassword}
              placeholder='Enter your old password'
              onChange={handlePasswordDataChange}
              className="outline-none w-full"
            /> : <input
              type="password"
              name="oldPassword"
              placeholder='Enter your old password'
              value={passwordData.oldPassword}
              onChange={handlePasswordDataChange}
              className="outline-none w-full"
            />} <button type='button' onClick={()=>setOldPassShow(!oldPassShow)}>{oldPassShow ? <FaEye /> : <FaEyeSlash/>}</button></div>
          </div>
         <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="newPassword">New Password</label>
            <div className='flex gap-2 items-center border border-gray-300 bg-white rounded-md px-5 py-3 outline-none'>
            {newPassShow ? <input
              type="text"
              name="newPassword"
              placeholder='Enter your new password'
              value={passwordData.newPassword}
              onChange={handlePasswordDataChange}
              className="outline-none w-full"
            /> : <input
              type="password"
              name="newPassword"
              placeholder='Enter your new password'
              value={passwordData.newPassword}
              onChange={handlePasswordDataChange}
              className="outline-none w-full"
            />} <button type='button' onClick={()=>setNewPassShow(!newPassShow)}>{newPassShow ? <FaEye /> : <FaEyeSlash/>}</button></div>
          </div>
         <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="confirmNewPassword">Confirm Password</label>
            <div className='flex gap-2 items-center border border-gray-300 bg-white rounded-md px-5 py-3 outline-none'>
            {conPassShow ? <input
              type="text"
              name="confirmNewPassword"
              placeholder='Enter your new password again'
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordDataChange}
              className="outline-none w-full"
            /> : <input
              type="password"
              name="confirmNewPassword"
              placeholder='Enter your new password again'
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordDataChange}
              className="outline-none w-full"
            />} <button type='button' onClick={()=>setConPassShow(!conPassShow)}>{conPassShow ? <FaEye /> : <FaEyeSlash/>}</button></div>
          </div>

          <div className="flex justify-end col-span-2">
               {errMessage && (
                <p className='text-red-500'>{errMessage}</p>
               )}
          </div>

          <div className="flex justify-end col-span-2">
            <button type='submit' disabled={isLoading || passwordData.oldPassword === "" || passwordData.oldPassword === "" || passwordData.conPassShow === ""} className='bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2'>{isLoading ? "Changing..." : "Change"}</button>
          </div>

      </form>
    </div>
  )
}

export default ChangePassword
