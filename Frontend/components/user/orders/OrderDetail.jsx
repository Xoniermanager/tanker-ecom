import Image from 'next/image'
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaBox, FaShippingFast, FaTruck, FaCheck } from 'react-icons/fa'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import { IoIosArrowBack } from "react-icons/io";

const OrderDetail = ({ viewOrderData, onBack }) => {
  const [expandedProducts, setExpandedProducts] = useState({})
  

  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

   const router = useRouter();
 
  const orderStatuses = [
    { status: 'pending', label: 'Order Placed', icon: FaBox, description: 'Your order has been placed successfully' },
    { status: 'processing', label: 'Processing', icon: FaShippingFast, description: 'We are preparing your order' },
    { status: 'shipped', label: 'Shipped', icon: FaTruck, description: 'Your order is on its way' },
    { status: 'delivered', label: 'Delivered', icon: FaCheck, description: 'Order delivered successfully' }
  ]

  const getCurrentStatusIndex = () => {
    return orderStatuses.findIndex(s => s.status === viewOrderData?.orderStatus) || 0
  }

  return (
    <>
      
      <div className='w-full border-1 border-stone-200 p-8 rounded-xl flex flex-col gap-6'>
         
         <div className="flex items-center justify-between">
           <h2 className='text-2xl font-semibold text-purple-950'>Order Detail</h2>
          
             <button 
               onClick={onBack}
               className="px-6 py-2 bg-purple-100 text-purple-700 flex items-center gap-2 rounded-lg hover:bg-purple-950 hover:text-white transition-colors"
             >
             <IoIosArrowBack />  Back to Orders
             </button>
           
         </div>

         <div className="grid grid-cols-2 gap-5">
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm capitalize'>Order Number</label>
               <h4 className='font-medium text-purple-950'>{viewOrderData.orderNumber}</h4>
           </div>
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm capitalize'>Payment Method</label>
               <h4 className='font-medium text-purple-950 capitalize'>{viewOrderData.payment.method}</h4>
           </div>
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm capitalize'>Order Date</label>
               <h4 className='font-medium text-purple-950'>{new Date(viewOrderData.createdAt).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</h4>
           </div>
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm capitalize'>Shipping Address</label>
               <h4 className='font-medium text-purple-950'>{viewOrderData.address.shippingAddress.address}, {viewOrderData.address.shippingAddress.city}, {viewOrderData.address.shippingAddress.country} - {viewOrderData.address.shippingAddress.pincode}</h4>
           </div>
         </div>

        
         <div className="bg-gray-50 p-6 rounded-xl">
           <h3 className="text-lg font-semibold mb-6 text-purple-950">Order Tracking</h3>
           <div className="relative">
            
             <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
             <div 
               className="absolute left-6 top-8 w-0.5 bg-green-500 transition-all duration-500"
               style={{ height: `${(getCurrentStatusIndex() / (orderStatuses?.length - 1)) * 100}%` }}
             ></div>
             
             {orderStatuses.map((statusItem, index) => {
               const isCompleted = index <= getCurrentStatusIndex()
               const isCurrent = index === getCurrentStatusIndex()
               const StatusIcon = statusItem.icon
               
               return (
                 <div key={statusItem.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  
                   <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                     isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                   }`}>
                     <StatusIcon className="text-lg" />
                   </div>
                   
                  
                   <div className="flex-1 pt-1">
                     <div className="flex items-center gap-2">
                       <h4 className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                         {statusItem.label}
                       </h4>
                       {isCurrent && (
                         <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                           Current
                         </span>
                       )}
                     </div>
                     <p className="text-sm text-gray-600 mt-1">{statusItem.description}</p>
                     {isCompleted && (
                       <p className="text-xs text-gray-500 mt-1">
                         {new Date(viewOrderData.updatedAt).toLocaleDateString('en-US', { 
                           weekday: 'short', 
                           year: 'numeric', 
                           month: 'short', 
                           day: 'numeric' 
                         })}
                       </p>
                     )}
                   </div>
                 </div>
               )
             })}
           </div>
         </div>

         <h2 className='text-2xl font-semibold text-purple-950'>Products ({viewOrderData.totalQuantity} items)</h2>

         <div className="flex flex-col gap-5">
            {viewOrderData?.products?.map((item, index) => {
              const isExpanded = expandedProducts[item._id] || false
              
              return (
                <div key={item._id} className="flex w-full flex-col gap-4 bg-stone-50/90 rounded-lg p-6 border border-stone-100">
                   
                    <div 
                      className="flex items-center justify-between gap-4 cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors"
                      onClick={() => toggleProductExpansion(item._id)}
                    >
                         <div className='flex gap-4 items-center'> 
                           <Image 
                             src={item.product.images[0].source} 
                             height={60} 
                             width={60} 
                             className='h-16 w-16 object-cover rounded-lg border border-stone-200' 
                             alt={item.name}
                           /> 
                           <div className="flex flex-col gap-1">
                              <h3 className='text-purple-950 font-medium text-lg'>{item.name}</h3>
                              <div className="flex items-center gap-4">
                                <span className='text-sm text-gray-600'>Qty: {item.quantity}</span>
                                <span className='bg-orange-50 px-3 py-1 rounded-full text-orange-600 text-sm font-medium'>
                                  ${item.sellingPrice.toFixed(2)}
                                </span>
                              </div>
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           <span className="text-lg font-bold text-green-600">
                             ${(item.sellingPrice * item.quantity).toFixed(2)}
                           </span>
                           {isExpanded ? (
                             <FaChevronUp className="text-gray-500" />
                           ) : (
                             <FaChevronDown className="text-gray-500" />
                           )}
                         </div>
                    </div>

                   
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-stone-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm capitalize'>Category</label>
                                  <h4 className="font-medium text-purple-950">{item.product.category || 'N/A'}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm capitalize'>Brand</label>
                                  <h4 className="font-medium text-purple-950">{item.product.brand}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm capitalize'>Origin</label>
                                  <h4 className="font-medium text-purple-950">{item.product.origin}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm capitalize'>Regular Price</label>
                                  <h4 className="font-medium text-gray-600">${item.product.regularPrice.toFixed(2)}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm capitalize'>Selling Price</label>
                                  <h4 className='bg-green-50 px-3 py-2 rounded-lg text-green-600 w-fit tracking-wider text-sm font-medium'>
                                    ${item.product.sellingPrice.toFixed(2)}
                                  </h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm capitalize'>Status</label>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit capitalize ${
                                    item.product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {item.product.status}
                                  </span>
                              </div>
                            </div>

                           
                            {item.product.shortDescription && (
                              <div className="mt-4">
                                <label className='text-gray-500 text-sm capitalize block mb-2'>Description</label>
                                <p className="text-purple-950 bg-white p-3 rounded-lg border border-stone-200">
                                  {item.product.shortDescription}
                                </p>
                              </div>
                            )}

                           
                            {item.product.highlights && item.product.highlights.length > 0 && (
                              <div className="mt-4">
                                <label className='text-gray-500 text-sm capitalize block mb-2'>Highlights</label>
                                <ul className="bg-white p-3 rounded-lg border border-stone-200">
                                  {item.product.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-purple-950 text-sm flex items-center gap-2 mb-1 last:mb-0">
                                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                           
                            {item.product.images && item.product.images.length > 1 && (
                              <div className="mt-4">
                                <label className='text-gray-500 text-sm capitalize block mb-2'>Product Images</label>
                                <div className="flex gap-2 overflow-x-auto">
                                  {item.product.images.map((image, idx) => (
                                    <Image 
                                      key={image._id}
                                      src={image.source} 
                                      height={80} 
                                      width={80} 
                                      className='h-20 w-20 object-cover rounded-lg border border-stone-200 flex-shrink-0' 
                                      alt={`${item.name} ${idx + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
              )
            })}
         </div>

         
         <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-purple-950">Order Summary</h3>
             <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
               viewOrderData.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
               viewOrderData.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
               viewOrderData.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
               viewOrderData.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
               'bg-gray-100 text-gray-800'
             }`}>
               {viewOrderData.orderStatus}
             </span>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="flex justify-between">
               <span className="text-gray-600">Total Items:</span>
               <span className="font-medium text-purple-950">{viewOrderData.totalQuantity}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600">Payment Status:</span>
               <span className={`font-medium capitalize ${
                 viewOrderData.payment.status === 'pending' ? 'text-yellow-600' :
                 viewOrderData.payment.status === 'completed' ? 'text-green-600' :
                 'text-gray-600'
               }`}>
                 {viewOrderData.payment.status}
               </span>
             </div>
           </div>
           <div className="mt-4 pt-4 border-t border-purple-200">
             <div className="flex justify-between items-center">
               <span className="text-xl font-semibold text-purple-950">Total Amount:</span>
               <span className="text-2xl font-bold text-green-600">${viewOrderData.totalPrice.toFixed(2)}</span>
             </div>
           </div>
           {viewOrderData.orderNotes && (
             <div className="mt-4 pt-4 border-t border-purple-200">
               <span className="text-sm text-gray-600 block mb-1">Order Notes:</span>
               <p className="text-purple-950 italic">{viewOrderData.orderNotes}</p>
             </div>
           )}
         </div>
      </div>
    </>
  )
}

export default OrderDetail