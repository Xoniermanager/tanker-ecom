import React from 'react'
import PageBanner from '../../../../components/user/common/PageBanner'
import ContactComponent from '../../../../components/user/contact/ContactComponent'

const page = () => {
  return (
    <>
      <PageBanner heading={'contact us'}/>
      <ContactComponent/>
    </>
  )
}

export default page
