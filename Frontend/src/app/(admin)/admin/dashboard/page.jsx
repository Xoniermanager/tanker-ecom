
import React from 'react'
import Monitor from '../../../../../components/admin/dashboard/Monitor'
import DashboardRowTwo from '../../../../../components/admin/dashboard/DashboardRowTwo'
import DashboardRowThree from '../../../../../components/admin/dashboard/DashboardRowThree'
import TopSellingProducts from '../../../../../components/admin/dashboard/TopSellingProducts'
import api from '../../../../../components/user/common/api'
import PageLoader from '../../../../../components/common/PageLoader'

const page = () => {
 

 
  
  return (
    <>
      <div className='pl-86 pt-26 p-6 w-full bg-violet-50 flex flex-col gap-6'>
        <Monitor />
        <DashboardRowTwo/>
        <DashboardRowThree />
        <TopSellingProducts/>
      </div>
      
    </>
  )
}

export default page
