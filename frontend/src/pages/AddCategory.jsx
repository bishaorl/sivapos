import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  categoryCreate,
  handleChange,
  clearValues,
  updateCategory,
} from "../features/category/categorySlice";
import { toast } from "react-toastify";

const AddCategory = ({ closeModal }) => {
  const { category, image, isEditing, editCategoryId } = useSelector((store) => store.category);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(handleChange({ name: 'image', value: reader.result }));
        toast.success('Imagen seleccionada correctamente');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Por favor ingrese el nombre de la categoría");
      return;
    }

    if (isEditing) {
      // Actualizar categoría existente
      if (!editCategoryId) {
        toast.error("ID de categoría no encontrado");
        return;
      }
      
      dispatch(updateCategory({ categoryId: editCategoryId, categoryData: { category, image } }))
        .then(() => {
          toast.success("Categoría actualizada exitosamente");
          dispatch(clearValues());
          if (closeModal) closeModal();
        })
        .catch((error) => {
          console.error('Error updating category:', error);
          toast.error("Error al actualizar la categoría");
        });
    } else {
      // Crear nueva categoría
      dispatch(categoryCreate({ category, image }))
        .then(() => {
          toast.success("Categoría agregada exitosamente");
          dispatch(clearValues());
          if (closeModal) closeModal();
        })
        .catch((error) => {
          console.error('Error creating category:', error);
          toast.error("Error al agregar la categoría");
        });
    }
  };

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.name === 'category' 
      ? e.target.value.replace(/\s+/g, "-").toLowerCase()
      : e.target.value;
    dispatch(handleChange({ name, value }));
  };

  return (
    <div className="form-container">
      <form className="form category-form" onSubmit={handleSubmit}>
        <button 
          type="button" 
          className="exit" 
          onClick={() => { 
            dispatch(clearValues()); 
            if (closeModal) closeModal(); 
          }}
        >
          X
        </button>
        <div className="add-form">
          <h1 className="new-product">
            {isEditing ? "Editar Categoría" : "Agregar Categoría"}
          </h1>
        </div>
        <div className="form-input">
          <input
            type="text"
            placeholder="Nombre de la Categoría"
            name="category"
            value={category}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <div className="image-upload-container">
            <input
              type="text"
              placeholder="Enlace de Imagen de la Categoría"
              name="image"
              value={image}
              onChange={onChange}
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
        </div>

        <div className="form-input">
          <button className="product-btn">
            {isEditing ? "Actualizar Categoría" : "Agregar Categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;