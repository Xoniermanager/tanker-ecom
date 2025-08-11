import Image from 'next/image'
import React from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import DeletePopup from '../../common/DeletePopup';

const BlogView = ({blogData, showDeletePopup, setShowDeletePopup, isLoading, errMessage, handleBlogDelete, handleSetBlogDelete, handleToggleBlogStatus}) => {
 
  return (
    <>
    {showDeletePopup && <DeletePopup message={"Are you sure to delete this testimonial"} isLoading={isLoading} onDelete={handleBlogDelete} onCancel={()=>setShowDeletePopup(false)} errMessage={errMessage} />}
   <div className="w-full  flex flex-col items-center justify-between my-4">
         
         <div className='grid grid-cols-3 gap-6 w-full '>
          {blogData?.map((item,i)=>{
                     const data = ""
                  return (
                      <div className='w-full bg-white p-6 rounded-xl flex flex-col gap-3 shadow-[0_0_10px_#00000008] hover:shadow-[0_0_14px_#00000018] ' key={i}>
                        <div>
                          <Image src={item?.thumbnail?.fullUrl} height={300} width={300} alt='tanker' className='w-full object-cover rounded-lg h-[200px]'/>
                        </div>
          
                        <div className="flex flex-col gap-0.5">
                          <h3 className='text-purple-900 text-xl font-semibold capitalize line-clamp-2'>{item.title}</h3>
                         
                        </div>
                        <div className="flex items-center justify-between mt-2 bg-purple-50 px-4 py-2 rounded-lg">
                          <div className='flex items-center justify-between gap-1'>
                              Status: <span className={`${item.isPublished === true ? "text-green-500" : "text-red-500"} capitalize`}>{item.isPublished ? "Active" : "Inactive"}</span>
                          </div>
                          <button
                              onClick={() => handleToggleBlogStatus(item._id, item.isPublished)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                                (item.isPublished === true) ? "bg-green-600" : "bg-gray-400"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                  (item.isPublished === true) ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                                          <button
                                            className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:underline flex items-center gap-1"
                                            // onClick={()=>handleEdit(item._id)}
                                          >
                                            <MdEdit className="text-lg" /> Edit
                                          </button>
          
                                          <button
                                             onClick={()=>handleSetBlogDelete(item._id)}
                                            className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:underline flex items-center gap-1"
                                          >
                                            <MdDeleteOutline className="text-lg" /> Delete
                                          </button>
                                        </div>
                      </div>
                  )
                })}
         </div>
      
    </div>
    </>
  )
}

export default BlogView
