'use client'
import React, { useState, useEffect, useRef } from 'react'
import api from '../../user/common/api'
import DeletePopup from '../common/DeletePopup'

const customers = [
  {
    _id: 1,
    invoice: "INV-3145",
    name: 'Arlan Pond',
    total: 345,
    country: 'Brazil',
    date: '1/11/2021',
    status: 'Active',
  },
  {
    _id: 2,
     invoice: "INV-3145",
    name: 'Billi Cicero',
   total: 345,
    country: 'Indonesia',
    date: '11/20/2020',
    status: 'Passive',
  },
  {
    _id: 3,
     invoice: "INV-3145",
    name: 'Thorpe Hawksley',
    total: 345,
    country: 'France',
    date: '10/20/2020',
    status: 'Active',
  },
  {
    _id: 4,
     invoice: "INV-3145",
    name: 'Horacio Versey',
   total: 345,
    country: 'China',
    date: '1/15/2021',
    status: 'Active',
  },
  {
    _id: 5,
     invoice: "INV-3145",
    name: 'Raphael Dampney',
   total: 345,
    country: 'Portugal',
    date: '9/17/2020',
    status: 'Passive',
  },
  {
    _id: 6,
     invoice: "INV-3145",
    name: 'Raphael Dampney',
    total: 345,
    country: 'Portugal',
    date: '9/17/2020',
    status: 'Passive',
  },
  {
    _id: 7,
     invoice: "INV-3145",
    name: 'Raphael Dampney',
    total: 345,
    country: 'Portugal',
    date: '9/17/2020',
    status: 'Passive',
  },
  {
    _id: 8,
     invoice: "INV-3145",
    name: 'Raphael Dampney',
    total: 345,
    country: 'Portugal',
    date: '9/17/2020',
    status: 'Passive',
  },
  {
    _id: 9,
     invoice: "INV-3145",
    name: 'Raphael Dampney',
    total: 345,
    country: 'Portugal',
    date: '9/17/2020',
    status: 'Passive',
  },
  {
    _id: 10,
     invoice: "INV-3145",
    name: 'Raphael Dampney',
    total: 345,
    country: 'Portugal',
    date: '9/17/2020',
    status: 'Passive',
  },
]

const InvoiceTable = () => {
    const [customerData, setCustomerData] = useState(null)
    const [customerForDelete, setCustomerForDelete] = useState(null)
    const [deleteCustomerName, setDeleteCustomerName] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errMessage, setErrMessage] = useState(null)
    const [deletePopup, setDeletePopup] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const menuRef = useRef()

  

  

  const handleDelete = async(id)=>{
    setIsLoading(true)
    if(!id) return setErrMessage(' Customer id not found')
    try {
        // const response = await api.delete(`/user/delete/${id}`, {withCredentials: true})
        alert("jai sri ram")
        setDeletePopup(false)
    } catch (error) {
        console.error(error)
    }
    finally{
        setIsLoading(false)
    }
  }


  const handleCustomerDelete = (id, name)=>{
    setDeletePopup(true)
    setCustomerForDelete(id)
    setDeleteCustomerName(name)
    setMenuOpen(null)
  }
  

  return (
    <>
    {deletePopup && <DeletePopup message={`Are you sure to delete ${deleteCustomerName}`} onCancel={()=>setDeletePopup(false)} isLoading={isLoading} errMessage={errMessage} onDelete={()=>handleDelete(customerForDelete)}/>}
    <div className="min-h-screen">

      <div className="flex bg-white p-4 rounded-xl justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-slate-300 rounded-lg">
            <option>Sort by</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg">
            <option>10</option>
            <option>20</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border border-slate-300 rounded-lg"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
          </div>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-sm">
          Actions
        </button>
      </div>

      <table className="w-full rounded-xl">
        <thead className="text-gray-700 text-[12px] uppercase">
          <tr className="text-left">
            <th className="p-4"><input type="checkbox" /></th>
            <th className="p-4 uppercase">Invoice</th>
            <th className="p-4 uppercase">Customer</th>
            <th className="p-4 uppercase">Total</th>
            <th className="p-4 uppercase">Status</th>
            <th className="p-4 uppercase">date</th>
            
            <th className="p-4">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-transparent">
          {customers.map((customer) => (
            <tr
              key={customer._id}
              className="bg-white hover:bg-gray-50 transition-all rounded-xl shadow-sm my-2"
            >
              <td className="p-4"><input type="checkbox" /></td>
              <td className="p-4 text-red-500 font-semibold">{customer.invoice}</td>
              
              <td className="p-4 flex items-center gap-2"><div
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white font-bold text-lg"
                  
                >
                  {customer.name.charAt(0)}
                </div>{customer.name}</td>
              <td className="p-4 font-medium">${customer.total}</td>
              
             
              <td className="p-4">
                <span
                  className={`text-white text-xs font-bold py-1 px-3 rounded-full ${
                    customer.status === 'Active' ? 'bg-purple-600' : 'bg-red-500'
                  }`}
                >
                  {customer.status}
                </span>
              </td>
              <td className="p-4"> {customer.date} </td>
              <td className="p-4 relative border-none" ref={menuRef}>
                <span
                  className="cursor-pointer text-xl"
                  onClick={() => setMenuOpen(menuOpen === customer._id ? null : customer._id)}
                >
                  ⋯
                </span>
                {menuOpen === customer._id && (
                  <div className="absolute z-10 right-2 mt-2 w-32 bg-white shadow-[0_0_15px_#00000020] rounded-lg  py-2 text-sm">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Show</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Send</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Download</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={()=>handleCustomerDelete(customer._id, customer.name)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}


export default InvoiceTable
