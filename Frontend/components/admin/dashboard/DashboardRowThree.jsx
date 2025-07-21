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
      <div className="w-full py-6 grid grid-cols-3 gap-8">
        <OrderMonitor/>
        <SalesMonitor/>
        <ReviewsBox/>
        <CustomerRating/>
        <ProductSold/>
        <CountryMonitor />
        
        
      </div>
    </>
  )
}

export default DashboardRowThree
