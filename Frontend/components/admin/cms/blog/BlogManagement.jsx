import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { MdOutlineCloudUpload } from "react-icons/md";
import dynamic from 'next/dynamic';
import parse from 'html-react-parser';
import { FaEye } from "react-icons/fa";

const BlogEditor = dynamic(() => import('./BlogEditor'), { ssr: false });


const BlogManagement = ({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  errMessage,
  removeTag,
  handleTagKeyDown,
  addTag,
  tagInput,
  setTagInput,
}) => {

  console.log("formdata: ", formData)
  return (
    <>
    <div className="bg-white p-7 rounded-lg flex flex-col gap-5">
      <h2 className="font-semibold text-2xl">Blog Management</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Blog title"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subtitle">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              placeholder="Blog subtitle"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.subtitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2 col-span-1">
            <label htmlFor="tags">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. react"
                className="flex-1 border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
               
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-violet-200 text-violet-800 rounded-full text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(index)}>
                      <FiX className="text-sm hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 col-span-1">
            <label htmlFor="categories">Categories</label>
            <select
              name="categories"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.categories.join(", ")}
              onChange={handleChange}
              required
            >
              <option value="" hidden>
                Select your blog categories
              </option>
              <option value="cat1">cat1</option>
              <option value="cat2">cat2</option>
              <option value="cat3">cat3</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="thumbnail">Thumbnail Image URL</label>
            <input
              type="file"
              name="thumbnail"
              placeholder="Image"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              onChange={handleChange}
              required
            />
            {formData.thumbnail.source && (
              <img
                src={formData.previewUrl}
                alt="Thumbnail Preview"
                className="w-40 h-24 rounded-md object-cover border border-gray-300 mt-2"
              />
            )}
          </div>
        </div>

        

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="seo.title">SEO Title</label>
            <input
              type="text"
              name="seo.title"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.seo.title}
              onChange={handleChange}
              placeholder="SEO Title"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="seo.description">SEO Description</label>
            <input
              type="text"
              name="seo.description"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData.seo.description}
              onChange={handleChange}
              placeholder="SEO Description"
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor="seo.keywords">SEO Keywords (comma separated)</label>
            <input
              type="text"
              name="seo.keywords"
              className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
              value={formData?.seo?.keywords?.join(", ")}
              onChange={handleChange}
              placeholder="SEO Keywords"
            />
          </div>
          
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content">Blog Content</label>
          <BlogEditor
  onChange={(html) => handleChange({ target: { name: 'content', value: html } })}
/>
          {/* <textarea
            name="content"
            rows={6}
            placeholder="Write the blog content here..."
            className="border border-gray-300 bg-white rounded-md px-5 py-3 outline-none"
            value={formData.content}
            onChange={handleChange}
            required
          /> */}
        </div>

        {errMessage && (
          <div className="col-span-2 flex justify-end">
            <p className="text-red-600 text-sm font-medium">{errMessage}</p>
          </div>
        )}

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={
              formData.title === "" ||
              formData.subtitle === "" ||
              formData.thumbnail.source === "" ||
              formData.tags.length === 0 ||
              formData.categories.length === 0 ||
              formData.content === "" || isLoading
              
            }
            className="px-8 py-2.5 rounded-lg disabled:bg-purple-300 bg-purple-900 flex items-center gap-2 hover:bg-purple-950 font-medium text-white"
          >
            {isLoading ? "Updating..." : "Update"}{" "}
            <MdOutlineCloudUpload className="text-xl" />
          </button>
        </div>
      </form>
    </div>

    {formData.content && <div className="bg-white p-7 rounded-lg flex flex-col gap-6">
      <h2 className="font-semibold text-2xl text-purple-950 flex items-center gap-2"> <FaEye className="text-purple-500 text-lg"/> Preview</h2>

     <span className=" blog-contents list-disc">{parse(formData.content)}</span> 
      

    </div> }
    </>
  );
};

export default BlogManagement;
