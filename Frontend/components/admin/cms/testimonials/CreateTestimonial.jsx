
import React from 'react'
import { MdOutlineCloudUpload } from "react-icons/md";

const CreateTestimonial = ({handleSubmit, formData, setFormData, handleChange, errMessage, isLoading}) => {
    
  return (
     <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-xl mb-4">Create testimonial</h3>
      <form
        onSubmit={handleSubmit}
        className="bg-purple-50/50 p-6 rounded-xl flex flex-col gap-8"
      >
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              className="bg-white p-3 rounded-lg border border-gray-200 focus:outline-none"
            />
          </div>
           <div className="flex flex-col gap-2 col-span-2">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            placeholder="Type your message..."
            value={formData.message}
            onChange={handleChange}
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
                    disabled={formData.name === "" || formData.designation === "" || formData.message ==="" || isLoading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-2.5 font-medium rounded-lg flex items-center gap-2"
                  >
                    {isLoading ? "Submitting..." : "Submit"} <MdOutlineCloudUpload />
                  </button>
                </div>
      </form>
      
      
    </div>
  )
}

export default CreateTestimonial
