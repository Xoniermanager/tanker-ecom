import React from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import WhatWeOffer from '../../../../components/user/home/WhatWeOffer'
import WorkProcess from '../../../../components/user/about/WorkProcess'
import WhoWeAre from '../../../../components/user/home/WhoWeAre'
import Counter from '../../../../components/user/home/Counter'

const page = () => {
  return (
    <>
      <PageBanner heading={'Our Services'}/>
      <WhatWeOffer/>
      <WorkProcess/>
      <WhoWeAre/>
      <Counter/>
    </>
  )
}

export default page
