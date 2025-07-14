import React from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import GalleryComponent from '../../../../components/user/gallery/GalleryComponent'
import Counter from '../../../../components/user/home/Counter'

const page = () => {
  return (
    <>
      <PageBanner heading={'our gallery'}/>
      <GalleryComponent />
      <Counter />
    </>
  )
}

export default page
