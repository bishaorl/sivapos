import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [tempPassword, setTempPassword] = useState(""); // For storing temporary password
  const [showTempPassword, setShowTempPassword] = useState(false);

  const { name, email, password, isAdmin } = formData;
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Intencionalmente vacío por razones de seguridad
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
  
  const toggleTempPasswordVisibility = () => {
    setShowTempPassword(!showTempPassword);
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
    setTempPassword(newPassword);
    return newPassword;
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
            placeholder="Nueva Contraseña (dejar en blanco para mantener la actual)"
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

        {/* Show reveal password button for admins if there's a temp password */}
        {currentUser?.isAdmin && tempPassword && (
          <div className="form-input">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Contraseña temporal:</span>
              <input
                type={showTempPassword ? "text" : "password"}
                value={tempPassword}
                readOnly
                style={{ flex: 1 }}
              />
              <span 
                onClick={toggleTempPasswordVisibility}
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '0 5px'
                }}
              >
                {showTempPassword ? '👁️' : '👁️‍🗨️'}
              </span>
              <button 
                type="button"
                onClick={() => navigator.clipboard.writeText(tempPassword)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Copiar
              </button>
            </div>
          </div>
        )}

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
          <button className="product-btn">Actualizar Usuario</button>
        </div>
        
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f0f8ff', 
          border: '1px solid #add8e6', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#333'
        }}>
          <strong>Nota:</strong> Por razones de seguridad, las contraseñas no se muestran. 
          Ingrese una nueva contraseña solo si desea cambiarla.
        </div>
      </form>
    </div>
  );
};

export default EditUser;