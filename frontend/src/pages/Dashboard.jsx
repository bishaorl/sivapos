import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarLeft from "../components/SidebarLeft";
import ShoppingCart from "../pages/ShoppingCart";
import ProductSearch from "../components/ProductSearch";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

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