import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const EditUser = ({ user, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password, isAdmin } = formData;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        isAdmin: user.isAdmin || false
      });
    }
  }, [user]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.warning("Por favor, complete todos los campos requeridos");
      return;
    }
    
    // Verificar que el ID del usuario esté presente
    if (!user || !user._id) {
      toast.error("Error: ID de usuario no encontrado");
      console.error("ID de usuario no encontrado:", user);
      return;
    }

    // Only send password if it's not empty
    const userData = { name, email, isAdmin };
    if (password) {
      userData.password = password;
    }

    console.log('Dispatching updateUser with:', { userId: user._id, userData });
    
    dispatch(updateUser({ userId: user._id, userData }))
      .then(() => {
        toast.success("Usuario actualizado exitosamente");
        if (closeModal) closeModal();
      })
      .catch((error) => {
        console.error("Error al actualizar usuario:", error);
        // Mostrar mensaje de error más específico si está disponible
        if (error.payload && error.payload.message) {
          toast.error(`Error: ${error.payload.message}`);
        } else {
          toast.error("Error al actualizar usuario");
        }
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
          <h1 className="new-product">Editar Usuario</h1>
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

        <div className="form-input password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva Contraseña (dejar en blanco para no cambiar)"
            name="password"
            value={password}
            onChange={onChange}
          />
          <span 
            className="password-toggle" 
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>

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
          <button className="product-btn">Actualizar Usuario</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;