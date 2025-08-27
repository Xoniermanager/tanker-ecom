import React from "react";
import { NEWZEALAND_CITIES, NEWZEALAND_REGIONS, PAYMENT_METHODS } from "../../../constants/enums";
import { MdShoppingCartCheckout } from "react-icons/md";
import { FaXmark, FaCheck } from "react-icons/fa6";

const CheckOut = ({ formData, handleChange, handleTerms, cartData, userData, handleSubmit, discountPrice, withShippingChargesPrice }) => {
  return (
    <>
      <div className="py-24 max-w-7xl mx-auto flex items-start gap-10">
        <div className="w-[72%] flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-purple-950 ">
            Billing Details
          </h2>
          <div className="w-full border-b-1 border-slate-200 my-3"></div>
          <form className="grid grid-cols-2 gap-5 p-6 rounded-lg bg-purple-50/80">
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">
                {" "}
                <span className="text-red-500">*</span>Last Name
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
            <div className="flex flex-col gap-2 ">
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
            <div className="flex flex-col gap-2 ">
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
              
              <div className="flex flex-col gap-2 col-span-2">
                <label htmlFor="billingAddress.state"> State</label>
                <select
                  type="text"
                  name="billingAddress.state"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
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
              </div>
              <div className="flex flex-col gap-2 ">
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
                <div className="flex items-center justify-end w-full">
                  {formData.billingAddress.city && ( !Object.values(NEWZEALAND_CITIES).includes(formData.billingAddress.city.toLowerCase())? <p className="text-red-500 text-sm flex items-center gap-1 first-letter:capitalize"> <span>*</span> You entered city is invalid</p> : <p className="text-green-500 text-sm flex items-center gap-1 capitalize"> <FaCheck /> valid city </p>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
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
            <div className="col-span-2 grid grid-cols-2 gap-5 p-5 bg-white/90 border-stone-200 border-1 rounded-lg">
              <h3 className="text-lg font-medium text-purple-950 col-span-2 capitalize">
                {" "}
                <span className="text-red-500">*</span> Shipping address{" "}
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
                <label htmlFor="shippingAddress.state"> State</label>
                <select
                  type="text"
                  name="shippingAddress.state"
                  className="border-stone-200 border-1 rounded-md bg-white outline-none px-5 py-3"
                  placeholder="Enter you address"
                  value={formData.shippingAddress.state}
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
              </div>
              <div className="flex flex-col gap-2 ">
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
                <div className="flex items-center justify-end w-full">
                  {formData.shippingAddress.city && ( !Object.values(NEWZEALAND_CITIES).includes(formData.shippingAddress.city.toLowerCase())? <p className="text-red-500 text-sm flex items-center gap-1 first-letter:capitalize"> <span>*</span> You entered city is invalid</p> : <p className="text-green-500 text-sm flex items-center gap-1 capitalize"> <FaCheck /> valid city </p>)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
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
        <div className="w-[28%] sticky top-28 flex flex-col gap-5">
          <div className="px-5 py-5 bg-orange-50 flex flex-col gap-4 rounded-lg border-1 border-stone-800">
            <h2 className="text-xl font-semibold text-purple-950 pb-4 border-b-1 border-stone-300">
              Order summary
            </h2>

            <ul className="flex flex-col gap-5 ">
              {cartData?.map((item, index)=>(
                <li className="flex items-center justify-between " key={index}> <span className="font-medium text-purple-950">{item.product.name} ({item.quantity}) </span> <span className="font-semibold text-purple-900 text-lg"> ${item.product.sellingPrice} </span> </li>

              ))}

              <li className="flex items-center justify-between "> <span className="font-medium text-purple-900 text-lg">Sub Total</span> <span className="font-semibold text-purple-900 text-lg">${discountPrice?.toFixed(2)}</span> </li>
              <div className="border-stone-300 w-full border-b-1"></div>
              <li className="flex items-center justify-between "> <span className="font-medium text-purple-900 text-lg">Shipping</span> <div className="text-black/75 text-sm"> Flat Rate: ${Number(process.env.NEXT_PUBLIC_SHIPPING_PRICE).toFixed(2)}</div> </li>
            </ul>
            
            <div className="border-stone-300 w-full border-b-1"></div>
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-lg text-purple-950">
                {" "}
                Total{" "}
              </span>
              <span className="font-semibold text-purple-950 text-xl">${withShippingChargesPrice?.toFixed(2)}</span>
            </div>
          </div>
          <div className="px-5 py-5 bg-orange-50 flex flex-col gap-6 rounded-lg border-1 border-stone-800">
            <h2 className="text-xl font-semibold text-purple-950 pb-4 border-b-1 border-stone-300">
              Payment information
            </h2>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 ">
                <input
                  type="radio"
                  id={PAYMENT_METHODS.COD}
                  name="paymentMethod"
                  value={PAYMENT_METHODS.COD}
                  checked={formData.paymentMethod === PAYMENT_METHODS.COD}
                  onChange={handleChange}
                  className="w-4 h-4 accent-purple-700"
                />
                <label htmlFor={PAYMENT_METHODS.COD} className="cursor-pointer hover:text-orange-400">
                  Cash on Delivery (COD)
                </label>
              </li>

              <li className="flex items-center gap-3">
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
                <label htmlFor={PAYMENT_METHODS.ONLINE_PAYMENT} className="cursor-pointer  hover:text-orange-400">
                  Pay Online
                </label>
              </li>
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
                <span className="text-purple-700 underline cursor-pointer">
                  Terms & Conditions
                </span>
              </label>
            </div>
            <button onClick={handleSubmit} disabled={!formData.terms || !Object.values(PAYMENT_METHODS).includes(formData.paymentMethod) || !Object.values(NEWZEALAND_CITIES).includes(formData.billingAddress.city.toLowerCase()) || !Object.values(NEWZEALAND_CITIES).includes(formData.shippingAddress.city.toLowerCase())} className="bg-orange-400 disabled:bg-orange-300 rounded-md hover:bg-orange-500 py-3 text-sm font-medium flex items-center justify-center gap-2 tracking-wide text-white uppercase">
              Place order <MdShoppingCartCheckout className="text-lg"/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;
