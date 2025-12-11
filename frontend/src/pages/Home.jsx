import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <a href="/" className="logo">
              <img 
                src={require("../images/logo.png")}
                width="48" 
                height="48" 
                alt="logo" 
                className="logo-img"
              />
            </a>
            <div className="logo-3d">SiVa</div>
          </div>
          
          <nav className="home-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/login" className="nav-link">Iniciar Sesión</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Registrarse</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="home-main">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Sistema
              <span className="hero-subtitle">PUNTO DE VENTAS</span>
            </h1>
            
            <div className="hero-description">
              <p>
                - Interfaz fácil de administrar.
                <br />- Capacidad para rastrear y categorizar productos fácilmente. 
                <br />- Creando pedidos y facturación pedidos creados.
                <br />- Posibilidad de editar y eliminar productos y pedidos según
                estado de autorización.
              </p>
            </div>
            
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn-secondary">Registrarse</Link>
            </div>
          </div>
          
          <div className="hero-image">
            <img 
              src={require("../images/pos-bg.png")} 
              alt="Sistema punto de ventas" 
              className="background-img"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
