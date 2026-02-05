import { Instrument_Sans } from "next/font/google";
import CartContextProvider from "../../context/cart/CartContextProvider";
import "./globals.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "../../components/common/ScrollToTop";
import UserContextProvider from "../../context/user/AuthContextProvider";
import Providers from "../../context/Providers";
import { getSiteSettings, createMetadata } from "../../lib/seo.utils";

const InstrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${InstrumentSans.variable}  antialiased h-screen `}>
        <ScrollToTop />
        <ToastContainer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export async function generateMetadata({ params, searchParams, pathname }) {
  const siteSettingsData = await getSiteSettings();
  const siteData = siteSettingsData?.data;

  return createMetadata(siteData, { currentPath: pathname });
}

export const dynamic = 'force-dynamic';
