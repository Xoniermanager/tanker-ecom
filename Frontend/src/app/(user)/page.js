import AboutCompany from "../../../components/user/home/AboutCompany";
import Counter from "../../../components/user/home/Counter";
import FooterStripe from "../../../components/user/home/FooterStripe";
import HomePage from "../../../components/user/home/Home";
import OurArticles from "../../../components/user/home/OurArticles";
import OurProducts from "../../../components/user/home/OurProducts";
import WhatWeOffer from "../../../components/user/home/WhatWeOffer";
import WhoWeAre from "../../../components/user/home/WhoWeAre";





export default function Home() {
  return (
    <>
      <HomePage />
      <WhatWeOffer/>
      <AboutCompany/>
      <OurProducts/>
      <Counter/>
      {/* <WhoWeAre/> */}
      <OurArticles/>
      <FooterStripe/>
    </>
  );
}