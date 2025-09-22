"use client"
import React, { useEffect, useState } from 'react'
import PageBanner from '../../../../../components/user/common/PageBanner'
import ProductDetailComponents from '../../../../../components/user/Products/ProductDetailComponents'
import api from '../../../../../components/user/common/api'
import { useParams } from 'next/navigation'
import PageLoader from '../../../../../components/common/PageLoader'
import FailedDataLoading from '../../../../../components/common/FailedDataLoading'
import RelatedProductComponent from '../../../../../components/user/Products/RelatedProductComponent'
import { toast } from 'react-toastify'
import { useCart } from '../../../../../context/cart/CartContext'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from '../../../../../context/user/AuthContext'




const page = () => {
  const [productData, setProductData] = useState(null)
  const [productCategory, setProductCategory] = useState(null)
  const [relatedCategoryData, setRelatedCategoryData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cartIsLoading, setCartIsLoading] = useState(false)
  const [errMessage, setErrMessage] = useState(null)
  const [quantity, setQuantity] = useState(1);
const MySwal = withReactContent(Swal);
  const {cartData, fetchCartData} = useCart()

  const productQuantity = productData?.inventory?.quantity;
  const {isAuthenticated} = useAuth()



  const handleIncrease = () => {
    if(productQuantity === 0){
      return toast.error("This product is out of stock")
    }
    if(quantity >= productQuantity ) {
     return toast.info("No more stock available")
    }
    setQuantity((prev) => prev + 1);
  };


  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); 
  };

  const handleQuantityChange = (e)=>{
     setQuantity(Number(e.target.value))
  }


  const {slug} = useParams();


  const fetchProduct = async()=>{
    setIsLoading(true)
     try {
       const response = await api.get(`/products/${slug}`);
       if(response.status === 200){
        setProductData(response.data.data)
        setProductCategory(response?.data?.data?.category?._id)
        
       }
     } catch (error) {
      console.error(error)
     }
     finally{
      setIsLoading(false)
     }
  }

  const fetchRelatedProduct = async()=>{
    try {
      const response = await api.get(`/products/frontend?category=${productCategory}`)
      if(response.status ===200){
        setRelatedCategoryData(response.data.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

 useEffect(() => {
  fetchProduct();
}, [slug]); 

useEffect(() => {
  if (productCategory) {
    fetchRelatedProduct();
  }
}, [productCategory]); 


const filter = relatedCategoryData?.filter(item=>item._id !== productData._id)


const isInCart = cartData?.some(
  (item) => item.product._id.toString() === productData?._id.toString()
);

const handleCartSubmit = async(e)=>{
   e.preventDefault();
   
  
   if(!isAuthenticated){
      const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingItem = localCart.find(item => item.productId === productData._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localCart.push({ product: {_id: productData._id, regularPrice: productData.regularPrice, 
sellingPrice: productData.sellingPrice, name: productData.name, images:[productData.images[0].source], slug: productData.slug},  quantity });
      }
      localStorage.setItem("guestCart", JSON.stringify(localCart));
      fetchCartData()
      toast.success("Product added to cart locally");
      return;
   }
   setCartIsLoading(true)
   try {
    if(!productData._id) return setErrMessage("Product id not found")
     const response = await api.post(`/cart`, {productId: productData._id, quantity})
    if(response.status === 200){
      toast.success('Product add to cart successfully')
      fetchCartData()
    }
   } catch (error) {
    if(process.env.NODE_ENV === "development"){ console.error(error) }
    const message =
        (Array.isArray(error?.response?.data?.errors) &&
          error.response.data.errors[0]?.message) ||
        error?.response?.data?.message ||
        "Something went wrong";
        toast.error(message);
      setErrMessage(message);
      
   } finally{
     setCartIsLoading(false)
   }
}

if (isLoading){
  return <PageLoader/>
}

if (!productData){
  return <FailedDataLoading />
}
  
  return (
    <>
      <PageBanner heading={'product details'}/>
      <ProductDetailComponents productData={productData} quantity={quantity} setQuantity={setQuantity} handleIncrease={handleIncrease} handleDecrease={handleDecrease} handleCartSubmit={handleCartSubmit} cartIsLoading={cartIsLoading} handleQuantityChange={handleQuantityChange} isInCart={isInCart}/>
      {(filter?.length > 0) && <RelatedProductComponent relatedCategoryData={filter} productData={productData} handleCartSubmit={handleCartSubmit} cartIsLoading={cartIsLoading} />}

    </>
  )
}

export default page
