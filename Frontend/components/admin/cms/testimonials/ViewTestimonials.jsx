import React from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import DeletePopup from '../../common/DeletePopup';
import { MdOutlineCloudUpload } from "react-icons/md";

const ViewTestimonials = ({testimonialData, handleDelete, isLoading, errMessage, deletePopupShow , setDeletePopupShow, handleSetDelete, editPopupShow, setEditPopupShow, handleUpdateSubmit, updateFormData, handleUpdateChange, handleEdit, handleToggleStatus }) => {
 
  return (
    <>
   {deletePopupShow && <DeletePopup message={"Are you sure to delete this testimonial"} isLoading={isLoading} onDelete={handleDelete} onCancel={()=>setDeletePopupShow(false)} errMessage={errMessage} />}

    {editPopupShow && (
        <>
        <div className='w-full backdrop-blur-md fixed top-0 left-0 right-0 bottom-0 z-150 h-full' onClick={()=>setEditPopupShow(false)}></div>
        <div className='bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8  z-200 shadow-[0_0_18px_#00000020] w-1/2 rounded-lg flex flex-col gap-5 ' >
        <h2 className='text-2xl font-semibold text-purple-900'>Edit Testimonial</h2>
         <form
                onSubmit={handleUpdateSubmit}
                className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
              >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name">Name </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={updateFormData.name}
                      onChange={handleUpdateChange}
                      className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="designation">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      placeholder="Designation"
                      value={updateFormData.designation}
                      onChange={handleUpdateChange}
                      className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
                    />
                  </div>
                   <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="message">Message</label>
                  <textarea
                    name="message"
                    placeholder="Type your message..."
                    value={updateFormData.message}
                    onChange={handleUpdateChange}
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
                            disabled={ isLoading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
                          >
                            {isLoading ? "Updating..." : "Update"} <MdOutlineCloudUpload />
                          </button>
                        </div>
              </form>
        </div>
        </>
    )}


    <div className=' w-full '>
        <h2 className='font-semibold text-2xl text-purple-900 mb-5'>All testimonials</h2>
         <div className='grid grid-cols-2 gap-6 w-full '>

         
      {testimonialData?.map((item,i)=>{

        return (
            <div className='w-full bg-white p-6 rounded-xl flex flex-col gap-2.5 shadow-[0_0_10px_#00000008] hover:shadow-[0_0_14px_#00000018] ' key={i}>
              <p className='text-[#7b7b7b] font-light line-clamp-5 h-[150px] mb-5 p-4 bg-purple-50 rounded-lg'>{item.message}</p>

              <div className="flex flex-col gap-0.5">
                <h3 className='text-purple-900 text-xl font-semibold capitalize'>{item.name}</h3>
                <span className='text-sm text-orange-500 capitalize'>{item.designation}</span>
              </div>
              <div className="flex items-center justify-between mt-2 bg-purple-50 px-4 py-2 rounded-lg">
                <div className='flex items-center justify-between gap-1'>
                    Status: <span className={`${item.status === "active" ? "text-green-500" : "text-red-500"} capitalize`}>{item.status}</span>
                </div>
                <button
                    onClick={() => handleToggleStatus(item._id, item.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      (item.status === "active") ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        (item.status === "active") ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                                <button
                                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:underline flex items-center gap-1"
                                  onClick={()=>handleEdit(item._id)}
                                >
                                  <MdEdit className="text-lg" /> Edit
                                </button>

                                <button
                                   onClick={()=>handleSetDelete(item._id)}
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

export default ViewTestimonials
