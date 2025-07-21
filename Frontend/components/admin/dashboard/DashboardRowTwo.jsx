import React from 'react'
import SalesChart from './SalesChart'
import CategoryChart from './CategoryChart'

const DashboardRowTwo = () => {
  return (
    <>
      <div className="w-full py-6 flex items-start gap-8">
        <div className="w-[62%] ">
            <SalesChart/>
        </div>
        <div className="w-[38%]">
            <CategoryChart/>
        </div>

      </div>
    </>
  )
}

export default DashboardRowTwo
