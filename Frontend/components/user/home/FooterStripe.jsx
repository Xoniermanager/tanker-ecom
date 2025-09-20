import Link from "next/link";
import React from "react";

const FooterStripe = () => {
  return (
    <>
      <div
        style={{ backgroundImage: "url('/images/stripe-bg.jpg')" }}
        className="w-full py-16 md:py-20 px-6 relative strip bg-no-repeat bg-cover"
      >
        <div className="flex flex-col md:flex-row  items-center gap-10 max-w-full px-4 mx-auto relative z-10 md:pl-46 lg:pl-88">
          <h2 className="text-white text-4xl lg:text-5xl font-black  md:w-2/3 md:leading-12 lg:leading-14 text-center md:text-start">
            {" "}
            We ensure safe transportation & delivery
          </h2>
          <div className="lg:w-1/3 flex justify-end">
            <Link href={"/contact"} className="btn-two-big">
              {" "}
              Contact Us{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterStripe;
