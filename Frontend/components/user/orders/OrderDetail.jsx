import Image from 'next/image'
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaBox, FaShippingFast, FaTruck, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import { IoIosArrowBack } from "react-icons/io"
import { toast } from 'react-toastify'
import api from '../common/api'
import { ORDER_STATUS, PAYMENT_METHODS, PAYMENT_STATUS } from '../../../constants/enums'

const OrderDetail = ({ viewOrderData, onBack, onOrderCancel, getOrderData, setActive }) => {
  const [expandedProducts, setExpandedProducts] = useState({})
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  const router = useRouter()

  const orderStatuses = [
    { status: 'pending', label: 'Order Placed', icon: FaBox, description: 'Your order has been placed successfully' },
    { status: 'processing', label: 'Processing', icon: FaShippingFast, description: 'We are preparing your order' },
    { status: 'shipped', label: 'Shipped', icon: FaTruck, description: 'Your order is on its way' },
    { status: 'delivered', label: 'Delivered', icon: FaCheck, description: 'Order delivered successfully' },
    { status: 'cancelled', label: 'Cancelled', icon: FaTimes, description: 'Order has been cancelled' }
  ]

  const cancelReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'No longer needed',
    'Delivery taking too long',
    'Payment issues',
    'Other'
  ]

  const getCurrentStatusIndex = () => {
    return orderStatuses.findIndex(s => s.status === viewOrderData?.orderStatus) || 0
  }

  const canCancelOrder = () => {
    const cancellableStatuses = ['pending', 'processing']
    return cancellableStatuses.includes(viewOrderData?.orderStatus)
  }

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please select a reason for cancellation')
      return
    }

    setIsSubmitting(true)
    try {
      const response =  await api.post(`/order/cancel/${viewOrderData._id}`, {reason: cancelReason})
      if(response.status === 200){

        getOrderData()
        setActive(1)
      toast.success('Order cancelled successfully')
      setShowCancelModal(false)
      setCancelReason('')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Pacific/Auckland'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className='w-full border border-stone-200 p-8 rounded-xl flex flex-col gap-6 bg-white shadow-sm'>
         
         <div className="flex items-center justify-between">
           <h2 className='text-2xl font-semibold text-purple-950'>Order Details</h2>
           <div className="flex items-center gap-3">
             {canCancelOrder() && (
               <button 
                 onClick={() => setShowCancelModal(true)}
                 className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
               >
                 Cancel Order
               </button>
             )}
             <button 
               onClick={onBack}
               className="px-6 py-2 bg-purple-100 text-purple-700 flex items-center gap-2 rounded-lg hover:bg-purple-950 hover:text-white transition-colors"
             >
               <IoIosArrowBack /> Back to Orders
             </button>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm font-medium'>Order Number</label>
               <h4 className='font-semibold text-purple-950 text-lg'>{viewOrderData.orderNumber}</h4>
           </div>
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm font-medium'>Payment Method</label>
               <h4 className='font-medium text-purple-950 capitalize'>{viewOrderData.payment.method}</h4>
           </div>
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm font-medium'>Order Date</label>
               <h4 className='font-medium text-purple-950'>{formatDate(viewOrderData.createdAt)}</h4>
           </div>
           <div className="flex flex-col gap-1">
               <label className='text-gray-500 text-sm font-medium'>Shipping Address</label>
               <h4 className='font-medium text-purple-950 '>
                 {viewOrderData.address.shippingAddress.address}, {viewOrderData.address.shippingAddress.city}, <span className='capitalize'>{viewOrderData.address.shippingAddress.country}</span> - {viewOrderData.address.shippingAddress.pincode}
               </h4>
           </div>
         </div>

        
         <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-100">
           <h3 className="text-xl font-semibold mb-6 text-purple-950">Order Status & Tracking</h3>
           <div className="relative">
            
             <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
             {viewOrderData.orderStatus !== 'cancelled' && (
               <div 
                 className="absolute left-6 top-8 w-0.5 bg-green-500 transition-all duration-500"
                 style={{ height: `${(getCurrentStatusIndex() / (orderStatuses.length - 2)) * 100}%` }}
               ></div>
             )}
             
             {orderStatuses
               .filter(status => viewOrderData.orderStatus === 'cancelled' ? 
                 ['pending', 'cancelled'].includes(status.status) : 
                 status.status !== 'cancelled')
               .map((statusItem, index) => {
               const isCompleted = viewOrderData.orderStatus === 'cancelled' ? 
                 statusItem.status === 'cancelled' : 
                 index <= getCurrentStatusIndex()
               const isCurrent = statusItem.status === viewOrderData.orderStatus
               const StatusIcon = statusItem.icon
               
               return (
                 <div key={statusItem.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  
                   <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                     isCompleted ? 
                       (statusItem.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-green-500 text-white') : 
                       'bg-gray-200 text-gray-500'
                   }`}>
                     <StatusIcon className="text-lg" />
                   </div>
                   
                  
                   <div className="flex-1 pt-1">
                     <div className="flex items-center gap-2 mb-1">
                       <h4 className={`font-semibold ${
                         isCompleted ? 
                           (statusItem.status === 'cancelled' ? 'text-red-600' : 'text-green-600') : 
                           'text-gray-500'
                       }`}>
                         {statusItem.label}
                       </h4>
                       {isCurrent && (
                         <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                           statusItem.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                         }`}>
                           Current Status
                         </span>
                       )}
                     </div>
                     <p className="text-sm text-gray-600 mb-1">{statusItem.description}</p>
                     {isCompleted && (
                       <p className="text-xs text-gray-500">
                         {formatDate(viewOrderData.updatedAt)}
                       </p>
                     )}
                     {statusItem.status === 'cancelled' && viewOrderData.cancelReason && (
                       <p className="text-sm text-red-600 mt-2 font-medium">
                         Reason: {viewOrderData.cancelReason}
                       </p>
                     )}
                   </div>
                 </div>
               )
             })}
           </div>
         </div>

         <div className="flex items-center justify-between">
           <h2 className='text-2xl font-semibold text-purple-950'>Products ({viewOrderData.totalQuantity} items)</h2>
           {viewOrderData.orderStatus === 'cancelled' && (
             <span className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
               Order Cancelled
             </span>
           )}
         </div>

         <div className="flex flex-col gap-5">
            {viewOrderData?.products?.map((item, index) => {
              const isExpanded = expandedProducts[item._id] || false
              
              return (
                <div key={item._id} className={`flex w-full flex-col gap-4 rounded-xl p-6 border transition-all duration-200 ${
                  viewOrderData.orderStatus === 'cancelled' ? 
                    'bg-red-50/30 border-red-100' : 
                    'bg-stone-50/50 border-stone-200 hover:bg-white hover:shadow-sm'
                }`}>
                   
                    <div 
                      className="flex items-center justify-between gap-4 cursor-pointer hover:bg-white/70 p-3 rounded-lg transition-colors"
                      onClick={() => toggleProductExpansion(item?._id)}
                    >
                         <div className='flex gap-4 items-center'> 
                           <div className="relative">
                             <Image 
                               src={item?.product?.images[0]?.source} 
                               height={70} 
                               width={70} 
                               className={`h-18 w-18 object-contain rounded-xl border-2 transition-all ${
                                 viewOrderData?.orderStatus === 'cancelled' ? 
                                   'border-red-200 opacity-70' : 
                                   'border-stone-200'
                               }`}
                               alt={item.name}
                             /> 
                             {viewOrderData?.orderStatus === 'cancelled' && (
                               <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                                 <FaTimes className="text-red-600 text-xl" />
                               </div>
                             )}
                           </div>
                           <div className="flex flex-col gap-2">
                              <h3 className='text-purple-950 font-semibold text-lg'>{item.name}</h3>
                              <div className="flex items-center gap-4">
                                <span className='text-sm text-gray-600 font-medium'>Qty: {item.quantity}</span>
                                <span className='bg-orange-50 px-3 py-1 rounded-full text-orange-700 text-sm font-semibold border border-orange-200'>
                                  ${item.sellingPrice.toFixed(2)}
                                </span>
                              </div>
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-3">
                           <span className="text-xl font-bold text-green-600">
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
                          <div className="pt-4 border-t border-stone-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm font-medium'>Category</label>
                                  <h4 className="font-medium text-purple-950">{item.product.category || 'N/A'}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm font-medium'>Brand</label>
                                  <h4 className="font-medium text-purple-950">{item.product.brand}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm font-medium'>Origin</label>
                                  <h4 className="font-medium text-purple-950">{item.product.origin}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm font-medium'>Regular Price</label>
                                  <h4 className="font-medium text-gray-600">${item.product.regularPrice.toFixed(2)}</h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm font-medium'>Selling Price</label>
                                  <h4 className='bg-green-50 px-3 py-2 rounded-lg text-green-700 w-fit text-sm font-semibold border border-green-200'>
                                    ${item.product.sellingPrice.toFixed(2)}
                                  </h4>
                              </div>
                              <div className="flex flex-col gap-1">
                                  <label className='text-gray-500 text-sm font-medium'>Status</label>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit capitalize ${
                                    item.product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {item.product.status}
                                  </span>
                              </div>
                            </div>

                           
                            {item.product.shortDescription && (
                              <div className="mt-4">
                                <label className='text-gray-500 text-sm font-medium block mb-2'>Description</label>
                                <p className="text-purple-950 bg-white p-4 rounded-lg border border-stone-200">
                                  {item.product.shortDescription}
                                </p>
                              </div>
                            )}

                           
                            {item.product.highlights && item.product.highlights.length > 0 && (
                              <div className="mt-4">
                                <label className='text-gray-500 text-sm font-medium block mb-2'>Highlights</label>
                                <ul className="bg-white p-4 rounded-lg border border-stone-200">
                                  {item.product.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-purple-950 text-sm flex items-center gap-3 mb-2 last:mb-0">
                                      <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                           
                            {item.product.images && item.product.images.length > 1 && (
                              <div className="mt-4">
                                <label className='text-gray-500 text-sm font-medium block mb-2'>Product Images</label>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                  {item.product.images.map((image, idx) => (
                                    <Image 
                                      key={image._id}
                                      src={image.source} 
                                      height={90} 
                                      width={90} 
                                      className='h-22 w-22 object-contain rounded-lg border border-stone-200 flex-shrink-0 hover:scale-105 transition-transform cursor-pointer' 
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

         
         <div className={`p-6 rounded-xl border transition-all ${
           viewOrderData.orderStatus === 'cancelled' ? 
             'bg-gradient-to-r from-red-50 to-red-50/50 border-red-200' :
             'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100'
         }`}>
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-semibold text-purple-950">Order Summary</h3>
             <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(viewOrderData.orderStatus)}`}>
               {viewOrderData.orderStatus}
             </span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div className="flex justify-between">
               <span className="text-gray-600 font-medium">Total Items:</span>
               <span className="font-semibold text-purple-950">{viewOrderData.totalQuantity}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600 font-medium">Payment Status:</span>
               <span className={`font-semibold capitalize ${
                 viewOrderData.payment.status === PAYMENT_STATUS.PENDING ? 'text-yellow-600' :
                 viewOrderData.payment.status === PAYMENT_STATUS.SUCCESS ? 'text-green-600' :
                 'text-gray-600'
               }`}>
                 {viewOrderData.payment.status}
               </span>
             </div>
           </div>
           <div className="pt-4 border-t border-purple-200">
             <div className="flex justify-between items-center">
               <span className="text-xl font-semibold text-purple-950">Total Amount:</span>
               <span className={`text-2xl font-bold ${
                 viewOrderData.orderStatus === 'cancelled' ? 'text-red-600' : 'text-green-600'
               }`}>
                 ${viewOrderData.totalPrice.toFixed(2)}
               </span>
             </div>
           </div>
           {viewOrderData.orderNotes && (
             <div className="mt-4 pt-4 border-t border-purple-200">
               <span className="text-sm text-gray-600 block mb-2 font-medium">Order Notes:</span>
               <p className="text-purple-950 italic bg-white/50 p-3 rounded-lg">{viewOrderData.orderNotes}</p>
             </div>
           )}
         </div>
      </div>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-499 p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Cancel Order</h3>
                  <p className="text-sm text-gray-600">Order # <span className='text-orange-400'>{viewOrderData.orderNumber}</span></p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select a reason</option>
                  {cancelReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isSubmitting || !cancelReason}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OrderDetail