import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  FaSignInAlt,
  FaBox,
  FaTags,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { FcTimeline } from "react-icons/fc";
import { FcHome } from "react-icons/fc";
import { FcServices } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { FcMoneyTransfer } from "react-icons/fc";
import { FcCurrencyExchange } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

const SidebarLeft = ({ onSearchTermChange }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);

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

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileActive(!isMobileActive);
  };

  // Close mobile sidebar when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth <= 992) {
      setIsMobileActive(false);
    }
  };

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button 
        className="mobile-nav-toggle"
        onClick={toggleMobileSidebar}
      >
        {isMobileActive ? <FaTimes /> : <FaBars />}
      </button>

      <div 
        className={`sidebarLeft ${isExpanded ? 'expanded' : ''} ${isMobileActive ? 'active' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="nav__container">
          <div>
            <a href="/dashboard" className="logo-sidebar">
            <img src={require("../images/logo.png")}
            width="40"
            height="40"
            alt="logo"
            />              
              <span className="logo-3d-sidebar">SiVaPOS</span>
            </a>

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
                
                <Link to="/dashboard" className={`nav__link ${isActive('/dashboard') ? 'active' : ''}`} onClick={handleLinkClick}>                                    
                  <FcHome size={24} color="#007bff" className="nav__icon" />
                  <span className="nav__name">Inicio</span>
                </Link>
                
                <Link to="/dashboard/orders" className={`nav__link ${isActive('/dashboard/orders') ? 'active' : ''}`} onClick={handleLinkClick}>
                  <FcMoneyTransfer size={24} className="nav__icon" />
                  <span className="nav__name">Pedidos</span>
                </Link>
                
                <Link to="/cart" className={`nav__link ${isActive('/cart') ? 'active' : ''}`} onClick={handleLinkClick}>                  
                  <FcCurrencyExchange size={30} className="nav__icon" />
                  <span className="nav__name">Facturar Compras</span>
                </Link>
                
                {user?.isAdmin && (
                  <>
                    <h3 className="nav__subtitle">Admin</h3>
                    
                    <Link to="/dashboard/products-table" className={`nav__link ${isActive('/dashboard/products-table') ? 'active' : ''}`} onClick={handleLinkClick}>
                      <FaBox size={24} color="red" className="nav__icon" />
                      <span className="nav__name">Productos</span>
                    </Link>
                    
                    <Link to="/dashboard/categories-table" className={`nav__link ${isActive('/dashboard/categories-table') ? 'active' : ''}`} onClick={handleLinkClick}>
                      <FcTimeline size={24} color="cyan" className="nav__icon" />
                      <span className="nav__name">Categorias</span>
                    </Link>
                    
                    <Link to="/dashboard/users-table" className={`nav__link ${isActive('/dashboard/users-table') ? 'active' : ''}`} onClick={handleLinkClick}>
                      <FcPortraitMode size={24} className="nav__icon" />
                      <span className="nav__name">Usuarios</span>
                    </Link>
                    
                    <Link to="/dashboard/configuration" className={`nav__link ${isActive('/dashboard/configuration') ? 'active' : ''}`} onClick={handleLinkClick}>
                      <FcServices color="24" className="nav__icon" />
                      <span className="nav__name">Configuración</span>
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
            
            <a href="/" className="nav__link nav__logout" onClick={(e) => { e.preventDefault(); logoutUser(); handleLinkClick(); }}>
              <FaSignInAlt size={30} color="red" className="nav__icon" />
              <span className="nav__name">Cerrar Sesión</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLeft;