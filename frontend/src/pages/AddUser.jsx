import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const AddUser = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false
  });

  const { name, email, password, isAdmin } = formData;
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prevState => ({
      ...prevState,
      password: newPassword
    }));
    return newPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.warning("Por favor, complete todos los campos requeridos");
      return;
    }

    dispatch(register({ name, email, password, isAdmin }))
      .then(() => {
        toast.success("Usuario agregado exitosamente");
        setFormData({
          name: "",
          email: "",
          password: "",
          isAdmin: false
        });
        if (closeModal) closeModal();
      })
      .catch((error) => {
        toast.error("Error al agregar usuario");
        console.error("Error al agregar usuario:", error);
      });
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <button 
          type="button" 
          className="exit" 
          onClick={() => { 
            if (closeModal) closeModal();
          }}
        >
          X
        </button>
        <div className="add-form">
          <h1 className="new-product">Agregar Usuario</h1>
        </div>

        <div className="form-input">
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <input
            type="password"
            placeholder="Contraseña"
            name="password"
            value={password}
            onChange={onChange}
          />
        </div>

        {/* Button to generate random password for admins */}
        {currentUser?.isAdmin && (
          <div className="form-input">
            <button 
              type="button"
              onClick={generateRandomPassword}
              style={{
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Generar Contraseña Aleatoria
            </button>
          </div>
        )}

        <div className="form-input">
          <label>
            <input
              type="checkbox"
              name="isAdmin"
              checked={isAdmin}
              onChange={onChange}
            />
            ¿Es administrador?
          </label>
        </div>

        <div className="form-input">
          <button className="product-btn">Agregar Usuario</button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;