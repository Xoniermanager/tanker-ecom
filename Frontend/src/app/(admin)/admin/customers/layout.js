import Navbar from "../../../../../components/admin/Navbar";
import Sidebar from "../../../../../components/admin/Sidebar";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';




export const metadata = {
  title: "Tanker Solutions admin",
  description: "Ecommerce website",
};


export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-violet-50 h-screen overflow-x-visible"
        
      >
        
        <Sidebar/>
        <Navbar/>
        {children}
        
      </body>
    </html>
  );
}