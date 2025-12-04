import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../features/category/categorySlice";
import {
  productCreate,
  handleChange,
  clearValues,
  editProduct,
  addProduct,
} from "../features/product/productSlice";
import { toast } from "react-toastify";

const AddProduct = ({ closeModal }) => {
  const {
    name,
    stock,
    image,
    price,
    category,
    isEditing,
    editProductId,
    loading,
  } = useSelector((store) => store.product);
  const { categories } = useSelector((store) => store.category);
  const { user: currentUser } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

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

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    dispatch(handleChange({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !stock || !price || !category) {
      toast.warning("Por favor, complete todos los campos requeridos");
      return;
    }

    if (isEditing) {
      dispatch(
        editProduct({
          product: {
            id: editProductId,
            name,
            stock: Number(stock),
            image,
            price: Number(price),
            category,
            userId: currentUser.id,
          },
        })
      ).then(() => {
        // Solo cerrar el modal después de que la actualización sea exitosa
        dispatch(clearValues());
        if (closeModal) closeModal();
      });
      return;
    }
    
    // Para creación de nuevos productos
    dispatch(productCreate({ name, stock, image, price, category }))
      .then((result) => {
        // Agregar el nuevo producto a la lista
        if (result.payload) {
          dispatch(addProduct(result.payload));
        }
        // Mostrar mensaje de éxito
        toast.success("Producto agregado exitosamente");
        // Cerrar el modal inmediatamente
        dispatch(clearValues());
        if (closeModal) closeModal();
      });
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <button type="button" className="exit" onClick={() => { dispatch(clearValues()); if (closeModal) closeModal(); }}>
          X
        </button>
        <div className="add-form">
          <h1 className="new-product">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h1>
        </div>

        <div className="form-input">
          <input
            type="text"
            placeholder="Nombre del Producto"
            name="name"
            value={name}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            value={stock}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <div className="image-upload-container">
            <input
              type="text"
              placeholder="Enlace de Imagen del Producto"
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
          <input
            type="number"
            placeholder="Precio"
            name="price"
            value={price}
            onChange={onChange}
          />
        </div>

        <div className="form-input">
          <select
            className="select-category"
            name="category"
            onChange={onChange}
          >
            <option value="">Seleccionar Categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-input">
          {isEditing ? (
            <button className="product-btn" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Producto"}
            </button>
          ) : (
            <button className="product-btn">Agregar Producto</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
