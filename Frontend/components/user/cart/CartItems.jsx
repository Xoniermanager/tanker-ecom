"use client";
import React from "react";

import { useCart } from "../../../context/cart/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaMinus, FaPlus, FaXmark } from "react-icons/fa6";
import { TbShoppingCartX } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../context/user/AuthContext";

const CartItems = ({ handleRemoveProduct, handleClearCart, DataLength, haveCartData }) => {
  const {
    cartData,
    isLoading,
    increaseCount,
    decreesCount,
    regularPrice,
    discountPrice,
    withShippingChargesPrice
    
  } = useCart();

  const {isAuthenticated} = useAuth()

  const router = useRouter();

  const pathname = usePathname()


  return (
    <>
      <div className="py-24 max-w-7xl mx-auto flex items-start gap-10">
        <div className="w-[72%]">
          <div className="w-full bg-stone-100 p-3 px-5 mb-3 rounded-lg flex justify-between items-center">
             <h2 className="font-semibold text-lg text-purple-950">Total Cart Items</h2>
             <button disabled={DataLength <= 0} className="bg-red-500/80 hover:bg-red-500 disabled:bg-red-300 px-5 py-2 text-white rounded-lg flex items-center justify-center gap-2" onClick={handleClearCart}>Clear Cart <TbShoppingCartX /> </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b-1  border-gray-200">
                <th className="font-semibold text-purple-950 text-xl p-3 text-start">
                  Product
                </th>
                <th className="font-semibold text-purple-950 text-xl p-3 text-start">
                  Quantity
                </th>
                {/* <th className="font-semibold text-purple-950 text-xl p-3 text-start">
                  Discount
                </th> */}
                <th className="font-semibold text-purple-950 text-xl p-3 text-start">
                  Price
                </th>
                <th className="font-semibold text-purple-950 text-xl p-3 text-start">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cartData?.length > 0 ? (
                cartData?.map((item, index) => {
                  const discount =
                    ((Number(item?.product?.regularPrice) -
                      Number(item?.product?.sellingPrice)) /
                      Number(item?.product?.regularPrice)) *
                    100;
                  return (
                    <tr>
                      <td className="py-5 ">
                        <Link
                          href={`products/${item.product?.slug}`}
                          className="flex items-center gap-3 group "
                        >
                          <Image
                            src={item?.product?.images[0]?.source || item?.product?.images[0] || '/images/dummy.jpg' }
                            height={80}
                            width={80}
                            className="h-16 w-18 group-hover:scale-104 rounded-lg object-cover"
                            alt="product"
                          />
                          <span className="text-lg text-purple-950 capitalize font-medium group-hover:text-orange-500">
                            {item.product?.name}
                          </span>{" "}
                        </Link>
                      </td>
                      <td className="p-5">
                        {" "}
                        <div className="border-gray-300 border-1 flex w-fit gap-4  items-center justify-between px-4 py-2 rounded-lg">
                          {" "}
                          <button
                            className="text-sm text-purple-950 hover:text-orange-400 hover:rotate-180"
                            onClick={() => decreesCount(item.product._id, 1)}
                          >
                            <FaMinus />
                          </button>{" "}
                          {item.quantity}{" "}
                          <button
                            className="text-sm text-purple-950 hover:text-orange-400 hover:rotate-90"
                            onClick={() => increaseCount(item.product._id, 1)}
                          >
                            <FaPlus />
                          </button>{" "}
                        </div>
                      </td>
                      {/* <td className="p-5">
                        {" "}
                        <span className="text-green-500 tracking-wide bg-green-50 px-3.5 py-1.5 text-sm rounded-lg font-medium">
                          {discount.toFixed(2)}%{" "}
                        </span>
                      </td> */}
                      <td className="p-5">
                        {" "}
                        <span className="text-orange-500 tracking-wide bg-orange-50 px-4 py-1.5 rounded-md font-medium">
                          ${item.product?.sellingPrice.toFixed(2)}
                        </span>{" "}
                      </td>
                      <td className="p-5">
                        {" "}
                        <button
                          className="bg-red-500/85 hover:bg-red-500 hover:scale-95 text-white h-8 w-8 flex items-center justify-center rounded-lg group"
                          onClick={() =>
                            handleRemoveProduct(
                              item.product._id,
                              item.product.name
                            )
                          }
                        >
                          <FaXmark className="text-xl group-hover:rotate-90" />
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-3 text-stone-500 ">
                    {" "}
                    No cart items found  {" "}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-[28%]">
          <ul className="flex flex-col w-full">
            <li className="flex items-center justify-between bg-orange-100 p-3 px-6">
              <span className="w-1/2 text-purple-950 text-lg font-medium">
                Cart Total
              </span>
              <span className="w-1/2 text-end text-purple-950 text-lg font-medium">
                {" "}
                $ {regularPrice ?  regularPrice?.toFixed(2) : "--" }{" "}
              </span>
            </li>
            <li className="flex items-center justify-between bg-orange-50/60 border-stone-200 border-b-1 py-5 px-6">
              <span className="w-1/2 text-purple-950 text-lg font-medium">
                Discount Price
              </span>
              <span className="w-1/2 text-end text-green-500 tracking-wide text-lg font-medium">
                {" "}
                $ {discountPrice ?  discountPrice?.toFixed(2) : "--" }{" "}
              </span>
            </li>
            <li className="flex items-center justify-between bg-orange-50/60 border-stone-200 border-b-1 py-5 px-6">
              <span className="w-1/2 text-purple-950 text-lg font-medium">
                Shipping
              </span>
              <div className="text-black/75 text-[15px]">
                  {" "}
                  Flat Rate: $
                  {Number(process.env.NEXT_PUBLIC_SHIPPING_PRICE).toFixed(2)}
                </div>{" "}
            </li>
            <li className="flex items-center justify-between bg-orange-50/60 py-5 px-6">
              <span className="w-1/2 text-purple-950 text-lg font-medium">
                Total Price
              </span>
              <span className={`w-1/2 text-end ${(cartData?.length > 0) && "text-green-500"} tracking-wide text-lg font-medium`}>
                {" "}
                $ {(withShippingChargesPrice && (cartData?.length >0)) ?  withShippingChargesPrice?.toFixed(2) : "--"}{" "}
              </span>
            </li>
          </ul>
          <div className="relative group w-full">
  <button
    onClick={() => isAuthenticated ? router.push("/cart/checkout") : router.push(`/login?redirect=${pathname}`)}
    disabled={!discountPrice || !regularPrice || haveCartData}
    className="capitalize w-full flex items-center justify-center py-3 bg-orange-400 hover:bg-orange-500 disabled:bg-orange-300 text-white rounded-md"
  >
   {isAuthenticated ? " Proceed to checkout " : "Login to checkout" }
  </button>


  {(!discountPrice || !regularPrice || haveCartData) && (
    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
      {!isAuthenticated
       ? "You are not logged in" :
        haveCartData
        ? "Your cart is empty, please add products first"
        : !regularPrice
        ? "Price details are missing"
        : !discountPrice
        ? "Discount not applied"
        : "Please check your cart details"}
    </span>
  )}
</div>

        </div>
      </div>
    </>
  );
};

export default CartItems;
