"use client";
import React, { useState, useEffect } from "react";
import BlogManagement from "../../../../../../components/admin/cms/blog/BlogManagement";
import api from "../../../../../../components/user/common/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import BlogView from "../../../../../../components/admin/cms/blog/BlogView";
import CategoryManagement from "../../../../../../components/admin/cms/blog/CategoryManagement";

const Page = () => {
  const [blogData, setBlogData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  const [active, setActive] = useState(1);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [updatedBlogId, setUpdatedBlogId] = useState(null);
  const [deletedBlogId, setDeletedBlogId] = useState(null)
  const [deletedBlogData, setDeletedBlogData] = useState({
    id: "",
    name: "",
  });
  const [updatedBlogData, setUpdatedBlogData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [pageLimit, setPageLimit] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    previewUrl: "",
    thumbnail: {
      source: "",
      type: "image",
    },
    tags: [],
    categories: [],
    content: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      blogImage: "",
    },
  });
  const [blogFormData, setBlogFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const getBlogData = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await api.get(`/blogs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setBlogData(response.data.data.data);
        setActivePage(response.data.data.page);
        setPageLimit(response.data.data.limit);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProductData = async () => {
    try {
      const response = await api.get("/blog-categories");
      if (response.status === 200) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleActive = (e) => {
    setActive(e);
  };

  // api get calls

  useEffect(() => {
    getBlogData();
    getProductData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.startsWith("seo.")) {
      const key = name.split(".")[1];

      if (key === "keywords") {
        const keywordsArray = value.split(",").map((kw) => kw.trim());
        setFormData((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            keywords: keywordsArray,
          },
        }));
      } else if (files && files[0]) {
        const file = files[0];
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            [key]: imageUrl,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            [key]: value,
          },
        }));
      }
    } else if (name === "thumbnail") {
      if (files && files[0]) {
        const file = files[0];
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          thumbnail: {
            ...prev.thumbnail,
            source: file,
          },
          previewUrl: imageUrl,
        }));
      }
    } else if (name === "tags" || name === "categories") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((v) => v.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      let newValue = value.replace(" ", "_");
      setBlogFormData({ ...blogFormData, [name]: newValue });
    } else {
      setBlogFormData({ ...blogFormData, [name]: value });
    }
  };
  const handleUpdateCategoryChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      let newValue = value.replace(" ", "_");
      setUpdatedBlogData({ ...updatedBlogData, [name]: newValue });
    } else {
      setUpdatedBlogData({ ...updatedBlogData, [name]: value });
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      handleChange({
        target: {
          name: "tags",
          value: [...formData.tags, newTag].join(", "),
        },
      });
    }
    setTagInput("");
  };

  const removeTag = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    handleChange({
      target: {
        name: "tags",
        value: updatedTags.join(", "),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);

    try {
      const accessToken = Cookies.get("accessToken");

      const newFormData = new FormData();
      newFormData.append("file", formData.thumbnail.source);
      const upload = await api.put("/upload-files", newFormData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = {
        ...formData,
        isPublished: true,
        thumbnail: {
          ...formData.thumbnail,
          source: upload.data.data.file.url,
        },
      };

      const response = await api.post(`/blogs`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        toast.success("Data updated successfully");
        setErrMessage(null);
        getBlogData()
        setFormData({
          title: "",
          subtitle: "",
          previewUrl: "",
          thumbnail: {
            source: "",
            type: "image",
          },
          tags: [],
          categories: [],
          content: "",
          seo: {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
            blogImage: "",
          },
        });
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

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
    try {
      const response = await api.post(`/blog-categories`, blogFormData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Category created successfully");
        getProductData();
        setBlogFormData({
          name: "",
          slug: "",
          description: "",
        });
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

  const handleEdit = (id) => {
    let data = categoryData.find((item) => item._id === id);
    setUpdatedBlogData(data);
    setShowEditPopup(true);
    setUpdatedBlogId(id);
  };

  const handleCategoryUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMessage(null);
    try {
      const response = await api.put(
        `/blog-categories/${updatedBlogId}`,
        updatedBlogData
      );
      if (response.status === 200) {
        toast.success("Category updated successfully");
        getProductData();
        setUpdatedBlogData({
          name: "",
          slug: "",
          description: "",
        });
        setShowEditPopup(false);
        setUpdatedBlogId(null);
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

  const ChooseCatDelete = (id, name) => {
    setShowDeletePopup(true);
    setDeletedBlogData({
      id,
      name,
    });
  };

  const handleCateDelete = async () => {
    setIsLoading(true);
    setErrMessage(null);
    try {
      if (!deletedBlogData.id) return setErrMessage("Blog id not found");
      const response = await api.delete(
        `/blog-categories/${deletedBlogData.id}`
      );
      if (response.status === 200) {
        toast.success("Category Deleted Successfully");

        setDeletedBlogData({
          id: "",
          name: "",
        });
        setShowDeletePopup(false);
        getProductData();
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

  const handleSetBlogDelete = (id) =>{
       setDeletedBlogId(id)
       setShowDeletePopup(true)
  }

  const handleBlogDelete = async () => {
    setIsLoading(true);
    setErrMessage(null);
    try {
      if(!deletedBlogId) return setErrMessage('Deleted blog id not found')
      const response = await api.delete(`/blogs/${deletedBlogId}`)
      if(response.status === 200){
        toast.success('Blog Deleted successfully')
        setDeletedBlogId(null)
        getBlogData()
        setShowDeletePopup(false)
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

  const handleToggleBlogStatus = async(id, publish)=>{
    try {
      const response = await api.patch(`/blogs/${id}/publish`, {publish})
      if(response.status === 200){
         toast.success(`blog status changed to ${publish ? "Inactive" : "Active"} successfully`)
         getBlogData()
      }
    } catch (error) {
      const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
      
      toast.error(message)
    }
  }

  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6 h-[100vh]">
      <ul className="p-4 bg-white rounded-xl flex items-center justify-start gap-4 shadow-[0_0_15px_#00000020]">
        <li>
          <button
            className={`${
              active === 1 ? "border-orange-500" : "border-transparent"
            } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
            onClick={() => handleActive(1)}
          >
            Manage Categories
          </button>
        </li>
        <li>
          <button
            className={`${
              active === 2 ? "border-orange-500" : "border-transparent"
            } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
            onClick={() => handleActive(2)}
          >
            Create Blog
          </button>
        </li>
        <li>
          <button
            className={`${
              active === 3 ? "border-orange-500" : "border-transparent"
            } px-8 py-2 bg-yellow-400/20 border-2  rounded-lg text-orange-500 font-semibold`}
            onClick={() => handleActive(3)}
          >
            Manage Blogs
          </button>
        </li>
      </ul>
      <div className="">
        {active === 1 && (
          <CategoryManagement
            blogFormData={blogFormData}
            handleCategoryChange={handleCategoryChange}
            handleCategorySubmit={handleCategorySubmit}
            isLoading={isLoading}
            errMessage={errMessage}
            categoryData={categoryData}
            showDeletePopup={showDeletePopup}
            setShowDeletePopup={setShowDeletePopup}
            handleCateDelete={handleCateDelete}
            ChooseCatDelete={ChooseCatDelete}
            updatedBlogData={updatedBlogData}
            handleUpdateCategoryChange={handleUpdateCategoryChange}
            showEditPopup={showEditPopup}
            setShowEditPopup={setShowEditPopup}
            handleCategoryUpdate={handleCategoryUpdate}
            handleEdit={handleEdit}
          />
        )}
        {active === 2 && (
          <BlogManagement
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            errMessage={errMessage}
            removeTag={removeTag}
            handleTagKeyDown={handleTagKeyDown}
            addTag={addTag}
            tagInput={tagInput}
            setTagInput={setTagInput}
            categoryData={categoryData}
          />
        )}
        {active === 3 && (
          <BlogView
            blogData={blogData}
            showDeletePopup={showDeletePopup}
            setShowDeletePopup={setShowDeletePopup}
            isLoading={isLoading}
            handleBlogDelete={handleBlogDelete}
            handleSetBlogDelete={handleSetBlogDelete}
            handleToggleBlogStatus={handleToggleBlogStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
