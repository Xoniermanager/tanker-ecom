"use client";
import React, { useState, useEffect } from "react";

import { getPageData } from "../../../../../../components/admin/cms/common/getPageData";
import Address from "../../../../../../components/admin/cms/contact/Address";
import Contact from "../../../../../../components/admin/cms/contact/Contact";
import GalleryManagement from "../../../../../../components/admin/cms/gallery/GalleryManagement";

import GalleryView from "../../../../../../components/admin/cms/gallery/GalleryView";
import api from "../../../../../../components/user/common/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Page = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    alt: "",
    tags: [],
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const getGalleryData = async () => {
    try {
      const accessToken = Cookies.get("accessToken");

      const response = await api.get(
        `/gallery?page=${currentPage}&limit=${pageLimit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setGalleryData(response.data.data.data);
        console.log("sdf", response.data.data);
        setTotalPages(response.data.data.totalPages);
        setCurrentPage(Number(response.data.data.page));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePagesLimit = (e) => {
    setPageLimit(e.target.value);
    setCurrentPage(1)
  };

  useEffect(() => {
    getGalleryData();
  }, [pageLimit, currentPage]);

  const handleToggleStatus = async (id, status) => {
    try {
      const response = await api.patch(`/gallery/${id}/status`);

      if (response.status === 200) {
        toast.success("Status changed successfully");
        getGalleryData();
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      setErrMessage(message);
    }
  };

  const generateClientId = () =>
    `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const handleEditGallery = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const formDataUpload = new FormData();

      const cleanItems = [
        {
          clientId: String(updateFormData._id || generateClientId()).trim(),
          title: String(updateFormData.title || "").trim(),
          tags: Array.isArray(updateFormData.tags) ? updateFormData.tags : [],
          alt: String(updateFormData.alt || ""),
          image: null,
        },
      ];

      formDataUpload.append("items", JSON.stringify(cleanItems));

      if (updateFormData.imageFile instanceof File) {
        formDataUpload.append(
          `files[${updateFormData._id}]`,
          updateFormData.imageFile
        );
      }

      const response = await api.put(`/gallery`, formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Gallery updated successfully");
        setErrMessage(null);
        getGalleryData();
        setIsOpen(false);
        setImagePreview(null);
      }
    } catch (error) {
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

  const handleRemoveTag = (index, tagToRemove) => {
    const updatedItems = [...formData.items];
    updatedItems[index].tags = updatedItems[index].tags.filter(
      (tag) => tag !== tagToRemove
    );
    setFormData({ ...formData, items: updatedItems });
  };

  return (
    <>
      <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
        <GalleryManagement getGalleryData={getGalleryData} />
        <GalleryView
          galleryData={galleryData}
          setGalleryData={setGalleryData}
          setPageLimit={setPageLimit}
          handleToggleStatus={handleToggleStatus}
          handleEditGallery={handleEditGallery}
          handleChange={handleChange}
          updateFormData={updateFormData}
          setUpdateFormData={setUpdateFormData}
          errMessage={errMessage}
          setErrMessage={setErrMessage}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleRemoveTag={handleRemoveTag}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePagesLimit={handlePagesLimit}
        />
      </div>
    </>
  );
};

export default Page;
