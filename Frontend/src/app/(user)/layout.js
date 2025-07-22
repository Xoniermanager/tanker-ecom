import Footer from "../../../components/user/common/Footer";
import Navbar from "../../../components/user/common/Navbar";




export default function UserLayout({ children }) {
  return (
    <html lang="en">
      <body
        
      >
        
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}