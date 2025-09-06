"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../../../../../../components/user/common/api";
import DeletePopup from "../../../../../../../components/admin/common/DeletePopup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PageLoader from "../../../../../../../components/common/PageLoader";
import Link from "next/link";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { IoChevronBackOutline } from "react-icons/io5";

const Page = () => {
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletePopupShow, setDeletePopupShow] = useState(false);
  const [deletedProductId, setDeletedProductId] = useState(null);
  const [errMessage, setErrMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { slug } = useParams();

  const router = useRouter()


  const getProduct = async () => {
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.status === 200) {
        setProductData(response.data.data);
      }
    } catch (error) {
      console.error(error);
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

  if (!productData) {
    return (
      <PageLoader/>
    );
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
          <h1 className="text-3xl font-bold text-purple-950 capitalize">
            {productData.name}
          </h1>
          <div className="flex gap-3">
            <Link href={`/admin/products/update/${productData.slug}`} className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition flex items-center gap-2">
              <MdOutlineEdit className="text-lg"/> Edit Product
            </Link>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition flex items-center gap-2" onClick={()=>setDeleteProduct(productData._id)}>
             <MdDeleteOutline className="text-xl"/> Delete Product
            </button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow hover:bg-orange-600 transition flex items-center gap-2" onClick={()=>router.back()}>
             <IoChevronBackOutline className="text-xl"/> Back
            </button>
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="space-y-4 sticky top-24 left-0 w-1/2">
            <div className="bg-white rounded-xl shadow p-4">
              <img
                src={selectedImage || (productData.images[0]?.source ? productData.images[0]?.source :'/images/dummy.jpg')}
                alt={productData.name}
                className="rounded-xl shadow border-1 border-stone-200 w-full h-80 object-cover"
              />

              <div className="flex gap-3 mt-4 overflow-x-auto">
                {productData.images.map((img) => (
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
                <span className="font-semibold text-purple-950">Category:</span>{" "}
                {productData.category.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Brand:</span>{" "}
                {productData.brand}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Origin:</span>{" "}
                {productData.origin}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold text-purple-950">Slug:</span>{" "}
                {productData.slug}
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
    </>
  );
};

export default Page;
