import Image from "next/image";
import React from "react";

import { MdOutlineShoppingCart } from "react-icons/md";

import { FaStar, FaRegStar } from "react-icons/fa";
import Link from "next/link";

const RelatedProductComponent = ({ relatedCategoryData, handleCartSubmit, cartIsLoading }) => {
    
  return (
    <div className="py-28 w-full bg-[#fbf2f2] ">
      <div className="max-w-7xl mx-auto flex flex-col items-start gap-8">
        <h2 className="font-bold text-purple-950 text-3xl">Related Product</h2>
        <div className="grid grid-cols-4 w-full gap-8">
          {relatedCategoryData?.map((item, index) => (
            <Link href={`/products/${item?.slug}`}
              className=" flex flex-col rounded-lg group overflow-hidden bg-white"
              key={item._id}
            >
              <div className="h-48 w-full overflow-hidden p-4 bg-[#e5e9ea]">
                <Image
                  src={item.images[0].source}
                  height={80}
                  width={80}
                  className="h-48 w-full group-hover:scale-104 rounded-lg object-cover"
                  alt="product"
                />
              </div>
              <div className="flex items-center flex-col justify-center gap-3 px-5 pb-4">
                <span className="bg-orange-400 px-4 py-0.5 text-sm font-medium text-white capitalize">
                  {item.category.name}
                </span>
                <h2 className="text-xl font-bold capitalize text-[#6e797b] text-center line-clamp-1">
                  {item.name}
                </h2>
                <span className="text-purple-950 text-lg tracking-wide font-black">
                  ${item.sellingPrice}
                </span>
                <ul className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <li key={index}>
                      {index < 4 ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-gray-400" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="bg-black disabled:bg-black/50 py-2 text-white font-semibold text-lg hover:bg-orange-500 flex justify-center items-center gap-2"  > Add to cart <MdOutlineShoppingCart /></button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProductComponent;
