"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import api from "../../../../../../../components/user/common/api";
import UpdateProductForm from "../../../../../../../components/admin/products/UpdateProductForm";

const Page = () => {
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    partNumber: "",
    name: "",
    category: "",
    regularPrice: "",
    sellingPrice: "",
    // shippingPrice:"",
    shortDescription: "",
    description: "",
    brand: "",
    origin: "",
    highlights: [],
    images:[],
    specificationsDoc: {
      type: "",
      source: "",
    },
    measurements: [
      {
        measurementName: "",
        measurementValue: "",
      },
    ],
    deliveryDays:"",
    shippingCharge:0,
    // specifications: {
    //   height: "",
    //   length: "",
    //   width: "",
    //   weight: "",
    //   volume: "",
    //   packTypeCode: "",
    // },
    images: [],
    // slug: "",
    // initialQuantity: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });
  const { slug } = useParams();

  const getProduct = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.status === 200) {
        const product = response.data.data;

        setProductData(product);

        setImagePreviews(product.images.map((item) => item.source));

        setFormData({
          partNumber: product.partNumber || "",
          name: product.name || "",
          category: product.category._id || "",
          regularPrice: product.regularPrice || "",
          sellingPrice: product.sellingPrice || "",
          // shippingPrice: product.shippingPrice || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          brand: product.brand || "",
          origin: product.origin || "",
          highlights: product.highlights || [],
          deliveryDays: product.deliveryDays || "",
          shippingCharge: product.shippingCharge || "",
          images: product.images,
          specificationsDoc: {
            type: product?.specificationsDoc?.type || "",
            source: ""
          },
          measurements: (product.measurements.length>0) ? product.measurements?.map((item) => ({
            measurementName: item.measurementName,
            measurementValue: item.measurementValue,
          })) : [],
          // images: product.images || [],
          // slug: product.slug || "",
          // initialQuantity: product.inventory?.quantity || "",
    //       specifications: {
    //   height: product.specifications.height || "",
    //   length: product.specifications.length || "",
    //   width: product.specifications.width || "",
    //   weight: product.specifications.weight || "",
    //   volume: product.specifications.volume || "",
    //   packTypeCode: product.specifications.packTypeCode || "",
    // },
          seo: {
            metaTitle: product.seo?.metaTitle || "",
            metaDescription: product.seo?.metaDescription || "",
            keywords: product.seo?.keywords || [],
          },
          status: product.status || "inactive",
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false)
    }
  };



  useEffect(() => {
    getProduct();
  }, []);

  if (isLoading || !formData) {
    return (
      <div className="pl-86 pt-26 flex justify-center items-center h-screen">
        <p className="text-purple-950 font-semibold text-lg animate-pulse">
          Loading Product...
        </p>
      </div>
    );
  }

  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
      <UpdateProductForm
        formData={formData}
        setFormData={setFormData}
        slug={slug}
        productData={productData}
        imagePreviews={imagePreviews}
        setImagePreviews={setImagePreviews}
        prev={productData?.specificationsDoc?.source || null}
      />
    </div>
  );
};

export default Page;
