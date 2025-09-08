import Footer from "../../../components/user/common/Footer";
import Navbar from "../../../components/user/common/Navbar";
import StripeProvider from "../../../components/stripe/StripeProvider";
import { getSiteSettings, createMetadata } from "../../../lib/seo.utils";

export default async function UserLayout({ children }) {
  const siteSettingsData = await getSiteSettings();
  const siteData = siteSettingsData?.data;

  return (
    <html lang="en">
      <body>
        <StripeProvider>
          <Navbar siteData={siteData} />
          {children}
          <Footer siteData={siteData} />
        </StripeProvider>
      </body>
    </html>
  );
}


// export async function generateMetadata() {
//   const siteSettingsData = await getSiteSettings();
//   const siteData = siteSettingsData?.data;
  
//   return createMetadata(siteData);
// }
