import Image from 'next/image'
import React from 'react'

const UserProfile = ({ 
  userData, 
  handleSubmit, 
  formData,  
  handleChange, 
  handleImageChange, 
  previewImage, 
  isLoading, 
  errMessage 
}) => {
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className="profile flex items-center gap-6 w-full">
        <Image
          src={previewImage || userData?.profileImage || '/images/admin-avatar.png'}
          height={116}
          width={116}
          className='rounded-full h-26 w-26 object-cover'
          alt='user'
        />
        <div className="flex flex-col gap-1">
          <h2 className='font-semibold text-xl'>{userData?.fullName}</h2>
          <span className='text-sm text-orange-500'>{userData?.designation}</span>
        </div>
      </div>

      <div className='bg-white rounded-lg p-6 px-8 flex flex-col gap-4'>
        <h2 className='font-semibold text-2xl'>Basic Information</h2>
        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-5'>
          
          {/* Image Upload */}
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="companyEmail">Company Email</label>
            <input
              type="text"
              name="companyEmail"
              placeholder="Company Email"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="number"
              name="mobileNumber"
              placeholder="Mobile Number"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-2 flex justify-end">
            {errMessage && <p className='text-red-500'>{errMessage}</p>}
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              disabled={isLoading}
              type='submit'
              className='bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2'
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
