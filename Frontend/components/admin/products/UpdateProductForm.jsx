"use client";
import React, { useState, useEffect } from "react";
import api from "../../user/common/api";

import { AiOutlineCloudUpload, AiOutlineDollar } from "react-icons/ai";
import { CiCircleList } from "react-icons/ci";
import Link from "next/link";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RiResetLeftFill } from "react-icons/ri";
import { FaStarOfLife, FaTrash } from "react-icons/fa";
import Image from "next/image";

const UpdateProductForm = ({
  formData,
  setFormData,
  productData,
  imagePreviews,
  setImagePreviews,
  prev,
}) => {
  const [specPreview, setSpecPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);

  const [highlights, setHighlights] = useState("");
  const popup = withReactContent(Swal);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      const newVal = value.replace(" ", "_").toLowerCase();
      setFormData((prev) => ({ ...prev, [name]: newVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // useEffect(() => {
  //   if(prev){
  //     setSpecPreview(prev)
  //   }
  // }, [])

  const handleHighlights = () => {
    if (highlights === "" || highlights.trim() === "") return null;
    if (formData.highlights.length >= 10)
      return toast.info("You add maximum 10 highlights");
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, highlights],
    }));
    setHighlights("");
  };

  const handleImageChange = (e) => {
    if (productImages.length >= 10)
      return toast.info("You can add maximum 10 product images");
    const files = Array.from(e.target.files);
    setProductImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleHighlights();
    }
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]:
          name === "keywords" ? value.split(",").map((kw) => kw.trim()) : value,
      },
    }));
  };

  const handleMeasurementChange = (e, index) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedMeasurements = [...prev.measurements];
      updatedMeasurements[index] = {
        ...updatedMeasurements[index],
        [name]: value,
      };
      return {
        ...prev,
        measurements: updatedMeasurements,
      };
    });
  };

  const handleAddMeasurement = () => {
    setFormData((prev) => ({
      ...prev,
      measurements: [
        ...prev.measurements,
        { measurementName: "", measurementValue: "" },
      ],
    }));
  };

  const handleRemoveMeasurement = (index) => {
    // if(formData.measurements.length <= 1) return toast.info("At least one measurement is required")
    setFormData((prev) => {
      const updatedMeasurements = [...prev.measurements];
      updatedMeasurements.splice(index, 1);
      return {
        ...prev,
        measurements:
          updatedMeasurements.length > 0
            ? updatedMeasurements
            : [{ measurementName: "", measurementValue: "" }],
      };
    });
  };

  const handleResetMeasurement = async () => {
    const result = await popup.fire({
      title: "Are you sure?",
      text: `Do you really want to reset measurement`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reset",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    setFormData((prev) => ({
      ...prev,
      measurements: [
        {
          measurementName: "",
          measurementValue: "",
        },
      ],
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          source: file,
        },
      }));

      if (file.type.startsWith("image/")) {
        setSpecPreview(URL.createObjectURL(file));
      } else if (file.type === "application/pdf") {
        setSpecPreview("pdf");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [name]: value,
        },
      }));
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleHighlightRemove = (i) => {
    const newHighlights = formData.highlights.filter((_, index) => index !== i);
    setFormData((prev) => ({ ...prev, highlights: newHighlights }));
  };

  const getCategoryData = async (req, res) => {
    try {
      const response = await api.get(`/product-categories`);
      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryData();
    if (productData?.specifications?.source) {
      setSpecPreview(productData?.specifications?.source);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      if (!productData._id)
        return setErrMessage("Product id not found, please try again!");
      const formPayload = new FormData();

      let uploadedSpecUrl;

      if (formData.specifications.source) {
        formPayload.append("file", formData.specifications.source);
        const thumbRes = await api.put("/upload-files", formPayload);
        uploadedSpecUrl = thumbRes.data.data.file.url;
        formPayload.delete("file");
      }

      formPayload.append("name", formData.name);
      formPayload.append("category", formData.category);
      formPayload.append("regularPrice", formData.regularPrice);
      formPayload.append("sellingPrice", formData.sellingPrice);
      formPayload.append("shortDescription", formData.shortDescription);
      formPayload.append("description", formData.description);
      formPayload.append("brand", formData.brand);
      formPayload.append("origin", formData.origin);
      // formPayload.append("slug", formData.slug);
      // formPayload.append("initialQuantity", formData.initialQuantity);

      formData.highlights.forEach((highlight, index) => {
        formPayload.append(`highlights[${index}]`, highlight);
      });

      if (
        formData.specifications?.type &&
        formData.specifications.type.trim() !== "" && uploadedSpecUrl
      ) {
        formPayload.append(
          "specifications[type]",
          formData.specifications.type
        );
      }
      if (formData.specifications?.source && uploadedSpecUrl) {
        formPayload.append("specifications[source]", uploadedSpecUrl);
      }

      if (formData.seo?.metaTitle) {
        formPayload.append("seo[metaTitle]", formData.seo.metaTitle);
      }
      if (formData.seo?.metaDescription) {
        formPayload.append(
          "seo[metaDescription]",
          formData.seo.metaDescription
        );
      }
      if (Array.isArray(formData.seo?.keywords)) {
        formData.seo.keywords.forEach((kw, index) => {
          formPayload.append(`seo[keywords][${index}]`, kw);
        });
      }

      productImages.forEach((file) => {
        formPayload.append("images", file);
      });

      if (Array.isArray(formData.measurements)) {
        formData.measurements.forEach((m, index) => {
          formPayload.append(
            `measurements[${index}][measurementName]`,
            m.measurementName
          );
          formPayload.append(
            `measurements[${index}][measurementValue]`,
            m.measurementValue
          );
        });
      }

      const response = await api.put(
        `/products/${productData._id}`,
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        setProductImages([]);
        // setImagePreviews([]);
        // setSpecPreview(null);

        toast.success("Product created successfully");
      }
    } catch (error) {
      console.error(error);
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

  return (
    <div className="w-full p-10 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-10">
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-semibold  text-gray-800">
          Update Product
        </h2>
        <Link
          href={"/admin/products"}
          className="bg-purple-500  text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
        >
          {" "}
          <CiCircleList className="text-xl" /> Product List{" "}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5 p-5 rounded-xl bg-purple-50/50">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className=" mb-1 text-sm font-medium text-gray-900 flex gap-1 "
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="category"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 capitalize bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="regularPrice"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Regular Price
            </label>
            <div className="border border-gray-300 rounded-md bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400 gap-2.5">
              <AiOutlineDollar className="text-lg text-orange-400" />{" "}
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                placeholder="Regular Price"
                value={formData.regularPrice}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={handleInputChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="sellingPrice"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Selling Price
            </label>
            <div className="border border-gray-300 rounded-md bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400 gap-2.5">
              <AiOutlineDollar className="text-lg text-orange-400" />
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                placeholder="Selling Price"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                onWheel={(e) => e.currentTarget.blur()}
                className="w-full outline-none"
                required
              />{" "}
            </div>
          </div>

          {/* <div className="flex flex-col gap-2">
            <label
              htmlFor="initialQuantity"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Quantity
            </label>
            <input
              type="number"
              id="initialQuantity"
              name="initialQuantity"
              placeholder="Quantity"
              value={formData.initialQuantity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div> */}
          <div className="flex flex-col gap-2 col-span-2">
            <label
              htmlFor="brand"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label
              htmlFor="shortDescription"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Short Description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              placeholder="Enter product short description here..."
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <label
              htmlFor="description"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description here..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label
              htmlFor="origin"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Product Origin
            </label>
            <select
              type="text"
              id="origin"
              name="origin"
              placeholder="Product Origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" hidden>
                Select Product Origin
              </option>
              <option value="New Zealand">New Zealand</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="China">China</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
              <option value="South Korea">South Korea</option>
              <option value="Brazil">Brazil</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Russia">Russia</option>
              <option value="South Africa">South Africa</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
            </select>
          </div>

          {/* <div className="flex flex-col gap-2">
            <label
              htmlFor="slug"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              placeholder="Slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              
            />
          </div> */}
          <div className="flex items-end gap-3 col-span-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="slug"
                className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
              >
                Highlights
              </label>
              <input
                type="text"
                id="highlights"
                name="highlights"
                placeholder="Highlights"
                onKeyDown={handleTagKeyDown}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>{" "}
            <button
              type="button"
              className="px-4 py-2 bg-green-500 font-medium group hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
              onClick={handleHighlights}
            >
              <FaPlus className="group-hover:rotate-90" /> Add
            </button>{" "}
          </div>
          <div className="flex gap-3 items-center col-span-2 flex-wrap">
            {formData.highlights.map((item, i) => (
              <span
                className="px-5 py-1 rounded-full text-orange-500 bg-orange-100 flex items-center gap-1"
                key={i}
              >
                {item}{" "}
                <FaXmark
                  className="hover:rotate-90 cursor-pointer"
                  onClick={() => handleHighlightRemove(i)}
                />
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="type"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              Specification Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.specifications.type}
              onChange={handleSpecificationChange}
              className="w-full border border-gray-300 bg-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" hidden>
                Select specification type
              </option>
              <option value="pdf">PDF File</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="specSource"
              className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
            >
              Specification File
            </label>
            <input
              id="specSource"
              name="source"
              type="file"
              accept={
                formData.specifications.type === "image" ? "image/*" : ".pdf"
              }
              onChange={handleSpecificationChange}
              className="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 
               file:rounded-full file:border-0 file:text-sm file:font-semibold 
               file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
            {specPreview && (
              <div className="col-span-2 mt-3">
                {specPreview === "pdf" ? (
                  <div className="flex items-center gap-2 p-3 border border-gray-200 rounded bg-gray-50">
                    <span className="text-green-500 font-semibold w-full">
                      📄 PDF Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          specifications: {
                            type: prev.specifications.type,
                            source: null,
                          },
                        }));
                        setSpecPreview(null);
                      }}
                      className="text-red-500 text-xl rounded-full w-6 h-6 flex items-center justify-center hover:rotate-90 hover:text-red-600"
                    >
                      <FaXmark />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-40 h-40">
                    <Image
                      src={specPreview}
                      height={80}
                      width={80}
                      alt="Specification Preview"
                      className="w-full h-full object-cover rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          specifications: {
                            type: prev.specifications.type,
                            source: null,
                          },
                        }));
                        setSpecPreview(null);
                      }}
                      className="absolute top-1 right-1 text-red-600  rounded-full w-6 h-6 flex items-center justify-center text-xl hover:rotate-90 opacity-80 hover:opacity-100"
                      title="Remove specification"
                    >
                      <FaXmark />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <label
              htmlFor="productImages"
              className="flex gap-1 mb-2 text-sm font-medium text-gray-900"
            >
              <span className="text-red-500 text-[8px]">
                <FaStarOfLife />
              </span>{" "}
              Product Images
            </label>
            <input
              id="productImages"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
          </div>

          {imagePreviews?.length > 0 && (
            <div className="col-span-2 grid grid-cols-3 gap-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-full h-52 object-contain rounded shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="bg-white shadow-[0_0_12px_#00000008] p-5 rounded-xl w-full grid grid-cols-1 gap-5 col-span-2">
            <div className="col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-8 justify-between mb-5">
                <h3 className="flex gap-1  text-md font-medium text-gray-900">
                  <span className="text-red-500 text-[8px]">
                    <FaStarOfLife />
                  </span>{" "}
                  Measurements
                </h3>
                <button
                  onClick={handleResetMeasurement}
                  type="button"
                  className="text-white group flex items-center gap-2 bg-red-400 hover:bg-red-500 px-5 py-2 rounded-md"
                >
                  {" "}
                  <RiResetLeftFill className="group-hover:-rotate-360" /> Reset
                  Measurement
                </button>
              </div>

              {formData.measurements.length > 0 ? (
                formData.measurements.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 items-center border border-gray-200 rounded-lg p-4 relative"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-900">
                        Name
                      </label>
                      <input
                        type="text"
                        name="measurementName"
                        placeholder="Ex: Length, Width, Height"
                        value={item.measurementName}
                        onChange={(e) => handleMeasurementChange(e, index)}
                        className="w-full border border-gray-300 bg-purple-50/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-900">
                        Value
                      </label>
                      <input
                        type="text"
                        name="measurementValue"
                        placeholder="Ex: 200cm, 15kg"
                        value={item.measurementValue}
                        onChange={(e) => handleMeasurementChange(e, index)}
                        className="w-full border border-gray-300 bg-purple-50/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMeasurement(index)}
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-center w-full">
                  {" "}
                  <button
                    type="button"
                    onClick={handleAddMeasurement}
                    className="text-orange-400 hover:text-orange-500"
                  >
                    Tap to add measurement{" "}
                  </button>{" "}
                  to add measurement on it
                </p>
              )}

              <button
                type="button"
                onClick={handleAddMeasurement}
                className="flex items-center justify-end group gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                <FaPlus className="group-hover:rotate-90" /> Add Measurement
              </button>
            </div>
          </div>
          <div className="bg-white shadow-[0_0_12px_#00000008] p-5 rounded-xl w-full grid grid-cols-2 gap-5 col-span-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="metaTitle"
                className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
              >
                Meta Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                placeholder="Meta Title"
                value={formData.seo.metaTitle}
                onChange={handleSeoChange}
                className="w-full border border-gray-300 bg-purple-50/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="metaDescription"
                className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
              >
                Meta Description
              </label>
              <input
                type="text"
                id="metaDescription"
                name="metaDescription"
                placeholder="Meta Title"
                value={formData.seo.metaDescription}
                onChange={handleSeoChange}
                className="w-full border border-gray-300 bg-purple-50/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="keywords"
                className="flex gap-1 mb-1 text-sm font-medium text-gray-900"
              >
                Meta Keywords (comma separated)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                placeholder="Enter keywords"
                value={formData?.seo?.keywords?.join(", ")}
                onChange={handleSeoChange}
                className="w-full border border-gray-300 bg-purple-50/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <p className="text-red-500">{errMessage}</p>
        </div>
        <div className="flex justify-end items-center gap-2">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-orange-400 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-orange-500 disabled:bg-orange-300 transition flex items-center gap-2"
          >
            {isLoading ? "Updating..." : "Update"}{" "}
            <AiOutlineCloudUpload className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
