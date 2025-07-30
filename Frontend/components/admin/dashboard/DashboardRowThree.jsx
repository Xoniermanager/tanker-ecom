import React from 'react'
import OrderMonitor from './OrderMonitor'
import SalesMonitor from './SalesMonitor'
import ReviewsBox from './ReviewsBox'
import CustomerRating from '../common/CustomerRating'
import ProductSold from './ProductSold'
import CountryMonitor from './CountryMonitor'

const DashboardRowThree = () => {
  return (
    <>
      <div className="w-full py-6 pb-4 grid grid-cols-3 gap-8">
        <OrderMonitor/>
        <SalesMonitor/>
        <ReviewsBox/>
      </div>
      <div className="w-full pb-6 grid grid-cols-2 gap-6">
        <CustomerRating/>
        <ProductSold/>
        {/* <CountryMonitor /> */}
        
        
      </div>
    </>
  )
}

export default DashboardRowThree
