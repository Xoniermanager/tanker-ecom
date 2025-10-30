"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../../../../../../components/user/common/api";
import DeletePopup from "../../../../../../../components/admin/common/DeletePopup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PageLoader from "../../../../../../../components/common/PageLoader";
import Link from "next/link";
import { MdDeleteOutline, MdOutlineEdit, MdOutlineInventory2, MdContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";
import Image from "next/image";
import FailedDataLoading from "../../../../../../../components/common/FailedDataLoading";


const Page = () => {
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletePopupShow, setDeletePopupShow] = useState(false);
  const [deletedProductId, setDeletedProductId] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [isSlugCopied, setIsSlugCopied] = useState(false)
  const { slug } = useParams();

  const router = useRouter()


  const getProduct = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.status === 200) {
        setProductData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (productData?.images?.length > 0) {
      setSelectedImage(productData.images[0].source);
    }
  }, [productData]);

  const handleDelete = async () => {
    setIsLoading(true)
    setErrMessage(null)
    try {
      const response = await api.delete(`/products/${deletedProductId}`);
      if (response.status === 200) {
        toast.success("Product deleted successfully");
        setDeletePopupShow(false);
        router.push('/admin/products')
        
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
        setIsLoading(true)
    }
  };

  const setDeleteProduct = (id) => {
    setDeletePopupShow(true);
    setDeletedProductId(id);
  };

  const handleCopySlug = (slug)=>{
    navigator.clipboard.writeText(slug)
    setIsSlugCopied(true)

    setTimeout(() => {
       setIsSlugCopied(false)
    }, 3000);
  }

  if (isLoading) {
    return (
      <PageLoader/>
    );
  }

  if(!productData){
    return <FailedDataLoading />
  }

  return (
    <>
     {deletePopupShow && <DeletePopup
        message={"Are you sure to delete this popup"}
        onCancel={() => setDeletePopupShow(false)}
        onDelete={handleDelete}
        errMessage={errMessage}
        isLoading={isLoading}
      /> }
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="w-[46%] text-2xl font-bold text-purple-950 capitalize">
            {productData?.name}
          </h1>
          <div className="w-[54%] flex justify-end gap-3">
            <div className="relative">
            <Link href={`/admin/products/edit-inventory/${productData?._id}`} className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition flex items-center gap-2">
              <MdOutlineInventory2 className="text-lg"/> Edit Inventory
            </Link>
            <span className={`min-w-5 w-fit flex items-center justify-center rounded-full absolute  -top-2 -right-2 z-50 ${(productData?.inventory?.quantity < 10) ? 'bg-red-500 animate-pulse text-[12px] p-0.5' : "bg-green-600 text-[9px] p-1"} text-white`}>{productData?.inventory?.quantity}</span>
            </div>
            <Link href={`/admin/products/update/${productData?.slug}`} className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition flex items-center gap-2">
              <MdOutlineEdit className="text-lg"/> Edit Product
            </Link>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition flex items-center gap-2" onClick={()=>setDeleteProduct(productData?._id)}>
             <MdDeleteOutline className="text-xl"/> Delete Product
            </button>
            {/* <button className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow hover:bg-orange-600 transition flex items-center gap-2" onClick={()=>router.back()}>
             <IoChevronBackOutline className="text-xl"/> Back
            </button> */}
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="space-y-4 sticky top-24 left-0 w-1/2">
            <div className="bg-white rounded-xl shadow p-4">
              <Image
                src={selectedImage || (productData?.images[0]?.source ? productData?.images[0]?.source :'/images/dummy.jpg')} height={350} width={350}
                alt={productData?.name}
                className="rounded-xl shadow border-1 border-stone-200 w-full h-80 object-contain"
              />

              <div className="flex gap-3 mt-4 overflow-x-auto">
                {productData?.images?.map((img) => (
                  <img
                    key={img._id}
                    src={img.source}
                    alt="product"
                    onClick={() => setSelectedImage(img.source)}
                    className={`w-24 h-24 rounded-lg border-1 border-stone-200 object-cover cursor-pointer transition ${
                      selectedImage === img.source
                        ? "ring-2 ring-orange-500"
                        : "hover:ring-2 hover:ring-orange-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 w-1/2">
            <div className="bg-white rounded-xl shadow p-6 space-y-3">
              <h2 className="text-xl font-semibold text-purple-950 mb-3">
                General Information
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Part Number:</span>{" "}
                {productData?.partNumber}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Category:</span>{" "}
                {productData?.category?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Brand:</span>{" "}
                {productData?.brand}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Origin:</span>{" "}
                {productData?.origin}
              </p>
              <p className="text-gray-700 flex items-center gap-1 w-full">
                <span className="font-semibold text-purple-950">Slug:</span>{" "}
                <span className="line-clamp-1">{productData?.slug}</span>
                <button onClick={()=>handleCopySlug(productData?.slug)}>{isSlugCopied ? <FaCheck /> : <MdContentCopy />}</button>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-3">
                Pricing
              </h2>
              <div className="flex gap-6 items-center">
                <p className="text-2xl font-bold text-green-500">
                  ${productData.sellingPrice.toFixed(2)}
                </p>
                <p className="text-lg text-red-500 line-through">
                  ${productData.regularPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* New Shipping & Delivery Section */}
            <div className="bg-white rounded-xl shadow p-6 space-y-3">
              <h2 className="text-xl font-semibold text-purple-950 mb-3">
                Shipping & Delivery
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Delivery Days:</span>{" "}
                <span className="text-orange-500 font-medium">
                  {productData.deliveryDays || "1"} {parseInt(productData.deliveryDays || "1") === 1 ? "day" : "days"}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Shipping Charge:</span>{" "}
                <span className="tracking-wide text-green-500">
                  ${productData.shippingCharge || "Standard shipping"}
                </span>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 space-y-3">
              <h2 className="text-xl font-semibold text-purple-950">
                Description
              </h2>
              <p className="text-gray-800">{productData.shortDescription}</p>
              <p className="text-sm text-gray-600">{productData.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-3">
                Highlights
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {productData.highlights.map((item, idx) => (
                  <li key={idx} className="hover:text-orange-500 transition capitalize">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-950 text-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-3">Inventory</h2>
              <p>
                <span className="font-semibold">Quantity:</span>{" "}
                {productData.inventory?.quantity}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-orange-400 font-semibold">
                  {productData.inventory?.status}
                </span>
              </p>
            </div>

            {productData?.specifications && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-purple-950 mb-4 capitalize">
                  Package Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {productData.specifications.height && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Height</span>
                      <span className="text-lg text-purple-950 font-semibold">
                        {productData.specifications.height} <span className="text-sm text-gray-500">m</span>
                      </span>
                    </div>
                  )}
                  {productData.specifications.length && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Length</span>
                      <span className="text-lg text-purple-950 font-semibold">
                        {productData.specifications.length} <span className="text-sm text-gray-500">m</span>
                      </span>
                    </div>
                  )}
                  {productData.specifications.width && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Width</span>
                      <span className="text-lg text-purple-950 font-semibold">
                        {productData.specifications.width} <span className="text-sm text-gray-500">m</span>
                      </span>
                    </div>
                  )}
                  {productData.specifications.weight && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Weight</span>
                      <span className="text-lg text-purple-950 font-semibold">
                        {productData.specifications.weight} <span className="text-sm text-gray-500">kg</span>
                      </span>
                    </div>
                  )}
                  {productData.specifications.volume && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Volume</span>
                      <span className="text-lg text-purple-950 font-semibold">
                        {productData.specifications.volume} <span className="text-sm text-gray-500">m³</span>
                      </span>
                    </div>
                  )}
                  {productData.specifications.packTypeCode && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600 font-medium">Package Type</span>
                      <span className="text-lg text-orange-500 font-semibold uppercase">
                        {productData.specifications.packTypeCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-purple-950 mb-3 capitalize">measurements</h2>
                {(productData.measurements.length > 0 ) ? productData.measurements.map((item,index)=>(
                  <ul className="flex  flex-col gap-4 list-disc list-inside">
                    <li className="flex items-center  gap-3">
                      <span>{item?.measurementName}: </span>
                      <span className="text-orange-500">{item?.measurementValue}</span>
                    </li>
                    
                   
                  </ul>
                )):(
                  <p className="text-gray-600">No measurement data found</p>
                )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-purple-950 mb-3 capitalize">Specifications</h2>
                {(productData?.specificationsDoc ) ? (productData?.specificationsDoc?.type === 'image') ? <Image src={productData.specificationsDoc.source} height={350} width={350} alt="specification"/> : <span> PDF preview not showing yet </span> :(
                  <p className="text-gray-600">No measurement data found</p>
                )}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-purple-950 mb-2">
                Product Status
              </h2>
              <span
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize ${
                  productData.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {productData.status}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold text-purple-950 mb-3">
    SEO Information
  </h2>
  
  <div className="space-y-2">
    <p className="text-gray-700">
      <span className="font-semibold">Meta Title:</span>{" "}
      {productData.seo?.metaTitle || "No meta title"}
    </p>
    
    <p className="text-gray-700">
      <span className="font-semibold">Meta Description:</span>{" "}
      {productData.seo?.metaDescription || "No meta description"}
    </p>
    
    <p className="text-gray-700">
      <span className="font-semibold">Keywords:</span>{" "}
      {productData.seo?.keywords?.length > 0
        ? productData.seo.keywords.join(", ")
        : "No keywords"}
    </p>
  </div>
</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;