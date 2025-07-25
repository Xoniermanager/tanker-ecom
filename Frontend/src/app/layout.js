import { Instrument_Sans } from "next/font/google";
import "./globals.css";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const InstrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});



export const metadata = {
  title: "Tanker Solutions",
  description: "Ecommerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${InstrumentSans.variable}  antialiased h-screen `}
      >
        <ToastContainer/>
        {children}
      </body>
    </html>
  );
}
