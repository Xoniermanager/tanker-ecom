import React from 'react'
import CustomerRating from '../common/CustomerRating'
import NewCustomers from './NewCustomers'

const CustomerGraphRow = () => {
  return (
    <>
      <div className="flex  gap-8 w-full">
          <div className='w-[64%]'> 

           <NewCustomers/>
          </div>
          <div className='w-[36%]'>
            <CustomerRating/>
          </div>
      </div>
    </>
  )
}

export default CustomerGraphRow
