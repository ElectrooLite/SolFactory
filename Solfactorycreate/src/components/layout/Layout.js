import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#06001D]">
      <Header />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
      {mounted && (
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-[#0c0325] border border-purple-800 text-white shadow-lg"
          progressClassName="bg-gradient-to-r from-pink-500 to-purple-600"
        />
      )}
    </div>
  );
};

export default Layout;
