import React from "react";

import { MdOutlineCloudUpload, MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import DeletePopup from "../../common/DeletePopup";

const CategoryManagement = ({
  blogFormData,
  handleCategoryChange,
  handleCategorySubmit,
  isLoading,
  errMessage,
  categoryData,
  showDeletePopup,
  setShowDeletePopup,
  handleCateDelete,
  ChooseCatDelete,
  updatedBlogData,
  handleUpdateCategoryChange,
  showEditPopup,
  setShowEditPopup,
  handleCategoryUpdate,
  handleEdit
}) => {
  return (
    <>
      {showDeletePopup && <DeletePopup onDelete={handleCateDelete} onCancel={()=>setShowDeletePopup(false)} message={"Are you sure to delete this category?"} isLoading={isLoading} errMessage={errMessage}/>}


     {showEditPopup && <> 
     <div className='w-full backdrop-blur-md fixed top-0 left-0 right-0 bottom-0 z-150 h-full' onClick={()=>setShowEditPopup(false)}></div>
     <div className='bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-6 px-8 z-200 shadow-[0_0_18px_#00000020] w-2/4 rounded-lg flex flex-col gap-5'>
        <h2 className="font-semibold text-xl  capitalize"> Edit your category </h2>
        <form
          onSubmit={handleCategoryUpdate}
          className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Category Name </label>
              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={updatedBlogData.name}
                onChange={handleUpdateCategoryChange}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="slug">Category Slug </label>
              <input
                type="text"
                name="slug"
                placeholder="Ex: tanker_solution"
                value={updatedBlogData.slug}
                onChange={handleUpdateCategoryChange}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label htmlFor="description">Category Description </label>
              <textarea
                placeholder="Description"
                name="description"
                value={updatedBlogData.description}
                onChange={handleUpdateCategoryChange}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end">
            {errMessage && (
              <p className="text-sm text-red-600 font-medium">{errMessage}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
            >
              {isLoading ? "Update..." : "Update"} <MdOutlineCloudUpload />
            </button>
          </div>
        </form>

     </div> </> }



      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-xl mb-4">Manage Categories</h3>
        <form
          onSubmit={handleCategorySubmit}
          className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Category Name </label>
              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={blogFormData.name}
                onChange={handleCategoryChange}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="slug">Category Slug </label>
              <input
                type="text"
                name="slug"
                placeholder="Ex: tanker_solution"
                value={blogFormData.slug}
                onChange={handleCategoryChange}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label htmlFor="description">Category Description </label>
              <textarea
                placeholder="Description"
                name="description"
                value={blogFormData.description}
                onChange={handleCategoryChange}
                className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end">
            {errMessage && (
              <p className="text-sm text-red-600 font-medium">{errMessage}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
            >
              {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
            </button>
          </div>
        </form>
      </div>
      <div className="p-6 rounded-xl shadow-[0_0_14px_#00000015] w-full bg-white mt-6">
        <table className="border border-gray-200 w-full rounded-xl ">
          <thead>
            <tr className="w-full border-b-1 border-gray-200 bg-purple-50">
              <th className="p-4 text-start">S.No.</th>
              <th className="p-4 text-start border-l-1 border-stone-200">
                Category Name
              </th>
              <th className="p-4 text-start border-l-1 border-stone-200">
                Category Slug
              </th>
              <th className="p-4 text-start border-l-1 border-stone-200">
                Description
              </th>
              <th className="p-4 text-start border-l-1 border-stone-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categoryData?.length > 0 ? categoryData?.map((item, index) => (
              <tr key={index} className="w-full border-b-1 border-stone-200">
                <td className="p-4">{index + 1}</td>
                <td className="p-4 text-start border-l-1 border-stone-200">
                  <span className="capitalize bg-orange-500 px-4 py-1.5 rounded-lg text-sm text-white font-medium">{item.name}</span>
                </td>
                <td className="p-4 text-start border-l-1 border-stone-200">
                  <span className="bg-purple-100 text-sm font-medium text-purple-900 px-4 py-1.5 rounded-lg">{item.slug}</span>
                </td>
                <td className="p-4 text-start border-l-1 border-stone-200">
                  <p className="first-letter:capitalize">{item.description}</p>
                </td>
                <td className="p-4 text-start border-l-1 border-stone-200">
                  <div className="flex items-center gap-3">
                    <button className="bg-green-500 hover:bg-green-600 h-9 w-9 rounded-md flex items-center justify-center text-white" onClick={()=>handleEdit(item._id)}>
                      <MdEdit className="text-lg"/>
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 h-9 w-9 rounded-md flex items-center justify-center text-white" onClick={()=>ChooseCatDelete(item._id, item.name)}>
                      <MdDeleteOutline className="text-xl"/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td className="p-4 text-center" colSpan={5}>Data not found</td>
                </tr>
            )
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CategoryManagement;
