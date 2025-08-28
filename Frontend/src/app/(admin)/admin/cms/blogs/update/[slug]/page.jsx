"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../../../../../../../components/user/common/api";
import BlogUpdateComponent from "../../../../../../../../components/admin/cms/blog/BlogUpdateComponent";
import { toast } from "react-toastify";

const page = () => {
  const [blogData, setBlogData] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    previewUrl: "",
    slug: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  const { slug } = useParams();

  const getBlogData = async () => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      if (response.status === 200) {
        const blog = response.data.data;
        setBlogData(blog);
        setFormData({
          title: blog.title || "",
          subtitle: blog.subtitle || "",
          previewUrl: blog.thumbnail.fullPath || "",
          slug: blog.slug || "",
          thumbnail: {
            source: "",
            type: "image",
          },
          tags: blog.tags || [],
          categories: [blog?.categories[0]._id] || [],
          content: blog.content || "",
          seo: {
            metaTitle: blog.seo.metaTitle || "",
            metaDescription: blog.seo.metaDescription || "",
            keywords: blog.seo.keywords || [],
          },
        });
      }
    } catch (error) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        console.error(error);
      }
    }
  };

  const getCategoryData = async () => {
    try {
      const response = await api.get("/blog-categories");
      if (response.status === 200) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBlogData();
    getCategoryData();
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
      let payload = { ...formData };
      if (formData.thumbnail.source instanceof File) {
        const newFormData = new FormData();
        newFormData.append("file", formData.thumbnail.source);
        const upload = await api.put("/upload-files", newFormData);

        if (upload && upload.data?.data?.file?.url) {
          payload.thumbnail = {
            ...formData.thumbnail,
            source: upload.data.data.file.url,
          };
        }
      } else {
        delete payload.thumbnail;
      }

      const response = await api.put(`/blogs/${blogData._id}`, payload);
      if (response.status === 200) {
        toast.success("Data updated successfully");
        setErrMessage(null);
        getBlogData();
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

  return (
    <div className="pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6">
      <BlogUpdateComponent
        formData={formData}
        handleChange={handleChange}
        isLoading={isLoading}
        errMessage={errMessage}
        handleSubmit={handleSubmit}
        addTag={addTag}
        removeTag={removeTag}
        handleTagKeyDown={handleTagKeyDown}
        tagInput={tagInput}
        setTagInput={setTagInput}
        categoryData={categoryData ? categoryData : null}
      />
    </div>
  );
};

export default page;
