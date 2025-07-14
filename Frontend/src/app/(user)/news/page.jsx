import React from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import OurArticle from '../../../../components/user/News/OurArticle'
import Counter from '../../../../components/user/home/Counter'

const page = () => {
  return (
    <>
      <PageBanner heading={"News Feed"}/>
      <OurArticle/>
      <Counter/>
    </>
  )
}

export default page
