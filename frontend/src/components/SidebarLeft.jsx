import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaShopify,
  FaUserCircle,
  FaSignInAlt,
  FaWpforms,
  FaBox,
  FaTags,
  FaUsers,
  FaSearch,
  FaBars,
  FaUser
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

const SidebarLeft = ({ onSearchTermChange }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const logoutUser = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  // Function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle search (you can customize this function based on your needs)
  const handleSearch = (e) => {
    e.preventDefault();
    // Llamamos a la función de búsqueda del componente padre
    if (onSearchTermChange) {
      onSearchTermChange(searchTerm);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // También podemos llamar a la función de búsqueda en tiempo real
    if (onSearchTermChange) {
      onSearchTermChange(value);
    }
  };

  return (
    <>
      <div 
        className={`sidebarLeft ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* <div className="header__toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <FaBars className="header__toggle-icon" />
        </div> */}
        
        <div className="nav__container">
          <div>
            <a href="/dashboard" className="logo-sidebar">
            <img src={require("../images/logo.png")}
            width="40"
            height="40"
            alt="logo"
            />              
              {/* <span className="nav__logo-name"> SiVaPOS</span> */}
              <span className="logo-3d-sidebar">SiVaPOS</span>
            </a>

            {/* <a href="/dashboard" className="nav__link nav__logo"> */}
              {/* <FaUserCircle className="nav__icon" />               */}
            

            <div className="header__search">
              <form onSubmit={handleSearch} className="search-form">
                <input 
                  type="search" 
                  placeholder="Buscar productos..." 
                  className="header__input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="header__icon-button">
                  <FaSearch className="header__icon" />
                </button>
              </form>
            </div>

            <div className="nav__list">
              <div className="nav__items">
                <h3 className="nav__subtitle">Principal</h3>
                
                <Link to="/dashboard" className={`nav__link ${isActive('/dashboard') ? 'active' : ''}`}>
                  <FaHome className="nav__icon" />
                  <span className="nav__name">Inicio</span>
                </Link>
                
                <Link to="/dashboard/orders" className={`nav__link ${isActive('/dashboard/orders') ? 'active' : ''}`}>
                  <FaShopify className="nav__icon" />
                  <span className="nav__name">Pedidos</span>
                </Link>
                
                <Link to="/dashboard/form" className={`nav__link ${isActive('/dashboard/form') ? 'active' : ''}`}>
                  <FaWpforms className="nav__icon" />
                  <span className="nav__name">Productos/Categorias</span>
                </Link>
                
                <Link to="/cart" className={`nav__link ${isActive('/cart') ? 'active' : ''}`}>
                  <FaShoppingCart className="nav__icon" />
                  <span className="nav__name">Carrito de Compras</span>
                </Link>
                
                {user?.isAdmin && (
                  <>
                    <h3 className="nav__subtitle">Admin</h3>
                    
                    <Link to="/dashboard/products-table" className={`nav__link ${isActive('/dashboard/products-table') ? 'active' : ''}`}>
                      <FaBox className="nav__icon" />
                      <span className="nav__name">Productos</span>
                    </Link>
                    
                    <Link to="/dashboard/categories-table" className={`nav__link ${isActive('/dashboard/categories-table') ? 'active' : ''}`}>
                      <FaTags className="nav__icon" />
                      <span className="nav__name">Categorias</span>
                    </Link>
                    
                    <Link to="/dashboard/users-table" className={`nav__link ${isActive('/dashboard/users-table') ? 'active' : ''}`}>
                      <FaUsers className="nav__icon" />
                      <span className="nav__name">Usuarios</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* User Info Section */}
          <div className="user-info-section">
            <div className="user-profile">
              <div className="user-avatar-3d">
                <FaUser className="user-icon-3d" />
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name || 'Usuario'}</span>
                <span className="user-role">{user?.isAdmin ? 'Administrador' : 'Usuario'}</span>
              </div>
            </div>
            
            <a href="#" className="nav__link nav__logout" onClick={(e) => { e.preventDefault(); logoutUser(); }}>
              <FaSignInAlt className="nav__icon" />
              <span className="nav__name">Cerrar Sesión</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;