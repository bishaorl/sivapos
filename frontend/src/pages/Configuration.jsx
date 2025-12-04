import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSetting, saveSetting, reset } from "../features/setting/settingSlice";
import { toast } from "react-toastify";
import { FaSave, FaImage, FaBuilding, FaIdCard, FaMapMarker, FaPhone, FaEnvelope, FaPercentage, FaChartLine, FaTimes } from "react-icons/fa";

const Configuration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setting, isLoading, isError, isSuccess, message } = useSelector((state) => state.setting);
  
  const [formData, setFormData] = useState({
    name: "",
    rif: "",
    dir: "",
    telefono: "",
    email: "",
    logo: "",
    impuesto: "",
    tasa_imp: ""
  });
  
  const fileInputRef = useRef(null);

  const { name, rif, dir, telefono, email, logo, impuesto, tasa_imp } = formData;

  useEffect(() => {
    dispatch(getSetting());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setFormData({
        name: setting.name || "",
        rif: setting.rif || "",
        dir: setting.dir || "",
        telefono: setting.telefono || "",
        email: setting.email || "",
        logo: setting.logo || "",
        impuesto: setting.impuesto || "",
        tasa_imp: setting.tasa_imp || ""
      });
    }
  }, [setting]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const settingData = {
      name,
      rif,
      dir,
      telefono,
      email,
      logo,
      impuesto,
      tasa_imp: parseFloat(tasa_imp) || 0
    };
    
    dispatch(saveSetting(settingData));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="configuration-page">
      <div className="page-header">
        <h2 className="page-title">Configuración del Sistema</h2>
        <button className="close-button-3d" onClick={handleClose} title="Cerrar">
          <FaTimes className="close-icon" />
        </button>
      </div>
      
      <div className="configuration-card">
        <form onSubmit={onSubmit} className="configuration-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FaBuilding className="form-icon" /> Nombre de la Empresa *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="form-input"
                placeholder="Nombre de la empresa"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rif" className="form-label">
                <FaIdCard className="form-icon" /> RIF *
              </label>
              <input
                type="text"
                id="rif"
                name="rif"
                value={rif}
                onChange={onChange}
                className="form-input"
                placeholder="J-12345678-9"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="dir" className="form-label">
              <FaMapMarker className="form-icon" /> Dirección *
            </label>
            <input
              type="text"
              id="dir"
              name="dir"
              value={dir}
              onChange={onChange}
              className="form-input"
              placeholder="Dirección completa de la empresa"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                <FaPhone className="form-icon" /> Teléfono *
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={telefono}
                onChange={onChange}
                className="form-input"
                placeholder="+58 123 456 7890"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="form-icon" /> Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-input"
                placeholder="empresa@ejemplo.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <FaImage className="form-icon" /> Logo de la Empresa
            </label>
            <div className="image-upload-container">
              <input
                type="text"
                value={logo}
                onChange={onChange}
                name="logo"
                className="form-input"
                placeholder="URL del logo o subir imagen"
                style={{ paddingRight: '120px' }}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button 
                type="button"
                className="browse-button-3d"
                onClick={triggerFileSelect}
              >
                Buscar
              </button>
            </div>
            {logo && (
              <div className="logo-preview">
                <img src={logo} alt="Vista previa del logo" className="logo-preview-image" />
              </div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="impuesto" className="form-label">
                <FaChartLine className="form-icon" /> Nombre del Impuesto *
              </label>
              <input
                type="text"
                id="impuesto"
                name="impuesto"
                value={impuesto}
                onChange={onChange}
                className="form-input"
                placeholder="IVA, ISLR, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tasa_imp" className="form-label">
                <FaPercentage className="form-icon" /> Tasa del Impuesto (%)
              </label>
              <input
                type="number"
                id="tasa_imp"
                name="tasa_imp"
                value={tasa_imp}
                onChange={onChange}
                className="form-input"
                placeholder="16"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-button-3d" disabled={isLoading}>
              <FaSave className="button-icon" /> Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuration;