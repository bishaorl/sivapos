import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import "../styles/login.css";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, success, message } = useSelector((state) => state.auth);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  // Componente de Login simplificado para el modal
  const LoginForm = () => {
    const [form, setForm] = useState({
      email: "",
      password: "",
    });

    const { email, password } = form;

    const onChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const userData = {
        email,
        password,
      };
      
      dispatch(login(userData)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          // Login exitoso
          toast.success('Inicio de Sesión Exitoso');
          closeLoginModal();
          navigate("/dashboard");
        } else {
          // Error en login
          toast.error(result.payload || 'Error en inicio de sesión');
        }
      });
    };

    return (
      <div className="login-modal-form">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="formInput">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div className="formInput">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="btn-grad">
            Iniciar Sesión
          </button>

          <div className="login-modal-footer">
            <a href="/">Regresar a Página de Inicio</a>
          </div>
        </form>
      </div>
    );
  };

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
          
          {/* <nav className="home-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <button onClick={openLoginModal} className="nav-link">Iniciar Sesión</button>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Registrarse</Link>
              </li>
            </ul>
          </nav> */}
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
              <button onClick={openLoginModal} className="btn btn-primary">Iniciar Sesión</button>
              {/* <Link to="/register" className="btn btn-secondary">Registrarse</Link> */}
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

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={closeLoginModal}>
          <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="login-modal-close" onClick={closeLoginModal}>
              ×
            </button>
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;