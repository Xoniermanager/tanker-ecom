import React, { useState } from "react";
import {
  NEWZEALAND_CITIES,
  NEWZEALAND_REGIONS,
  PAYMENT_METHODS,
  COUNTRIES,
} from "../../../constants/enums";
import { MdShoppingCartCheckout } from "react-icons/md";
import { FaXmark, FaCheck } from "react-icons/fa6";
import StripePaymentModal from "./StripePaymentModal";
import Link from "next/link";

const CheckOut = ({
  formData,
  handleChange,
  handleTerms,
  cartData,
  userData,
  isLoading,
  handleSubmit,
  discountPrice,
  withShippingChargesPrice,
  errMessage,
  onPaymentSuccess,
  onPaymentFailed,
  shippingPrice,
  addressIsSame,
  setAddressIsSame,
  handleSubmitQuote, shippingLoading
}) => {
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if(((formData.shippingAddress.country !== "NZ"))){
      console.log("handle submit quote call")
      return handleSubmitQuote()
    }

    if (formData.paymentMethod === "online_payment" && (formData.shippingAddress.country === "NZ")) {
      const result = await handleSubmit(e, true);
      if (result?.orderId) {
        setCreatedOrderId(result.orderId);
        setShowStripeModal(true);
      }
    } else {
      handleSubmit(e);
    }
  };

  const handlePaymentComplete = () => {
    setShowStripeModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess(createdOrderId);
    }
  };

  const handlePaymentFiled = () =>{
     setShowStripeModal(false);
     if(onPaymentFailed){
      onPaymentFailed(createdOrderId)
     }
  }
  return (
    <>
      <div className="px-5 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-10">
        <div className="w-full lg:w-[72%] flex flex-col gap-2 lg:gap-3">
          <h2 className="text-xl font-semibold text-purple-950 ">
            Billing Details
          </h2>
          <div className="w-full border-b-1 border-slate-200 my-3"></div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 p-5 lg:p-6 rounded-lg bg-purple-50/80">
            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label htmlFor="firstName">
                {" "}
                <span className="text-red-500">*</span> First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label htmlFor="lastName">
                {" "}
                <span className="text-red-500">*</span> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label htmlFor="email">
                <span className="text-red-500">*</span> Email
              </label>
              <input
                type="email"
                name="email"
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
              <label htmlFor="phone">
                <span className="text-red-500">*</span> Contact Number
              </label>
              <input
                type="number"
                name="phone"
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                placeholder="Contact Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full col-span-2 border-b-1 border-stone-200 "></div>
            <div className="w-full col-span-2 flex justify-between bg-white p-4 px-4 md:px-6 rounded-lg">
              <h2 className="text-purple-950 font-semibold lg:text-xl">
                Shipping & Billing Address
              </h2>
              <div className="flex items-center gap-3 md:gap-4">
                <span
                  className={`${
                    addressIsSame ? "bg-green-500" : "bg-orange-500 "
                  } rounded-lg tracking-wide px-2 md:px-3 py-1 text-[12px] md:text-sm text-white`}
                >
                  {addressIsSame ? "Same" : "Different"}{" "}
                </span>
                <button
                  type="button"
                  onClick={() => setAddressIsSame(!addressIsSame)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    addressIsSame ? "bg-orange-500" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      addressIsSame ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4 md:gap-5 p-5 bg-white/90 border-stone-200 border-1 rounded-lg">
              <h3 className="text-lg font-medium text-purple-950 col-span-2 capitalize">
                {" "}
                <span className="text-red-500">*</span>{" "}
                {!addressIsSame && "Shipping"} address{" "}
              </h3>
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="shippingAddress.address"> Address</label>
                <input
                  type="text"
                  name="shippingAddress.address"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                  placeholder="Enter you address"
                  value={formData.shippingAddress.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2 ">
                <label htmlFor="shippingAddress.country"> Country</label>
                <select
                  type="text"
                  name="shippingAddress.country"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3 capitalize"
                  placeholder="Enter you address"
                  value={formData.shippingAddress.country}
                  onChange={handleChange}
                  required
                >
                  <option value="" hidden>
                    {" "}
                    Choose your Country{" "}
                  </option>
                  {Object.values(COUNTRIES).map((item, i) => (
                    <option value={item.code} className="capitalize" key={i}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <label htmlFor="shippingAddress.city"> Town/City </label>
                <input
                  type="text"
                  name="shippingAddress.city"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                  placeholder="Enter you address"
                  value={formData.shippingAddress.city}
                  onChange={handleChange}
                  required
                />
                {/* <div className="flex items-center justify-end w-full">
                  {formData.shippingAddress.city &&
                    (!Object.values(NEWZEALAND_CITIES).includes(
                      formData.shippingAddress.city.toLowerCase()
                    ) ? (
                      <p className="text-red-500 text-sm flex items-center gap-1 first-letter:capitalize">
                        {" "}
                        <span>*</span> You entered city is invalid
                      </p>
                    ) : (
                      <p className="text-green-500 text-sm flex items-center gap-1 capitalize">
                        {" "}
                        <FaCheck /> valid city{" "}
                      </p>
                    ))}
                </div> */}
              </div>
              <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                <label htmlFor="shippingAddress.pincode">Zip Code</label>
                <input
                  type="number"
                  name="shippingAddress.pincode"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                  placeholder="Zip Code"
                  value={formData.shippingAddress.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {!addressIsSame && (
              <div className="col-span-2 grid grid-cols-2 gap-5 p-5 bg-white/90 border-stone-200 border-1 rounded-lg capitalize">
                <h3 className="text-lg font-medium text-purple-950 col-span-2">
                  {" "}
                  <span className="text-red-500">*</span> Billing address{" "}
                </h3>
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="billingAddress.address"> Address</label>
                  <input
                    type="text"
                    name="billingAddress.address"
                    className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                    placeholder="Enter you address"
                    value={formData.billingAddress.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="billingAddress.state"> State</label>
                <select
                  type="text"
                  name="billingAddress.state"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3 capitalize"
                  placeholder="Enter you address"
                  value={formData.billingAddress.state}
                  onChange={handleChange}
                  required
                >
                  <option value="" hidden>
                    {" "}
                    Choose your state{" "}
                  </option>
                  {Object.values(NEWZEALAND_REGIONS).map((item, i) => (
                    <option value={item} className="capitalize" key={i}>
                      {item.split("_").join(" ")}
                    </option>
                  ))}
                </select>
              </div> */}
                <div className="flex flex-col gap-2 col-span-2">
                  <label htmlFor="billingAddress.country"> Country</label>
                  <select
                    type="text"
                    name="billingAddress.country"
                    className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3 capitalize"
                    placeholder="Enter you address"
                    value={formData.billingAddress.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="" hidden>
                      {" "}
                      Choose your Country{" "}
                    </option>
                    {Object.values(COUNTRIES).map((item, i) => (
                      <option value={item.value} className="capitalize" key={i}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                  <label htmlFor="billingAddress.city"> Town/City</label>
                  <input
                    type="text"
                    name="billingAddress.city"
                    className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                    placeholder="City"
                    value={formData.billingAddress.city}
                    onChange={handleChange}
                    required
                  />
                  {/* <div className="flex items-center justify-end w-full">
                  {formData.billingAddress.city &&
                    (!Object.values(NEWZEALAND_CITIES).includes(
                      formData.billingAddress.city.toLowerCase()
                    ) ? (
                      <p className="text-red-500 text-sm flex items-center gap-1 first-letter:capitalize">
                        {" "}
                        <span>*</span> You entered city is invalid
                      </p>
                    ) : (
                      <p className="text-green-500 text-sm flex items-center gap-1 capitalize">
                        {" "}
                        <FaCheck /> valid city{" "}
                      </p>
                    ))}
                </div> */}
                </div>
                <div className="flex flex-col gap-2 col-span-2 md:col-span-1">
                  <label htmlFor="billingAddress.pincode">Zip Code</label>
                  <input
                    type="number"
                    name="billingAddress.pincode"
                    className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                    placeholder="Zip Code"
                    value={formData.billingAddress.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 col-span-2">
              <h3 className="text-lg font-medium text-purple-950  capitalize">
                {" "}
                Order Notes{" "}
              </h3>
              <textarea
                name="orderNotes"
                id="orderNotes"
                value={formData.orderNotes}
                onChange={handleChange}
                className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                rows={5}
                placeholder="Enter your notes here..."
              />
            </div>
          </form>
        </div>
        <div className="w-full lg:w-[28%] sticky top-28 flex flex-col gap-5">
          <div className="px-5 py-5 bg-orange-50 flex flex-col gap-4 rounded-lg border-1 border-stone-800">
            <h2 className="text-xl font-semibold text-purple-950 pb-4 border-b-1 border-stone-300">
              Order summary
            </h2>

            <ul className="flex flex-col gap-5 ">
              {cartData?.map((item, index) => (
                <li className="flex items-center justify-between " key={index}>
                  {" "}
                  <span className="font-medium text-purple-950">
                    {item.product.name} ({item.quantity}){" "}
                  </span>{" "}
                  <span className="font-semibold text-purple-900 text-lg">
                    {" "}
                    ${item.product.sellingPrice}{" "}
                  </span>{" "}
                </li>
              ))}

              <li className="flex items-center justify-between ">
                {" "}
                <span className="font-medium text-purple-900 text-lg">
                  Sub Total
                </span>{" "}
                <span className="font-semibold text-purple-900 text-lg">
                  ${discountPrice?.toFixed(2)}
                </span>{" "}
              </li>
              <div className="border-stone-300 w-full border-b-1"></div>
              <li className="flex items-center justify-between ">
                {" "}
                <span className="font-medium text-purple-900 text-lg">
                  Shipping
                </span>{" "}
                <div className="text-black/75 text-[15px]">
                  {" "}
                  {shippingPrice ? `Flat Rate: ${Number(shippingPrice).toFixed(2)}` : "Valid in New Zealand"}
                </div>{" "}
              </li>
            </ul>

            <div className="border-stone-300 w-full border-b-1"></div>
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-lg text-purple-950">
                {" "}
                Total{" "}
              </span>
              <span className="font-semibold text-purple-950 text-xl">
                $
                {(cartData?.length > 0)
                  ? withShippingChargesPrice?.toFixed(2)
                  : "--"}
              </span>
            </div>
          </div>
          <div className="px-5 py-5 bg-orange-50 flex flex-col gap-6 rounded-lg border-1 border-stone-800">
            <h2 className="text-xl font-semibold text-purple-950 pb-4 border-b-1 border-stone-300">
              Payment information
            </h2>
            <ul className="flex flex-col gap-3">
              {((formData.shippingAddress.country !== "NZ") && (formData.paymentMethod === PAYMENT_METHODS.COD))&& <li className="flex items-center gap-3 ">
                <input
                  type="radio"
                  id={PAYMENT_METHODS.COD}
                  name="paymentMethod"
                  value={PAYMENT_METHODS.COD}
                  checked={formData.paymentMethod === PAYMENT_METHODS.COD}
                  onChange={handleChange}
                  className="w-4 h-4 accent-purple-700"
                />
                <label
                  htmlFor={PAYMENT_METHODS.COD}
                  className="cursor-pointer hover:text-orange-400"
                >
                  Cash on Delivery (COD)
                </label>
              </li>}

              {(formData.shippingAddress.country === "NZ") && <li className="flex items-center gap-3">
                <input
                  type="radio"
                  id={PAYMENT_METHODS.ONLINE_PAYMENT}
                  name="paymentMethod"
                  value={PAYMENT_METHODS.ONLINE_PAYMENT}
                  checked={
                    formData.paymentMethod === PAYMENT_METHODS.ONLINE_PAYMENT
                  }
                  onChange={handleChange}
                  className="w-4 h-4 accent-purple-700"
                />
                <label
                  htmlFor={PAYMENT_METHODS.ONLINE_PAYMENT}
                  className="cursor-pointer  hover:text-orange-400"
                >
                  Pay Online
                </label>
              </li>}
            </ul>

            <div className="flex items-start gap-3 ">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms || false}
                onChange={handleTerms}
                className="mt-1 w-4 h-4 accent-purple-700"
                required
              />
              <label htmlFor="terms" className="text-sm text-stone-700">
                I have read and agree to the{" "}
                <Link
                  href={`/terms-and-conditions`}
                  target="_blank"
                  className="text-purple-700 underline cursor-pointer"
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>
            <div className="flex">
              {errMessage && <p className="text-red-500">{errMessage}</p>}
            </div>
            <div className="relative group w-full">
              <button
                onClick={handlePlaceOrder}
                disabled={
                  !formData.terms ||
                  formData.shippingAddress.country === "" ||
                  
                  formData.shippingAddress.address === "" ||
                  formData.shippingAddress.pincode === 0 ||
                  formData.shippingAddress.pincode.toString().length < 4 ||
                  formData.shippingAddress.pincode === "" ||
                  (!addressIsSame &&
                    (formData.billingAddress.pincode === "" ||
                      formData.billingAddress.address === "" ||
                      formData.billingAddress.pincode == 0 ||
                      formData.billingAddress.country === "" ||
                      formData.billingAddress.pincode.toString().length < 4)) ||
                  !Object.values(PAYMENT_METHODS).includes(
                    formData.paymentMethod
                  )
                }
                className="bg-orange-400 disabled:bg-orange-300 rounded-md hover:bg-orange-500 py-3 text-sm font-medium flex items-center justify-center gap-2 tracking-wide text-white uppercase w-full relative"
              >
                {isLoading ? "Placing Order..." : (formData.shippingAddress.country === "NZ") ? "Place order" : "Place Order Quote"}{" "}
                {!isLoading && <MdShoppingCartCheckout className="text-lg" />}
              </button>

              {(!formData.terms ||
                formData.shippingAddress.country === "" ||
                formData.billingAddress.address === "" ||
                formData.shippingAddress.address === "" ||
                formData.shippingAddress.pincode === "" ||
                formData.shippingAddress.pincode == 0 ||
                formData.billingAddress.pincode === "" ||
                formData.billingAddress.pincode == 0 ||
                formData.billingAddress.country === "" ||
                !Object.values(PAYMENT_METHODS).includes(
                  formData.paymentMethod
                )) && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
                  Please fill all the fields properly
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <StripePaymentModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        orderId={createdOrderId}
        totalAmount={withShippingChargesPrice?.toFixed(2)}
        onSuccess={handlePaymentComplete}
        onFailed={handlePaymentFiled}
      />
    </>
  );
};

export default CheckOut;
