import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Banner = ({ homeData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState(null)
  const [webOrigin, setWebOrigin] = useState(null)
  const [preview, setPreview] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    subHeading: "",
    thumbnail: {
      type: "",
      source: ""
    },
    description: "",
    buttonName: "",
    buttonLink: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target

  
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        thumbnail: {
          ...prev.thumbnail,
          type: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
    const validVideoTypes = ['video/mp4', 'video/webm']

    const isValid =
      validImageTypes.includes(file.type) || validVideoTypes.includes(file.type)

    if (!isValid) {
      setErrMessage("Only JPG, PNG, SVG, MP4, or WEBM files are allowed.")
      setFormData(prev => ({
        ...prev,
        thumbnail: { ...prev.thumbnail, source: "" }
      }))
      setPreview(null)
      return
    }

    setErrMessage(null)
    const fileURL = URL.createObjectURL(file)
    setPreview(fileURL)
   

    setFormData(prev => ({
      ...prev,
      thumbnail: {
        ...prev.thumbnail,
        source: file
      }
    }))
  }

  useEffect(() => {
    setFormData({
      title: homeData?.contents?.find(item => item.label === "Headline")?.text || "",
      subHeading: homeData?.contents?.find(item => item.label === "Tagline")?.text || "",
      description: homeData?.contents?.find(item => item.label === "Description")?.text || "",
      thumbnail: homeData?.thumbnail || { type: "", source: "" },
      buttonName: homeData?.contents?.find(item => item.label === "Call To Action")?.text || "",
      buttonLink: homeData?.contents?.find(item => item.label === "Call To Action")?.link || ""
    })
  }, [])

  useEffect(() => {
    setWebOrigin(window?.location?.origin || null)
  }, [formData.buttonLink])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
     
      console.log(formData)
    } catch (error) {
      console.error(error)
      const message =
        (Array.isArray(error?.response?.data?.errors) && error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong"
      setErrMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-white p-7 rounded-lg flex flex-col gap-5'>
      <h2 className='font-semibold text-2xl'>Home page Banner</h2>
      <form onSubmit={handleSubmit} className='bg-purple-50/50 p-6 flex flex-col gap-5 rounded-xl'>
        <div className="grid grid-cols-2 gap-5">
          
          <div className="flex flex-col gap-2">
            <label htmlFor='title'>Heading (H1)</label>
            <input type="text" name='title' className='border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3' placeholder='Heading (H1)' value={formData.title} onChange={handleChange} required />
          </div>

          
          <div className="flex flex-col gap-2">
            <label htmlFor='subHeading'>Sub Heading</label>
            <input type="text" name='subHeading' className='border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3' placeholder='Sub Heading' value={formData.subHeading} onChange={handleChange} required />
          </div>

          
          <div className="flex flex-col gap-2">
            <label htmlFor='buttonName'>Button Name</label>
            <input type="text" name='buttonName' className='border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3' placeholder='Button Name' value={formData.buttonName} onChange={handleChange} required />
          </div>

          
          <div className="flex flex-col gap-2 ">
            <label htmlFor='buttonLink'>Button Link</label>
            <input type="text" name='buttonLink' className='border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3' placeholder='Button Link' value={formData.buttonLink} onChange={handleChange} required />
            {webOrigin && <div className='flex items-center gap-2'>
              <span className='font-medium text-sm'>Preview:</span>
              <Link href={`${webOrigin}${formData.buttonLink}`} target='_blank' className='text-green-500'>{webOrigin}{formData.buttonLink}</Link>
            </div>}
          </div>

          
          <div className="flex flex-col gap-2 col-span-2">
            <label htmlFor='description'>Description</label>
            <textarea type="text" name='description' className='border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3' placeholder='Description' value={formData.description} onChange={handleChange} rows={5} required />
          </div>

         
          <div className="col-span-2 grid grid-cols-2 gap-2 p-5 bg-blue-50 rounded-xl">
           
            <div className="flex flex-col gap-2 ">
              <label htmlFor='type'>Thumbnail Type</label>
              <select name='type' className='border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3' value={formData.thumbnail.type} onChange={handleChange} required>
                <option hidden>Select Thumbnail Type</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            
            <div className="flex flex-col gap-2 ">
              <label htmlFor='thumbnailSource'>Thumbnail File Source</label>
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3" />
            </div>

            
            {preview && (
              <div className="col-span-2">
                <label className='font-medium text-sm'>Preview:</label>
                <div className='mt-2'>
                  {formData.thumbnail.type === "image" ? (
                    <img src={preview} alt="Preview" className='rounded-md w-full max-h-[250px] object-contain' />
                  ) : (
                    <video controls className='rounded-md w-full max-h-[250px] object-contain'>
                      <source src={preview} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

    
        {errMessage && <div className="col-span-2 flex justify-end">
          <p className='text-red-500'>{errMessage}</p>
        </div>}

      
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={
              !formData.title ||
              !formData.subHeading ||
              !formData.description ||
              !formData.buttonName ||
              !formData.buttonLink ||
              !formData.thumbnail.type ||
              !formData.thumbnail.source
            }
            className='px-8 py-2.5 rounded-lg disabled:bg-purple-300 bg-purple-900 hover:bg-purple-950 font-medium text-white '
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Banner
