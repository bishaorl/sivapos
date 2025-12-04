import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../features/auth/authSlice";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, success, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(message);
    }
    if (success || user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [error, success, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  return (
    <>
      <div className="auth-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h1>Inicio de Sesion</h1>

          <div className="formInput">
            <label>Correo</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>

          <div className="formInput">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>

          <button type="submit" className="btn-grad">
            Iniciar Sesion
          </button>

          <div className="home">
            <a href="/">Regresar a Pagina de Inicio</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
