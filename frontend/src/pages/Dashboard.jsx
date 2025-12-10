import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarLeft from "../components/SidebarLeft";
import ShoppingCart from "../pages/ShoppingCart";
import ProductSearch from "../components/ProductSearch";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  // Close mobile sidebar when resizing window
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        // Reset mobile sidebar state when switching to desktop
        const event = new CustomEvent('closeMobileSidebar');
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <SidebarLeft onSearchTermChange={handleSearchTermChange} />
      <div className="container">
        {/* Dynamic Page */}
        <div className="main-content">
          {searchTerm && searchTerm.trim() !== "" ? (
            <ProductSearch searchTerm={searchTerm} />
          ) : (
            <Outlet />
          )}
        </div>
        
        {/* Always show shopping cart on the right side for all users */}
        <div className="sidebarRight">
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Dashboard;