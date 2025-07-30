import React from 'react'
import PageBar from '../../../../../../components/admin/common/PageBar'
import CustomerGraphRow from '../../../../../../components/admin/customers/CustomerGraphRow'
import CustomerTable from '../../../../../../components/admin/customers/CustomerTable'

const page = () => {
  return (
    <>
       <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
         <PageBar heading={'Customers'}/>
       <CustomerGraphRow/>
       <CustomerTable/>
       </div>
    </>
  )
}

export default page
