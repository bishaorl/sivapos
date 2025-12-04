import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section>
      <header>
        <a href="/" className="logo">
        <img src={require("../images/logo.png")}
        width="48"
        height="48"
        alt="logo"
        />
        </a>
        <div className="logo-3d">SiVa</div>
        <div className="circles"></div>
        <h1>
        <span>Gestion Punto de Venta</span>
        </h1>
        <ul>
          <li>
            <Link to="/login">Iniciar Sesion</Link>
          </li>
          <li>
            <Link to="/register">Registrarse</Link>
          </li>
        </ul>
      </header>
      <div className="texts">
        <h1>
          Sistema
          <br />
          <span>PUNTO DE VENTAS</span>
        </h1>
      </div>
      <div className="texts">        
        <p>
          - Interfaz fácil de administrar.
          <br />- Capacidad para rastrear y categorizar productos fácilmente. 
          <br />- Creando pedidos y facturación pedidos creados.
          <br />- Posibilidad de editar y eliminar productos y pedidos según
          estado de autorización.
        </p>
      </div>
      <div className="background_image">
        <img src={require("../images/pos-bg.png")} alt="..." />
      </div>
    </section>
  );
};

export default Home;
