import React from 'react'
import PageBanner from '../../../../../components/user/common/PageBanner'
import ProductDetailComponents from '../../../../../components/user/Products/ProductDetailComponents'

const page = ({params}) => {

  const slug = params?.slug
  console.log(slug)
  return (
    <>
      <PageBanner heading={'product details'}/>
      <ProductDetailComponents />
    </>
  )
}

export default page
