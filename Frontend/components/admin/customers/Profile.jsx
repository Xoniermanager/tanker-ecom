import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
//   FiBuilding,
  FiGlobe, 
  FiMessageSquare,
  FiCalendar,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit,
  FiMoreHorizontal,
  FiMapPin,
  FiUserCheck,
  FiBriefcase
} from 'react-icons/fi';

const Profile = ({ data }) => {


  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Profile data not found for this user</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
     
        
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderator':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'inactive':
      case 'suspended':
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Background */}
        <div className="h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-purple-900 bg-opacity-10"></div>
        </div>
        
        {/* Profile Content */}
        <div className="px-6 pb-8 -mt-12 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                 
                    <Image

                      src={data.profileImage || "/images/admin-avatar.png"} 
                      alt={data.fullName}
                      height={100}
                      width={100}
                      className="w-full h-full object-cover"
                    />
               
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl mb-4 font-bold text-white">{data.fullName}</h1>
                <p className="text-md text-gray-600 flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4" />
                  {data.designation}
                </p>
                <p className="text-gray-500 flex items-center gap-2">
                  {/* <FiBuilding className="w-4 h-4" /> */}
                  {data.companyName}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(data.status)}`}>
                  {getStatusIcon(data.status)}
                  {data.status?.charAt(0).toUpperCase() + data.status?.slice(1)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getRoleColor(data.role)}`}>
                  <FiShield className="w-4 h-4" />
                  {data.role?.charAt(0).toUpperCase() + data.role?.slice(1)}
                </span>
              </div>
              {/* <button className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                <FiEdit className="w-4 h-4" />
                Edit Profile
              </button> */}
             
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-violet-600" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <FiMail className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company Email</p>
                    <p className="text-gray-900 font-medium">{data.companyEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiMail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Alternative Email</p>
                    <p className="text-gray-900 font-medium">{data.alternativeEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiPhone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                    <p className="text-gray-900 font-medium">{data.mobileNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiMapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="text-gray-900 font-medium capitalize">{data.country}</p>
                  </div>
                </div>
                
                
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiMessageSquare className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Communication Preference</p>
                    <p className="text-gray-900 font-medium capitalize">{data.communicationPreference}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Stats */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiShield className="w-5 h-5 text-violet-600" />
              Account Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Email Verified</span>
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Account Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                  {getStatusIcon(data.status)}
                  {data.status?.charAt(0).toUpperCase() + data.status?.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Role</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(data.role)}`}>
                  <FiUserCheck className="w-3 h-3" />
                  {data.role?.charAt(0).toUpperCase() + data.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiClock className="w-5 h-5 text-violet-600" />
              Timeline
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Verified</p>
                  <p className="text-xs text-gray-500">{formatDate(data.emailVerifiedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                  <p className="text-xs text-gray-500">{formatDate(data.updatedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Created</p>
                  <p className="text-xs text-gray-500">{formatDate(data.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full group flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200">
                <div className="p-2 bg-blue-100 group-hover:bg-blue-500 rounded-lg transition-colors">
                  <FiMail className="w-4 h-4 text-blue-600 group-hover:text-white" />
                </div>
                <Link href={`mailto:${data.companyEmail}`}>
                  <span className="font-medium text-gray-900">Send Email</span>
                  <p className="text-sm text-gray-500">Send notification or message</p>
                </Link>
              </button>
              
              {/* <button className="w-full group flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 rounded-xl transition-all duration-200 border border-transparent hover:border-violet-200">
                <div className="p-2 bg-violet-100 group-hover:bg-violet-500 rounded-lg transition-colors">
                  <FiEdit className="w-4 h-4 text-violet-600 group-hover:text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Edit Profile</span>
                  <p className="text-sm text-gray-500">Modify user information</p>
                </div>
              </button> */}
              
              {/* <button className="w-full group flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-xl transition-all duration-200 border border-transparent hover:border-orange-200">
                <div className="p-2 bg-orange-100 group-hover:bg-orange-500 rounded-lg transition-colors">
                  <FiShield className="w-4 h-4 text-orange-600 group-hover:text-white" />
                </div>
                <div>
                  <span className="font-medium text-gray-900">Manage Permissions</span>
                  <p className="text-sm text-gray-500">Update role and access</p>
                </div>
              </button> */}
              
              {/* <div className="pt-2 border-t border-gray-100">
                <button className="w-full group flex items-center gap-4 p-4 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200">
                  <div className="p-2 bg-red-100 group-hover:bg-red-500 rounded-lg transition-colors">
                    <FiAlertCircle className="w-4 h-4 text-red-600 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Account Actions</span>
                    <p className="text-sm text-gray-500">Suspend or deactivate</p>
                  </div>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;