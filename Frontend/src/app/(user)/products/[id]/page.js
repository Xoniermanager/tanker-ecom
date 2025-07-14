import React from 'react'
import PageBanner from '../../../../../components/user/common/PageBanner'
import ProductDetailComponents from '../../../../../components/user/Products/ProductDetailComponents'

const page = ({params}) => {

  const {id} = params
  console.log(id)
  return (
    <>
      <PageBanner heading={'product details'}/>
      <ProductDetailComponents />
    </>
  )
}

export default page
