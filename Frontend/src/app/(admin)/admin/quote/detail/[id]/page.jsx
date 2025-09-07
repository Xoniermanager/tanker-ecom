"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '../../../../../../../components/user/common/api';
import PageLoader from '../../../../../../../components/common/PageLoader';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaComment,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const page = () => {
    const [quoteData, setQuoteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errMessage, setErrMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();
    const router = useRouter();

    const fetchQueryById = async () => {
        setIsLoading(true)
        try {
            const response = await api.get(`/contact/detail/${id}`)
            if (response.status === 200) {
                setQuoteData(response.data.data)
            }
        } catch (error) {
            const message =
                (Array.isArray(error?.response?.data?.errors) &&
                    error.response.data.errors[0]?.message) ||
                error?.response?.data?.message ||
                "Something went wrong";
            setErrMessage(message);
            if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
                console.error(message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchQueryById()
    }, [])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-NZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Pacific/Auckland",
        });
    };

    const handleGoBack = () => {
        router.back();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "new":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "contacted":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "quoted":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "closed":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-green-100 text-green-800 border-green-200";
        }
    };

    if (isLoading) {
        return <PageLoader />
    }

    
   
    

    const quote = quoteData;

    if(!quote){
        return <PageLoader />
    }

    return (
       <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
           
                {/* Header */}
                <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 mb-6 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                
                                <h1 className="text-3xl font-bold text-purple-950">
                                    Quote Details
                                </h1>
                            </div>
                            <p className="text-lg font-mono text-orange-500">
                                #{quote?._id.toUpperCase()}
                            </p>
                        </div>
                        <button
                                    onClick={handleGoBack}
                                    className="bg-purple-900 hover:bg-purple-950 px-7 py-2.5 text-white flex items-center rounded-lg gap-2 transition-colors"
                                >
                                    <FaArrowLeft size={17} /> Back
                                </button>
                       
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <FaClock size={16} />
                            Created: {formatDate(quote.createdAt)}
                        </span>
                        
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quote Message */}
                        <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                                <FaComment size={20} />
                                Quote Message
                            </h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                    {quote.message || "No message provided"}
                                </p>
                            </div>
                        </div>

                        {/* Quote Timeline */}
                        <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                                <FaClock size={20} />
                                Timeline
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-purple-950">Quote Submitted</p>
                                                <p className="text-sm text-gray-600">Customer submitted their quote request</p>
                                            </div>
                                            <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                                {formatDate(quote.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {quote.updatedAt !== quote.createdAt && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-purple-950">Last Updated</p>
                                                    <p className="text-sm text-gray-600">Quote information was modified</p>
                                                </div>
                                                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                                                    {formatDate(quote.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-purple-950 mb-4 flex items-center gap-2">
                                <FaUser size={20} />
                                Customer Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Name
                                    </label>
                                    <p className="capitalize text-green-400 font-medium">
                                        {quote.firstName} {quote.lastName}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Email
                                    </label>
                                    <Link
                                        href={`mailto:${quote.email}`}
                                        className="text-green-400 block hover:text-green-500 transition-colors"
                                    >
                                        {quote.email}
                                    </Link>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Phone
                                    </label>
                                    <Link
                                        href={`tel:${quote.phone}`}
                                        className="text-green-400 hover:text-green-500 block transition-colors"
                                    >
                                        {quote.phone}
                                    </Link>
                                </div>
                                
                            </div>
                        </div>

                        {/* Quote Actions */}
                        <div className="bg-white rounded-lg shadow-[0_0_10px_#00000015] border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-purple-950 mb-4">
                                Quick Actions
                            </h2>
                            <div className="space-y-3">
                                <Link href={`mailto:${quote.email}`} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200">
                                    <FaEnvelope size={16} />
                                    Send Quote
                                </Link>
                                <Link href={`tel:${quote.number}`} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                    <FaPhone size={16} />
                                    Call Customer
                                </Link>
                                
                            </div>
                        </div>

                       
                    </div>
                </div>
           
        </div>
    )
}

export default page