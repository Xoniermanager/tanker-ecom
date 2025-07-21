import React from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import AboutCompany from '../../../../components/user/home/AboutCompany'
import WorkProcess from '../../../../components/user/about/WorkProcess'
import WhoWeAre from '../../../../components/user/home/WhoWeAre'
import Counter from '../../../../components/user/home/Counter'
import ClientFeedback from '../../../../components/user/about/ClientFeedback'
import OurPeople from '../../../../components/user/about/OurPeople'

const Page = () => {
  return (
    <>
      <PageBanner heading={'About Us'}/>
      <AboutCompany/>
      <OurPeople/>
      <WhoWeAre/>
      <Counter/>
      <ClientFeedback/>
    </>
  )
}

export default Page
