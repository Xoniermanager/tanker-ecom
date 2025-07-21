import React from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import OurProducts from '../../../../components/user/Products/OurProducts'
import WorkProcess from '../../../../components/user/about/WorkProcess'
import WhoWeAre from '../../../../components/user/home/WhoWeAre'
import Counter from '../../../../components/user/Products/Counter'


const page = () => {
  return (
    <>
      <PageBanner heading={"our products"}/>
      <OurProducts/>
      <WorkProcess/>
      {/* <WhoWeAre/> */}
      <Counter/>
    </>
  )
}

export default page
