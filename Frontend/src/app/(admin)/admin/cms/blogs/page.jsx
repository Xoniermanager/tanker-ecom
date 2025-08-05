"use client";
import React, { useState, useEffect } from "react";
import BlogManagement from "../../../../../../components/admin/cms/blog/BlogManagement";
import api from "../../../../../../components/user/common/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import BlogView from "../../../../../../components/admin/cms/blog/BlogView";

const Page = () => {
  const [blogData, setBlogData] = useState(null)
  const [pageLimit, setPageLimit] = useState(null)
  const [activePage, setActivePage] = useState(null)
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
      title: "",
      description: "",
      keywords: [],
      blogImage: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const getBlogData = async()=>{
    try {
        const accessToken = Cookies.get("accessToken")
        const response = await api.get(`/blogs`, {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }) 
        if (response.status === 200){
            setBlogData(response.data.data)
            setActivePage(response.data.data.page)
            setPageLimit(response.data.data.limit)
        }
    } catch (error) {
        console.error(error)
    }
  }


  // api get calls

  useEffect(() => {
    getBlogData()
  }, [])
  

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
          previewUrl: imageUrl
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
      const accessToken = Cookies.get("accessToken")
    
      const newFormData = new FormData();
      newFormData.append("file", formData.thumbnail.source);
      const upload = await api.put("/upload-files", newFormData, { headers:{
        Authorization: `Bearer ${accessToken}`
      }});
      
  

      const payload = ({
        ...formData,
        isPublished: true,
        thumbnail: {
          ...formData.thumbnail,
          source: upload.data.data.url,
        },
      });
    

      const response = await api.post(`/blogs`, payload, {headers: {
        Authorization:`Bearer ${accessToken}`
      }});
      if (response.status === 201 || response.status === 200) {
        toast.success("Data updated successfully");
        setErrMessage(null);
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
            title: "",
            description: "",
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
      />
      <BlogView blogData={blogData}/>
    </div>
  );
};

export default Page;
