"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import api from "../../../../../../../components/user/common/api";
import UpdateProductForm from "../../../../../../../components/admin/products/UpdateProductForm";

const Page = () => {
  const [productData, setProductData] = useState(null)
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
      name: "",
      category: "",
      regularPrice: "",
      sellingPrice: "",
      shortDescription: "",
      description: "",
      brand: "",
      origin: "",
      highlights: [],
      specifications: {
        type: "",
        source: "",
      },
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
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.status === 200) {
        const product = response.data.data;

        setProductData(product)
        
        setImagePreviews(product.images.map(item=>item.source))

        setFormData({
          name: product.name || "",
          category: product.category._id || "",
          regularPrice: product.regularPrice || "",
          sellingPrice: product.sellingPrice || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          brand: product.brand || "",
          origin: product.origin || "",
          highlights: product.highlights || [],
          specifications:{
        type: "",
        source: "",
      },
          images: product.images || [],
          // slug: product.slug || "",
          // initialQuantity: product.inventory?.quantity || "",
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
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-purple-950 font-semibold text-lg animate-pulse">
          Loading Product...
        </p>
      </div>
    );
  }

  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 min-h-screen flex flex-col gap-6">
      
      <UpdateProductForm formData={formData} setFormData={setFormData} slug={slug} productData={productData} imagePreviews={imagePreviews} setImagePreviews={setImagePreviews}/>
    </div>
  );
};

export default Page;
