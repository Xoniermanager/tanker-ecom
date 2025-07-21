import React, {useState} from 'react'
import { FaEye } from "react-icons/fa";
import { MdDeleteOutline , MdOutlineEdit } from "react-icons/md";
import DeletePopup from '../common/DeletePopup';
import api from '../../user/common/api';

const CategoryList = ({categoryData, }) => {
    const [showPopup, setShowPopup] = useState(true);
    
    const [deleteCat, setDeleteCat] = useState({id:null, name:null})
    const [errMessage, setErrMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const data = [
        {
            _id: 1,
           categoryName: "category one",
           description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga consectetur eius non, recusandae incidunt excepturi sit minus assumenda dolore velit eos nisi? Blanditiis?",
           status: true
        },
        {
            _id: 2,
           categoryName: "category two",
           description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga consectetur eius non, recusandae incidunt excepturi sit minus assumenda dolore velit eos nisi? Blanditiis?",
           status: false
        },
        {
            _id: 3,
           categoryName: "category three",
           description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga consectetur eius non, recusandae incidunt excepturi sit minus assumenda dolore velit eos nisi? Blanditiis?",
           status: true
        },
    ]

     const handleDelete = async(id)=>{
        setIsLoading(true)
        try {
            if(!id) return setErrMessage("Category id not found")
            // const response = await api.delete(`/api/delete/${id}`,{withCredentials: true})
            alert("dleted")
            setShowPopup(false)

        } catch (error) {
            console.error(error)
        }
        finally{
            setIsLoading(false)
        }

    }


    const handleDeleteCategory = (ids, name)=>{
        setShowPopup(true);
        setDeleteCat({id:ids, name: name})

    }
  return (
    <>
    {showPopup && <DeletePopup onCancel={()=>setShowPopup(false)} onDelete={()=>handleDelete(deleteCat?.id)} message={`Are your sure to delete ${deleteCat.name} category?`} isLoading={isLoading} errMessage={errMessage}/>}

    
    <div className="w-full p-12 bg-white rounded-xl shadow-[0_0_15px_#00000015] flex flex-col gap-10">
         <h2 className="text-2xl font-semibold  text-gray-800 capitalize">
          Category list
        </h2>
        <table className='min-w-full table-auto text-sm text-left border-separate border-spacing-y-4'>
            <thead className=' bg-stone-100 uppercase text-xs rounded-xl overflow-hidden' >
                <tr className=''>
                   <th className='px-6 py-4 font-medium text-nowrap'>Category Name</th>
                   <th className='px-6 py-4 font-medium'>Category Description</th>
                   <th className='px-6 py-4 font-medium'>Status</th>
                   <th className='px-6 py-4 font-medium'> Action </th>
                </tr>
            </thead>
             <tbody className="text-gray-800">
                        {data?.map((item, index) => (
                          <tr key={index} className="bg-violet-50 rounded-xl overflow-hidden shadow">
                            
                            <td className="px-6 py-6 text-red-500 font-semibold capitalize w-fit text-nowrap">{item?.categoryName || "N/A"}</td>
                            <td className="px-6 py-6">{item?.description || "N/A"}</td>
                            <td className="px-6 py-6"> <span className={`${item?.status ? "text-green-500" : "text-red-500"} px-4 py-2 bg-white rounded-md font-medium tracking-wide`}>{(item?.status ? "True"  : "False") || "N/A"}</span></td>
                            
                          
                            <td className="px-6 py-6 text-xl text-gray-500 flex items-center gap-2">
                              <button className='flex items-center justify-center h-8 w-8 rounded-lg text-white bg-orange-400 hover:bg-orange-500'><FaEye /></button>
                              <button className='flex items-center justify-center h-8 w-8 rounded-lg text-white bg-green-400 hover:bg-green-500'><MdOutlineEdit /></button>
                              <button className='flex items-center justify-center h-8 w-8 rounded-lg text-white bg-red-400 hover:bg-red-500' onClick={()=>handleDeleteCategory(item._id, item.categoryName)}> <MdDeleteOutline /> </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>

        </table>
      
    </div>
    </>
  )
}

export default CategoryList
