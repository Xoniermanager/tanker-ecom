import Image from 'next/image'
import React from 'react'

const UserProfile = ({ userData }) => {
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col gap-8 p-6'>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-200 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6 w-full">
          <div className="relative">
            <Image
              src={userData?.profileImage || '/images/admin-avatar.png'}
              height={120}
              width={120}
              className='rounded-full h-30 w-30 object-cover border-4 border-white shadow-lg'
              alt='user'
            />
            <div className="absolute bottom-3 right-3 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className='font-bold text-3xl'>{userData?.fullName}</h1>
            <span className='text-sm bg-white/20 px-3 py-1 rounded-full inline-block w-fit'>
              {userData?.designation}
            </span>
            <span className='text-sm opacity-90'>{userData?.companyName}</span>
          </div>
        </div>
      </div>

      {/* Profile Information Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        
        {/* Contact Information */}
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
          <h2 className='font-semibold text-xl mb-4 text-gray-800 flex items-center gap-2'>
            <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
            Contact Information
          </h2>
          <div className='space-y-4'>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.44a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{userData?.companyEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-medium text-gray-800">{userData?.mobileNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium text-gray-800 capitalize">{userData?.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
          <h2 className='font-semibold text-xl mb-4 text-gray-800 flex items-center gap-2'>
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            Account Information
          </h2>
          <div className='space-y-4'>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                  {userData?.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                  {userData?.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 01-4-4v-4a4 4 0 014-4h4a4 4 0 014 4v4a4 4 0 01-4 4h-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Verified</p>
                <p className="font-medium text-gray-800">
                  {userData?.emailVerifiedAt ? formatDate(userData.emailVerifiedAt) : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
        <h2 className='font-semibold text-xl mb-4 text-gray-800 flex items-center gap-2'>
          <div className="w-2 h-6 bg-green-600 rounded-full"></div>
          Account Timeline
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Created</p>
              <p className="font-semibold text-gray-800">{formatDate(userData?.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-semibold text-gray-800">{formatDate(userData?.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;