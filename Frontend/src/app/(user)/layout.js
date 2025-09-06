
import Footer from "../../../components/user/common/Footer";
import Navbar from "../../../components/user/common/Navbar";
import StripeProvider from "../../../components/stripe/StripeProvider";




 const SiteSettingData = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/site-settings`,{
    next: {revalidate: 60}, 
  }).then(res=>res.json()).catch(err=>console.error(err))



export default async function UserLayout({ children }) {

 
  return (
    <html lang="en">
      <body
      >
        <StripeProvider>
        <Navbar siteData={SiteSettingData?.data}/>
        {children}
        <Footer siteData={SiteSettingData?.data}/>
        </StripeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  // title: SiteSettingData.seoDetails.metaTitle,
  description: "Ecommerce website",
};